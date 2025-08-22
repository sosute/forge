/**
 * コードクリーンアップ分析モジュール
 */

import { SEVERITY, LEGACY_GA_PATTERNS, ADOBE_PATTERNS } from '../config.js';
import { debugLog } from '../utils/debug.js';

/**
 * クリーンアップ関連の問題を検出
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
export function detectCleanupIssues(targetElements = null) {
  const issues = [];

  // 古いGoogle Analytics検知
  const gaIssues = checkLegacyGoogleAnalytics(targetElements);
  issues.push(...gaIssues);

  // 古いGTMコンテナ検知
  const gtmIssues = checkLegacyGTMContainer(targetElements);
  issues.push(...gtmIssues);

  // Adobe Analytics検知
  const adobeIssues = checkAdobeAnalytics(targetElements);
  issues.push(...adobeIssues);

  // 不要なnoscriptタグ検知
  const noscriptIssues = checkUnnecessaryNoScript(targetElements);
  issues.push(...noscriptIssues);

  // 古いROBOTSメタタグ検知
  const robotsIssues = checkOldRobotsMetaTags();
  issues.push(...robotsIssues);

  // 廃止されたmetaタグ検知
  const deprecatedMetaIssues = checkDeprecatedMetaTags();
  issues.push(...deprecatedMetaIssues);

  return issues;
}

/**
 * 古いGoogle Analyticsコードをチェック
 * @returns {Array} 古いGA関連の問題リスト
 */
function checkLegacyGoogleAnalytics() {
  const issues = [];
  const scripts = document.querySelectorAll('script');
  const problematicScripts = [];

  Array.from(scripts).forEach(script => {
    const content = script.textContent || script.innerHTML || '';
    const src = script.src || '';
    
    // UAパターンまたは古いGA JSファイルをチェック
    const hasLegacyPattern = LEGACY_GA_PATTERNS.some(pattern => 
      pattern.test(content) || pattern.test(src)
    );
    
    if (hasLegacyPattern) {
      debugLog('Checker', 'Legacy GA code detected:', content.substring(0, 100));
      problematicScripts.push(script);
    }
  });

  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.WARNING,
      rule: 'legacy_google_analytics',
      name: '古いGoogle Analyticsコード',
      message: `${problematicScripts.length}個の古いGoogle Analytics（UA-）コードが検出されました。Google Analytics 4（GA4）への移行を検討してください。`,
      elements: problematicScripts,
      solution: getLegacyGASolution()
    });
  }

  return issues;
}

/**
 * 古いGTMコンテナをチェック
 * @returns {Array} 古いGTM関連の問題リスト
 */
function checkLegacyGTMContainer() {
  const issues = [];
  const scripts = document.querySelectorAll('script');
  const problematicScripts = [];

  // 特定の古いGTMコンテナIDをチェック（元の実装から）
  const legacyGTMPattern = /GTM-[A-Z0-9]{6,7}/g;

  Array.from(scripts).forEach(script => {
    const content = script.textContent || script.innerHTML || '';
    const src = script.src || '';
    
    if (legacyGTMPattern.test(content) || legacyGTMPattern.test(src)) {
      // ここで特定の古いコンテナIDかどうかを判定
      const matches = (content + src).match(legacyGTMPattern);
      if (matches) {
        debugLog('Checker', 'GTM container detected:', matches);
        problematicScripts.push(script);
      }
    }
  });

  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'legacy_gtm_container',
      name: '古いGTMコンテナの可能性',
      message: `${problematicScripts.length}個のGoogle Tag Managerコンテナが検出されました。使用していない古いコンテナがないか確認してください。`,
      elements: problematicScripts,
      solution: getLegacyGTMSolution()
    });
  }

  return issues;
}

/**
 * Adobe Analyticsコードをチェック
 * @returns {Array} Adobe Analytics関連の問題リスト
 */
function checkAdobeAnalytics() {
  const issues = [];
  const scripts = document.querySelectorAll('script');
  const problematicScripts = [];

  Array.from(scripts).forEach(script => {
    const content = script.textContent || script.innerHTML || '';
    const src = script.src || '';
    
    const hasAdobePattern = ADOBE_PATTERNS.some(pattern => 
      pattern.test(content) || pattern.test(src)
    );
    
    if (hasAdobePattern) {
      debugLog('Checker', 'Adobe Analytics code detected:', content.substring(0, 100));
      problematicScripts.push(script);
    }
  });

  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'adobe_analytics_code',
      name: 'Adobe Analyticsコード',
      message: `${problematicScripts.length}個のAdobe Analytics/Omnitureコードが検出されました。使用していない場合は削除を検討してください。`,
      elements: problematicScripts,
      solution: getAdobeAnalyticsSolution()
    });
  }

  return issues;
}

/**
 * 不要なnoscriptタグをチェック
 * @returns {Array} noscript関連の問題リスト
 */
function checkUnnecessaryNoScript() {
  const issues = [];
  const noscriptTags = document.querySelectorAll('noscript');
  const problematicTags = [];

  Array.from(noscriptTags).forEach(noscript => {
    const content = noscript.innerHTML.trim();
    
    // 空または<!-- -->コメントのみの場合
    const isEmpty = content === '' || /^<!--.*-->$/.test(content.replace(/\s/g, ''));
    
    if (isEmpty) {
      debugLog('Checker', 'Empty noscript tag detected');
      problematicTags.push(noscript);
    }
  });

  if (problematicTags.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'unnecessary_noscript',
      name: '不要なnoscriptタグ',
      message: `${problematicTags.length}個の空または不要なnoscriptタグが検出されました。`,
      elements: problematicTags,
      solution: getUnnecessaryNoScriptSolution()
    });
  }

  return issues;
}

/**
 * 古いROBOTSメタタグをチェック
 * @returns {Array} ROBOTS関連の問題リスト
 */
function checkOldRobotsMetaTags() {
  const issues = [];
  const metaTags = document.querySelectorAll('meta[name="robots"]');
  const problematicTags = [];

  Array.from(metaTags).forEach(meta => {
    const content = meta.getAttribute('content') || '';
    
    // 古いROBOTSディレクティブをチェック
    const hasOldDirectives = /\b(NOODP|NOYDIR|NOARCHIVE)\b/i.test(content);
    
    if (hasOldDirectives) {
      debugLog('Checker', 'Old ROBOTS directive detected:', content);
      problematicTags.push(meta);
    }
  });

  if (problematicTags.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.WARNING,
      rule: 'old_robots_meta',
      name: '古いROBOTSメタタグ',
      message: `${problematicTags.length}個の古いROBOTSディレクティブ（NOODP、NOYDIR、NOARCHIVE）が検出されました。これらは現在サポートされていません。`,
      elements: problematicTags,
      solution: getOldRobotsMetaSolution()
    });
  }

  return issues;
}

/**
 * 廃止されたmetaタグをチェック
 * @returns {Array} 廃止されたmeta関連の問題リスト
 */
function checkDeprecatedMetaTags() {
  const issues = [];
  const keywordsMeta = document.querySelectorAll('meta[name="keywords"]');

  if (keywordsMeta.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'deprecated_meta_keywords',
      name: '廃止されたmeta keywordsタグ',
      message: `${keywordsMeta.length}個のmeta keywordsタグが検出されました。現在のSEOでは効果がなく、削除を推奨します。`,
      elements: Array.from(keywordsMeta),
      solution: getDeprecatedMetaSolution()
    });
  }

  return issues;
}

/**
 * 古いGA解決策テキスト
 */
function getLegacyGASolution() {
  return `古いGoogle Analyticsコードの対応:

🚨 問題: UA-xxxxxxx-x形式の古いトラッキングコード
🔧 修正: Google Analytics 4（GA4）への移行

✅ GA4移行手順:
1. GA4プロパティの作成
2. gtag.jsまたはGTMでの新しいトラッキング設定
3. 古いanalytics.jsコードの削除

📖 影響: 2023年7月以降、UAプロパティは動作停止`;
}

/**
 * 古いGTM解決策テキスト
 */
function getLegacyGTMSolution() {
  return `GTMコンテナの確認:

✅ 確認項目:
• 使用中のコンテナかどうか
• 複数コンテナの必要性
• 古い実装の削除

🔧 推奨対応:
• 不要なコンテナコードの削除
• GTMでの一元管理`;
}

/**
 * Adobe Analytics解決策テキスト
 */
function getAdobeAnalyticsSolution() {
  return `Adobe Analyticsコードの確認:

✅ 確認項目:
• 現在も使用しているか
• 他の解析ツールとの重複

🔧 推奨対応:
• 不要な場合は削除
• パフォーマンス向上のため最適化`;
}

/**
 * 不要なnoscript解決策テキスト
 */
function getUnnecessaryNoScriptSolution() {
  return `不要なnoscriptタグの対応:

🚨 問題: 空または意味のないnoscriptタグ
🔧 修正: 不要なタグの削除

✅ 適切な使用:
• JavaScriptが無効な場合の代替コンテンツのみ
• 空のタグは削除`;
}

/**
 * 古いROBOTSメタ解決策テキスト
 */
function getOldRobotsMetaSolution() {
  return `古いROBOTSディレクティブの対応:

🚨 問題: NOODP、NOYDIR、NOARCHIVEディレクティブ
🔧 修正: サポートされているディレクティブに変更

✅ 現在有効なディレクティブ:
• index/noindex
• follow/nofollow
• nosnippet
• noarchive（Googleでサポート継続）`;
}

/**
 * 廃止されたmeta解決策テキスト
 */
function getDeprecatedMetaSolution() {
  return `meta keywordsタグの対応:

🚨 問題: <meta name="keywords" content="...">
🔧 修正: タグの削除

📖 理由:
• 検索エンジンはkeywordsメタタグを無視
• スパムの温床となったため廃止
• 現在はコンテンツの質が重要`;
}