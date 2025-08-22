/**
 * SEO分析モジュール
 */

import { SEVERITY } from '../config.js';
import { debugLog } from '../utils/debug.js';

/**
 * SEO要素の全体分析
 * @returns {Object} SEO分析結果
 */
export function analyzeSEO() {
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  
  return {
    title: {
      exists: !!document.title,
      length: document.title.length,
      isOptimal: document.title.length >= 30 && document.title.length <= 60
    },
    metaDescription: {
      exists: !!metaDescription,
      length: metaDescription ? metaDescription.getAttribute('content').length : 0,
      isOptimal: metaDescription ? 
        metaDescription.getAttribute('content').length >= 120 && 
        metaDescription.getAttribute('content').length <= 160 : false
    },
    hasKeywords: !!metaKeywords,
    hasCanonical: !!canonicalLink,
    openGraph: {
      hasOgTitle: !!document.querySelector('meta[property="og:title"]'),
      hasOgDescription: !!document.querySelector('meta[property="og:description"]'),
      hasOgImage: !!document.querySelector('meta[property="og:image"]')
    }
  };
}

/**
 * SEO関連の問題を検出
 * @returns {Array} 検出された問題のリスト
 */
export function detectSEOIssues() {
  const issues = [];

  // メタ要素のチェック
  const metaIssues = checkMetaElements();
  issues.push(...metaIssues);

  // 重複メタ要素のチェック
  const duplicateIssues = checkDuplicateMetaElements();
  issues.push(...duplicateIssues);

  // Open Graphのチェック
  const ogIssues = checkOpenGraph();
  issues.push(...ogIssues);

  return issues;
}

/**
 * メタ要素をチェック
 * @returns {Array} メタ要素に関する問題リスト
 */
function checkMetaElements() {
  const issues = [];

  // ページタイトルチェック
  if (!document.title || document.title.trim().length === 0) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.ERROR,
      rule: 'missing_title',
      name: 'ページタイトルの欠落',
      message: 'ページにタイトルが設定されていません',
      elements: [],
      solution: getTitleSolution()
    });
  } else if (document.title.length < 30 || document.title.length > 60) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.WARNING,
      rule: 'suboptimal_title_length',
      name: 'タイトルの長さが不適切',
      message: `タイトルの長さが${document.title.length}文字です（推奨: 30-60文字）`,
      elements: [],
      solution: getTitleLengthSolution()
    });
  }

  // メタディスクリプションチェック
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.WARNING,
      rule: 'missing_meta_description',
      name: 'メタディスクリプションの欠落',
      message: 'メタディスクリプションが設定されていません',
      elements: [],
      solution: getMetaDescriptionSolution()
    });
  } else {
    const content = metaDescription.getAttribute('content') || '';
    if (content.length < 120 || content.length > 160) {
      issues.push({
        category: 'seo',
        severity: SEVERITY.INFO,
        rule: 'suboptimal_description_length',
        name: 'メタディスクリプションの長さが不適切',
        message: `メタディスクリプションの長さが${content.length}文字です（推奨: 120-160文字）`,
        elements: [metaDescription]
      });
    }
  }

  // canonicalリンクチェック
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.INFO,
      rule: 'missing_canonical',
      name: 'canonicalリンクの欠落',
      message: 'canonicalリンクが設定されていません',
      elements: [],
      solution: 'canonicalリンクを追加して、正規URLを明示してください'
    });
  }

  return issues;
}

/**
 * 重複するメタ要素をチェック
 * @returns {Array} 重複に関する問題リスト
 */
function checkDuplicateMetaElements() {
  const issues = [];

  // メタディスクリプションの重複チェック
  const metaDescriptions = document.querySelectorAll('meta[name="description"]');
  if (metaDescriptions.length > 1) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.ERROR,
      rule: 'duplicate_meta_description',
      name: 'メタディスクリプションの重複',
      message: `${metaDescriptions.length}個のメタディスクリプションが存在します`,
      elements: Array.from(metaDescriptions),
      solution: '重複するメタディスクリプションを削除し、1つだけ残してください'
    });
  }

  // メタキーワードの重複チェック
  const metaKeywords = document.querySelectorAll('meta[name="keywords"]');
  if (metaKeywords.length > 1) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.WARNING,
      rule: 'duplicate_meta_keywords',
      name: 'メタキーワードの重複',
      message: `${metaKeywords.length}個のメタキーワードが存在します`,
      elements: Array.from(metaKeywords)
    });
  }

  // viewport の重複チェック
  const viewports = document.querySelectorAll('meta[name="viewport"]');
  if (viewports.length > 1) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.ERROR,
      rule: 'duplicate_viewport',
      name: 'viewportメタタグの重複',
      message: `${viewports.length}個のviewportメタタグが存在します`,
      elements: Array.from(viewports),
      solution: 'viewportメタタグは1つだけにしてください'
    });
  }

  return issues;
}

/**
 * Open Graphタグをチェック
 * @returns {Array} Open Graphに関する問題リスト
 */
function checkOpenGraph() {
  const issues = [];

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  // 基本的なOGタグの欠落チェック
  if (!ogTitle && !ogDescription && !ogImage) {
    issues.push({
      category: 'seo',
      severity: SEVERITY.INFO,
      rule: 'missing_open_graph',
      name: 'Open Graphタグの欠落',
      message: 'SNS共有用のOpen Graphタグが設定されていません',
      elements: [],
      solution: getOpenGraphSolution()
    });
  } else {
    // 個別のOGタグチェック
    if (!ogTitle) {
      issues.push({
        category: 'seo',
        severity: SEVERITY.WARNING,
        rule: 'missing_og_title',
        name: 'og:titleの欠落',
        message: 'og:titleが設定されていません',
        elements: []
      });
    }

    if (!ogImage) {
      issues.push({
        category: 'seo',
        severity: SEVERITY.WARNING,
        rule: 'missing_og_image',
        name: 'og:imageの欠落',
        message: 'og:imageが設定されていません（SNS共有時に画像が表示されません）',
        elements: []
      });
    }
  }

  return issues;
}

/**
 * タイトルタグの解決策
 * @returns {string} 解決策のテキスト
 */
function getTitleSolution() {
  return `タイトルタグの設定方法:

<title>ページタイトル | サイト名</title>

重要なポイント:
• ページの内容を具体的に表現
• 主要キーワードを前方に配置
• 30-60文字程度に収める
• 各ページで固有のタイトルを設定`;
}

/**
 * タイトル長の解決策
 * @returns {string} 解決策のテキスト
 */
function getTitleLengthSolution() {
  return `タイトルの最適化:

現在のタイトル: ${document.title}

改善案:
• 短すぎる場合: より具体的な説明を追加
• 長すぎる場合: 重要な情報を前方に配置し、不要な部分を削除

例:
✅ 良い例: "商品名 - カテゴリ | ブランド名"（30-60文字）
❌ 悪い例: "トップ"（短すぎる）
❌ 悪い例: "商品名 - 詳細説明が長すぎて検索結果で省略されてしまう可能性がある..."（長すぎる）`;
}

/**
 * メタディスクリプションの解決策
 * @returns {string} 解決策のテキスト
 */
function getMetaDescriptionSolution() {
  return `メタディスクリプションの追加方法:

<meta name="description" content="ページの概要を120-160文字で記載">

記載のポイント:
• ページの内容を要約
• ユーザーがクリックしたくなる説明
• 主要キーワードを自然に含める
• 各ページで固有の説明を設定`;
}

/**
 * Open Graphの解決策
 * @returns {string} 解決策のテキスト
 */
function getOpenGraphSolution() {
  return `Open Graphタグの基本設定:

<meta property="og:title" content="ページタイトル">
<meta property="og:description" content="ページの説明">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">

効果:
• SNSでの見栄えが向上
• クリック率の改善
• ブランド認知度の向上`;
}