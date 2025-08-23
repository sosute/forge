/**
 * セマンティックHTML分析モジュール
 */

import { SEVERITY } from '../config.js';
import { debugLog } from '../utils/debug.js';

/**
 * セマンティック関連の問題を検出
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
export function detectSemanticIssues(targetElements = null) {
  const issues = [];

  // 日付情報のDIVタグ使用チェック
  const dateIssues = checkDateInformation(targetElements);
  issues.push(...dateIssues);

  return issues;
}

/**
 * DIVタグで日付情報を表現している箇所をチェック
 * @returns {Array} 日付情報に関する問題リスト
 */
function checkDateInformation() {
  const issues = [];
  const divElements = document.querySelectorAll('div');
  const problematicElements = [];

  // 日付パターン（元の実装から復元）
  const datePatterns = [
    /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/, // 2023-01-15, 2023/01/15
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/, // 15-01-2023, 15/01/2023
    /\b\d{4}年\d{1,2}月\d{1,2}日\b/, // 2023年1月15日
    /\b\d{1,2}月\d{1,2}日\b/, // 1月15日
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/i, // Jan 15, 2023
    /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/i, // 15 Jan 2023
  ];

  Array.from(divElements).forEach(div => {
    const text = div.textContent.trim();

    // 日付パターンに一致し、すでにtimeタグで囲まれていない場合
    if (datePatterns.some(pattern => pattern.test(text))) {
      // timeタグが子要素にないかチェック
      const hasTimeTag = div.querySelector('time') !== null;
      // divの親がすでにtimeタグでないかチェック
      const isInTimeTag = div.closest('time') !== null;

      if (!hasTimeTag && !isInTimeTag && text.length < 100) {
        // 長すぎるテキストは除外
        debugLog(
          'Checker',
          `Date pattern found in div: ${text.substring(0, 50)}`
        );
        problematicElements.push(div);
      }
    }
  });

  if (problematicElements.length > 0) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.WARNING,
      rule: 'date_in_div',
      name: 'DIVタグでの日付情報表現',
      message: `${problematicElements.length}個のDIVタグで日付情報が表現されています。意味的により適切な<time>タグの使用を検討してください。`,
      elements: problematicElements,
      solution: getDateInformationSolution(),
    });
  }

  return issues;
}

/**
 * 日付情報の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getDateInformationSolution() {
  return `日付情報の適切な表現方法:

🚨 問題: <div>2023年1月15日</div>
🔧 修正: <time datetime="2023-01-15">2023年1月15日</time>

✅ 正しい使用例:
• <time datetime="2023-01-15">2023年1月15日</time>
• <time datetime="2023-01-15T10:30:00">2023年1月15日 10:30</time>
• <time datetime="2023-01">2023年1月</time>

📖 影響: 
• 検索エンジンが日付情報を正しく認識
• スクリーンリーダーで日付として適切に読み上げ
• 構造化データとしてより意味的に正確`;
}
