/**
 * DOM操作関連のユーティリティ関数
 */

import { NON_VISIBLE_TAGS } from '../config.js';

/**
 * 非表示要素かどうかを判定
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} 非表示要素の場合true
 */
export function isNonVisibleElement(element) {
  // head内の要素
  if (element.closest('head') !== null) {
    return true;
  }

  // meta、script、style、linkタグなど
  if (NON_VISIBLE_TAGS.includes(element.tagName)) {
    return true;
  }

  // CSS で完全に隠されている要素
  const computedStyle = window.getComputedStyle(element);
  if (
    computedStyle.display === 'none' ||
    computedStyle.visibility === 'hidden' ||
    element.offsetParent === null
  ) {
    return true;
  }

  return false;
}

/**
 * HTML Semantic Checkerの要素かどうかを判定
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} HTML Checkerの要素の場合true
 */
export function isHtmlCheckerElement(element) {
  // HTML Checkerのドロワー要素
  if (
    element.id === 'html-semantic-checker-drawer' ||
    element.closest('#html-semantic-checker-drawer') !== null
  ) {
    return true;
  }

  // HTML Checkerのスタイル要素
  if (
    element.id === 'html-semantic-checker-styles' ||
    element.id === 'html-semantic-checker-highlight-styles'
  ) {
    return true;
  }

  // HTML Checkerのクラス名を持つ要素
  if (element.className && typeof element.className === 'string') {
    if (
      element.className.includes('hsc-') ||
      element.className.includes('html-semantic-checker')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * 除外対象の要素かどうかを判定（HTML Checker + 指定ヘッダー・フッター要素）
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} 除外対象の場合true
 */
export function isExcludedElement(element) {
  // HTML Checker要素の除外
  if (isHtmlCheckerElement(element)) {
    return true;
  }

  // 指定されたヘッダー要素の除外
  if (
    element.closest('.mc_sp-header-wrapper') !== null ||
    element.closest('.mc_pc-header-wrapper') !== null
  ) {
    return true;
  }

  // 指定されたフッター要素の除外
  if (
    element.closest('.mc_pc-footer-wrapper') !== null ||
    element.closest('.mc_sp-footer-wrapper') !== null
  ) {
    return true;
  }

  return false;
}

/**
 * 要素の深さ（ネストレベル）をチェック
 * @param {Element} element - チェック対象の要素
 * @returns {boolean} 3階層以上のネストがある場合true
 */
export function checkDeepNesting(element) {
  function getMaxDepth(el, currentDepth = 0) {
    if (currentDepth >= 3) return currentDepth; // 3階層に達したら早期終了

    let maxChildDepth = currentDepth;
    for (const child of el.children) {
      const childDepth = getMaxDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
    return maxChildDepth;
  }

  const maxDepth = getMaxDepth(element);
  console.log(`[Checker] Max nesting depth: ${maxDepth}`);
  return maxDepth >= 3;
}

/**
 * 要素のテキストを安全に取得（最大文字数制限付き）
 * @param {Element} element - 対象要素
 * @param {number} maxLength - 最大文字数
 * @returns {string} 切り詰められたテキスト
 */
export function getElementText(element, maxLength = 50) {
  const text = element.textContent || '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 要素の完全なHTMLソースを取得
 * @param {Element} element - 対象要素
 * @param {boolean} includeChildren - 子要素も含めるかどうか
 * @returns {string} 完全なHTMLソース
 */
export function getElementFullHTML(element, _includeChildren = true) {
  if (!element || !element.outerHTML) {
    return 'HTML取得不可';
  }

  let html = element.outerHTML;

  // 長すぎる場合は切り詰める（500文字まで）
  if (html.length > 500) {
    html = html.substring(0, 500) + '...';
  }

  // インデントを整理してより読みやすくする
  return formatHTML(html);
}

/**
 * HTMLを読みやすくフォーマット
 * @param {string} html - フォーマット対象のHTML
 * @returns {string} フォーマット済みHTML
 */
function formatHTML(html) {
  // 基本的なフォーマットを適用
  return html
    .replace(/></g, '>\n<') // タグ間に改行を挿入
    .replace(/\s+/g, ' ') // 複数の空白を1つに統一
    .trim();
}

/**
 * 要素の詳細情報を取得（元の実装を完全復元）
 * @param {Element} element - 対象要素
 * @returns {string} 要素の詳細情報
 */
export function getElementDetails(element) {
  if (element.tagName === 'IMG') {
    const src = element.src || element.getAttribute('src');
    const alt = element.getAttribute('alt');
    return `<img src="${src ? src.split('/').pop() : 'src不明'}" alt="${alt || '(alt属性なし)'}">`;
  } else if (element.tagName === 'META') {
    const name = element.getAttribute('name');
    const content = element.getAttribute('content');
    return `<meta name="${name || 'name不明'}" content="${content || 'content不明'}">`;
  } else if (element.tagName === 'SCRIPT') {
    const src = element.getAttribute('src');
    if (src) {
      return `<script src="${src}">`;
    } else {
      const scriptContent = element.textContent || element.innerHTML;
      return `<script>${scriptContent.substring(0, 100)}${scriptContent.length > 100 ? '...' : ''}</script>`;
    }
  } else if (element.tagName.startsWith('H')) {
    // 見出し要素の詳細表示
    const headingLevel = element.tagName.charAt(1);
    const id = element.getAttribute('id') || '';
    const className = element.getAttribute('class') || '';

    let innerContent = element.innerHTML.trim();
    if (innerContent.length > 200) {
      innerContent = innerContent.substring(0, 200) + '...';
    }

    let elementText = `<h${headingLevel}`;
    if (id) elementText += ` id="${id}"`;
    if (className) elementText += ` class="${className}"`;
    elementText += `>${innerContent}</h${headingLevel}>`;

    return elementText;
  } else if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
    // フォーム要素の詳細表示
    const type = element.getAttribute('type') || '';
    const name = element.getAttribute('name') || '';
    const id = element.getAttribute('id') || '';
    const placeholder = element.getAttribute('placeholder') || '';

    let formInfo = `<${element.tagName.toLowerCase()}`;
    if (type) formInfo += ` type="${type}"`;
    if (id) formInfo += ` id="${id}"`;
    if (name) formInfo += ` name="${name}"`;
    if (placeholder) formInfo += ` placeholder="${placeholder}"`;
    formInfo += '>';

    return formInfo;
  } else if (element.tagName === 'A') {
    // リンク要素の詳細表示
    const href = element.getAttribute('href') || '';
    const title = element.getAttribute('title') || '';
    const ariaLabel = element.getAttribute('aria-label') || '';
    const textContent = element.textContent.trim();

    let linkInfo = '<a';
    if (href) linkInfo += ` href="${href}"`;
    if (title) linkInfo += ` title="${title}"`;
    if (ariaLabel) linkInfo += ` aria-label="${ariaLabel}"`;
    linkInfo += '>';

    if (textContent) {
      linkInfo +=
        textContent.length > 50
          ? textContent.substring(0, 50) + '...'
          : textContent;
    } else {
      linkInfo += '(テキストなし)';
    }

    linkInfo += '</a>';
    return linkInfo;
  } else if (element.tagName === 'TABLE') {
    // テーブル要素の詳細表示
    const border = element.getAttribute('border') || '';
    const cellpadding = element.getAttribute('cellpadding') || '';
    const cellspacing = element.getAttribute('cellspacing') || '';
    const className = element.getAttribute('class') || '';

    let tableInfo = '<table';
    if (className) tableInfo += ` class="${className}"`;
    if (border) tableInfo += ` border="${border}"`;
    if (cellpadding) tableInfo += ` cellpadding="${cellpadding}"`;
    if (cellspacing) tableInfo += ` cellspacing="${cellspacing}"`;
    tableInfo += '>';

    return tableInfo;
  }

  // その他の要素は基本的な表示
  return getElementText(element);
}
