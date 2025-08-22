/**
 * HTML構造品質分析モジュール
 */

import { SEVERITY, PRESENTATIONAL_TAGS, INLINE_SEMANTIC_TAGS } from '../config.js';
import { debugLog } from '../utils/debug.js';

/**
 * HTML構造品質を分析
 * @returns {Object} 構造品質の分析結果
 */
export function analyzeStructure() {
  return {
    // セマンティック要素の使用状況
    semanticElements: {
      hasHeader: document.querySelector('header') !== null,
      hasNav: document.querySelector('nav') !== null,
      hasMain: document.querySelector('main') !== null,
      hasFooter: document.querySelector('footer') !== null,
      hasArticle: document.querySelector('article') !== null,
      hasSection: document.querySelector('section') !== null,
      hasAside: document.querySelector('aside') !== null
    },
    // 装飾要素の使用状況
    presentationalTags: countPresentationalTags(),
    // インラインスタイルの使用
    inlineStyles: document.querySelectorAll('[style]').length,
    // idの重複チェック
    duplicateIds: findDuplicateIds().length,
    // セマンティックスコア
    semanticScore: calculateSemanticScore()
  };
}

/**
 * 構造関連の問題を検出
 * @returns {Array} 検出された問題のリスト
 */
export function detectStructureIssues() {
  const issues = [];

  // セマンティック要素の欠落チェック
  const semanticIssues = checkMissingSemanticElements();
  issues.push(...semanticIssues);

  // 装飾用HTMLタグの使用チェック
  const presentationalIssues = checkPresentationalTags();
  issues.push(...presentationalIssues);

  // インラインスタイルのチェック
  const inlineStyleIssues = checkInlineStyles();
  issues.push(...inlineStyleIssues);

  // ID重複チェック
  const duplicateIdIssues = checkDuplicateIds();
  issues.push(...duplicateIdIssues);

  // 空要素チェック
  const emptyElementIssues = checkEmptyElements();
  issues.push(...emptyElementIssues);

  return issues;
}

/**
 * セマンティック要素の欠落をチェック
 * @returns {Array} セマンティック要素に関する問題リスト
 */
function checkMissingSemanticElements() {
  const issues = [];

  // main要素チェック
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.WARNING,
      rule: 'missing_main',
      name: 'main要素の欠落',
      message: 'ページにmain要素がありません。メインコンテンツをmain要素で囲むことを推奨します。',
      elements: [],
      solution: getMainElementSolution()
    });
  } else if (mainElements.length > 1) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.ERROR,
      rule: 'multiple_main',
      name: 'main要素の重複',
      message: `${mainElements.length}個のmain要素が存在します。1ページに1つのmain要素のみ使用してください。`,
      elements: Array.from(mainElements)
    });
  }

  // header要素チェック
  if (!document.querySelector('header')) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.INFO,
      rule: 'missing_header',
      name: 'header要素の欠落',
      message: 'ページヘッダー部分にheader要素の使用を推奨します。',
      elements: []
    });
  }

  // nav要素チェック
  const navigationLists = document.querySelectorAll('ul.nav, ul.navigation, div.nav, div.navigation');
  const hasNav = document.querySelector('nav') !== null;
  
  if (!hasNav && navigationLists.length > 0) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.INFO,
      rule: 'missing_nav',
      name: 'nav要素の欠落',
      message: 'ナビゲーションメニューにnav要素の使用を推奨します。',
      elements: Array.from(navigationLists)
    });
  }

  return issues;
}

/**
 * 装飾用HTMLタグの使用をチェック
 * @returns {Array} 装飾タグに関する問題リスト
 */
function checkPresentationalTags() {
  const issues = [];
  const presentationalElements = [];

  PRESENTATIONAL_TAGS.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 0) {
      presentationalElements.push(...Array.from(elements));
    }
  });

  if (presentationalElements.length > 0) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.WARNING,
      rule: 'presentational_tags',
      name: '装飾用HTMLタグの使用',
      message: `${presentationalElements.length}個の装飾用HTMLタグが使用されています。CSSでスタイリングすることを推奨します。`,
      elements: presentationalElements,
      solution: getPresentationalTagSolution()
    });
  }

  return issues;
}

/**
 * インラインスタイルをチェック
 * @returns {Array} インラインスタイルに関する問題リスト
 */
function checkInlineStyles() {
  const issues = [];
  const elementsWithInlineStyles = document.querySelectorAll('[style]');
  
  // SVGやcanvas要素を除外
  const filteredElements = Array.from(elementsWithInlineStyles).filter(el => {
    const tagName = el.tagName.toLowerCase();
    return tagName !== 'svg' && tagName !== 'canvas' && 
           !el.closest('svg') && tagName !== 'img';
  });

  if (filteredElements.length > 10) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.WARNING,
      rule: 'excessive_inline_styles',
      name: '過度なインラインスタイルの使用',
      message: `${filteredElements.length}個の要素でインラインスタイルが使用されています。外部CSSの使用を推奨します。`,
      elements: filteredElements.slice(0, 10), // 最初の10個のみ表示
      solution: getInlineStyleSolution()
    });
  }

  return issues;
}

/**
 * ID重複をチェック
 * @returns {Array} ID重複に関する問題リスト
 */
function checkDuplicateIds() {
  const issues = [];
  const duplicates = findDuplicateIds();

  duplicates.forEach(({id, elements}) => {
    issues.push({
      category: 'structure',
      severity: SEVERITY.ERROR,
      rule: 'duplicate_id',
      name: 'IDの重複',
      message: `ID "${id}" が${elements.length}個の要素で重複しています。`,
      elements: elements,
      solution: `各要素に一意のIDを割り当ててください。同じスタイルを適用する場合はclassを使用してください。`
    });
  });

  return issues;
}

/**
 * 空要素をチェック
 * @returns {Array} 空要素に関する問題リスト
 */
function checkEmptyElements() {
  const issues = [];
  
  // 空のdiv/span要素
  const emptyContainers = Array.from(document.querySelectorAll('div, span')).filter(el => {
    const hasText = el.textContent.trim().length > 0;
    const hasChildren = el.children.length > 0;
    const hasBackground = window.getComputedStyle(el).backgroundImage !== 'none';
    const hasPseudoContent = hasPseudoElement(el);
    
    return !hasText && !hasChildren && !hasBackground && !hasPseudoContent;
  });

  if (emptyContainers.length > 5) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.INFO,
      rule: 'empty_elements',
      name: '空の要素',
      message: `${emptyContainers.length}個の空のdiv/span要素が存在します。`,
      elements: emptyContainers.slice(0, 5) // 最初の5個のみ表示
    });
  }

  return issues;
}

/**
 * 装飾タグのカウント
 * @returns {number} 装飾タグの総数
 */
function countPresentationalTags() {
  let count = 0;
  PRESENTATIONAL_TAGS.forEach(tag => {
    count += document.querySelectorAll(tag).length;
  });
  return count;
}

/**
 * ID重複を検出
 * @returns {Array} 重複IDとその要素のリスト
 */
function findDuplicateIds() {
  const idMap = new Map();
  const duplicates = [];

  document.querySelectorAll('[id]').forEach(el => {
    const id = el.id;
    if (id) {
      if (!idMap.has(id)) {
        idMap.set(id, []);
      }
      idMap.get(id).push(el);
    }
  });

  idMap.forEach((elements, id) => {
    if (elements.length > 1) {
      duplicates.push({ id, elements });
    }
  });

  return duplicates;
}

/**
 * セマンティックスコアを計算
 * @returns {number} 0-100のスコア
 */
function calculateSemanticScore() {
  let score = 100;
  
  // セマンティック要素の使用でボーナス
  const semanticElements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  semanticElements.forEach(tag => {
    if (document.querySelector(tag)) {
      score += 5;
    }
  });

  // 装飾タグの使用でペナルティ
  const presentationalCount = countPresentationalTags();
  score -= Math.min(presentationalCount * 2, 30);

  // インラインスタイルでペナルティ
  const inlineStyleCount = document.querySelectorAll('[style]').length;
  score -= Math.min(inlineStyleCount, 20);

  // ID重複でペナルティ
  const duplicateIds = findDuplicateIds().length;
  score -= duplicateIds * 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * 擬似要素の存在をチェック
 * @param {Element} element - チェック対象の要素
 * @returns {boolean} 擬似要素が存在する場合true
 */
function hasPseudoElement(element) {
  const styles = window.getComputedStyle(element);
  const beforeContent = window.getComputedStyle(element, ':before').content;
  const afterContent = window.getComputedStyle(element, ':after').content;
  
  return (beforeContent !== 'none' && beforeContent !== '') ||
         (afterContent !== 'none' && afterContent !== '');
}

/**
 * main要素の解決策
 * @returns {string} 解決策のテキスト
 */
function getMainElementSolution() {
  return `main要素の追加方法:

<body>
  <header>...</header>
  <nav>...</nav>
  
  <main>
    <!-- ページのメインコンテンツをここに配置 -->
    <h1>ページタイトル</h1>
    <article>...</article>
  </main>
  
  <aside>...</aside>
  <footer>...</footer>
</body>

効果:
• スクリーンリーダーがメインコンテンツを識別
• キーボードナビゲーションの改善
• SEOの向上`;
}

/**
 * 装飾タグの解決策
 * @returns {string} 解決策のテキスト
 */
function getPresentationalTagSolution() {
  return `装飾タグの置き換え方法:

❌ 悪い例:
<font color="red">重要</font>
<center>中央寄せテキスト</center>
<b>太字テキスト</b>

✅ 良い例:
<span class="important">重要</span>
<div class="text-center">中央寄せテキスト</div>
<strong>太字テキスト</strong>

CSSで装飾:
.important { color: red; }
.text-center { text-align: center; }`;
}

/**
 * インラインスタイルの解決策
 * @returns {string} 解決策のテキスト
 */
function getInlineStyleSolution() {
  return `インラインスタイルの外部化:

❌ 悪い例:
<div style="color: blue; font-size: 16px;">テキスト</div>

✅ 良い例:
<div class="highlight-text">テキスト</div>

CSS:
.highlight-text {
  color: blue;
  font-size: 16px;
}

メリット:
• 保守性の向上
• スタイルの再利用
• ページサイズの削減`;
}