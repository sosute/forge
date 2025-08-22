/**
 * 要素プリプロセッサー - 検査対象要素の事前選別
 * 一度の処理で全DOM要素をスキャンし、検査対象要素を効率的に分類
 */

import { isExcludedElement } from '../utils/dom.js';
import { debugLog } from '../utils/debug.js';

/**
 * 分析対象要素を事前に選別・分類
 * @returns {Object} 要素タイプ別に分類された検査対象要素
 */
export function getAnalysisTargetElements() {
  debugLog('Preprocessor', 'Starting element preprocessing...');
  
  const startTime = performance.now();
  
  // 検査対象要素を格納するオブジェクト
  const targetElements = {
    // 見出し要素
    headings: {
      all: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    },
    
    // アクセシビリティ関連要素
    accessibility: {
      images: [],
      imagesWithoutAlt: [],
      links: [],
      formElements: [],
      elementsWithRole: [],
      expandableElements: [],
      navigationLinks: [],
      tables: []
    },
    
    // セマンティック要素
    semantic: {
      dateElements: [],
      timeElements: []
    },
    
    // クリーンアップ対象要素
    cleanup: {
      scripts: [],
      noscripts: []
    }
  };
  
  // 統計情報
  const stats = {
    totalElements: 0,
    excludedElements: 0,
    processedElements: 0
  };
  
  // 全要素を一度だけスキャン
  const allElements = document.querySelectorAll('*');
  stats.totalElements = allElements.length;
  
  debugLog('Preprocessor', `Scanning ${stats.totalElements} elements...`);
  
  Array.from(allElements).forEach(element => {
    // 除外対象チェック（一度だけ実行）
    if (isExcludedElement(element)) {
      stats.excludedElements++;
      return;
    }
    
    stats.processedElements++;
    
    // 要素タイプ別に分類
    classifyElement(element, targetElements);
  });
  
  const endTime = performance.now();
  const processingTime = endTime - startTime;
  
  // 統計情報をログ出力
  logPreprocessingStats(stats, targetElements, processingTime);
  
  return targetElements;
}

/**
 * 要素を適切なカテゴリに分類
 * @param {Element} element - 分類対象の要素
 * @param {Object} targetElements - 分類先オブジェクト
 */
function classifyElement(element, targetElements) {
  const tagName = element.tagName.toLowerCase();
  
  // 見出し要素の分類
  if (tagName.match(/^h[1-6]$/)) {
    targetElements.headings.all.push(element);
    targetElements.headings[tagName].push(element);
  }
  
  // アクセシビリティ関連要素の分類
  classifyAccessibilityElements(element, targetElements.accessibility);
  
  // セマンティック要素の分類
  classifySemanticElements(element, targetElements.semantic);
  
  // クリーンアップ対象要素の分類
  classifyCleanupElements(element, targetElements.cleanup);
}

/**
 * アクセシビリティ関連要素の分類
 * @param {Element} element - 対象要素
 * @param {Object} accessibilityElements - アクセシビリティ要素格納オブジェクト
 */
function classifyAccessibilityElements(element, accessibilityElements) {
  const tagName = element.tagName.toLowerCase();
  
  // 画像要素
  if (tagName === 'img') {
    accessibilityElements.images.push(element);
    if (!element.hasAttribute('alt')) {
      accessibilityElements.imagesWithoutAlt.push(element);
    }
  }
  
  // リンク要素
  if (tagName === 'a') {
    accessibilityElements.links.push(element);
    
    // ナビゲーションリンクかチェック
    if (element.closest('nav') || 
        element.classList.contains('breadcrumb') || 
        element.classList.contains('pagination') ||
        element.closest('.breadcrumb') ||
        element.closest('.pagination')) {
      accessibilityElements.navigationLinks.push(element);
    }
  }
  
  // フォーム要素
  if (['input', 'select', 'textarea'].includes(tagName)) {
    const inputType = element.getAttribute('type');
    // hidden, submit, buttonは除外
    if (inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button') {
      accessibilityElements.formElements.push(element);
    }
  }
  
  // role属性を持つ要素
  if (element.hasAttribute('role')) {
    accessibilityElements.elementsWithRole.push(element);
  }
  
  // 展開可能要素（aria-expanded対象）
  if (element.hasAttribute('data-toggle') || 
      element.hasAttribute('aria-controls') ||
      (tagName === 'button' && element.hasAttribute('data-toggle')) ||
      element.classList.contains('dropdown-toggle') ||
      element.classList.contains('accordion-toggle')) {
    // detailsのsummary要素は除外
    if (!(tagName === 'summary' && element.closest('details'))) {
      accessibilityElements.expandableElements.push(element);
    }
  }
  
  // テーブル要素
  if (tagName === 'table') {
    accessibilityElements.tables.push(element);
  }
}

/**
 * セマンティック要素の分類
 * @param {Element} element - 対象要素
 * @param {Object} semanticElements - セマンティック要素格納オブジェクト
 */
function classifySemanticElements(element, semanticElements) {
  const tagName = element.tagName.toLowerCase();
  
  // time要素
  if (tagName === 'time') {
    semanticElements.timeElements.push(element);
  }
  
  // 日付らしいテキストを含むdiv要素
  if (tagName === 'div') {
    const text = element.textContent.trim();
    // 日付パターンをチェック（簡単な例）
    if (text.match(/\d{4}[年\-\/]\d{1,2}[月\-\/]\d{1,2}日?|\d{1,2}[月\-\/]\d{1,2}日?[,\s]*\d{4}/)) {
      semanticElements.dateElements.push(element);
    }
  }
}

/**
 * クリーンアップ対象要素の分類
 * @param {Element} element - 対象要素
 * @param {Object} cleanupElements - クリーンアップ要素格納オブジェクト
 */
function classifyCleanupElements(element, cleanupElements) {
  const tagName = element.tagName.toLowerCase();
  
  // script要素
  if (tagName === 'script') {
    cleanupElements.scripts.push(element);
  }
  
  // noscript要素
  if (tagName === 'noscript') {
    cleanupElements.noscripts.push(element);
  }
}

/**
 * プリプロセス統計情報をログ出力
 * @param {Object} stats - 統計情報
 * @param {Object} targetElements - 分類済み要素
 * @param {number} processingTime - 処理時間（ms）
 */
function logPreprocessingStats(stats, targetElements, processingTime) {
  debugLog('Preprocessor', '=== Element Preprocessing Complete ===');
  debugLog('Preprocessor', `Processing time: ${processingTime.toFixed(2)}ms`);
  debugLog('Preprocessor', `Total elements: ${stats.totalElements}`);
  debugLog('Preprocessor', `Excluded elements: ${stats.excludedElements}`);
  debugLog('Preprocessor', `Processed elements: ${stats.processedElements}`);
  
  // 見出し統計
  debugLog('Preprocessor', `Headings: ${targetElements.headings.all.length} total`);
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    const count = targetElements.headings[tag].length;
    if (count > 0) {
      debugLog('Preprocessor', `  ${tag.toUpperCase()}: ${count}`);
    }
  });
  
  // アクセシビリティ統計
  debugLog('Preprocessor', `Images: ${targetElements.accessibility.images.length} (${targetElements.accessibility.imagesWithoutAlt.length} without alt)`);
  debugLog('Preprocessor', `Links: ${targetElements.accessibility.links.length}`);
  debugLog('Preprocessor', `Form elements: ${targetElements.accessibility.formElements.length}`);
  debugLog('Preprocessor', `Elements with role: ${targetElements.accessibility.elementsWithRole.length}`);
  
  debugLog('Preprocessor', '======================================');
}

/**
 * 除外要素統計を取得（開発・デバッグ用）
 * @returns {Object} 除外要素の統計情報
 */
export function getExclusionStats() {
  const allElements = document.querySelectorAll('*');
  const excludedElements = [];
  const excludedByReason = {
    htmlChecker: 0,
    header: 0,
    footer: 0
  };
  
  Array.from(allElements).forEach(element => {
    if (isExcludedElement(element)) {
      excludedElements.push(element);
      
      // 除外理由を分類
      if (element.closest('.mc_sp-header-wrapper') || element.closest('.mc_pc-header-wrapper')) {
        excludedByReason.header++;
      } else if (element.closest('.mc_pc-footer-wrapper') || element.closest('.mc_sp-footer-wrapper')) {
        excludedByReason.footer++;
      } else {
        excludedByReason.htmlChecker++;
      }
    }
  });
  
  return {
    total: excludedElements.length,
    elements: excludedElements,
    byReason: excludedByReason
  };
}