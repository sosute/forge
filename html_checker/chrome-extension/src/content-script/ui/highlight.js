/**
 * 要素ハイライト管理モジュール
 */

import { debugLog } from '../utils/debug.js';

// ハイライト状態の管理
let highlightedElements = [];
let selectedElement = null;
let selectedElementMarker = null;

// ハイライトスタイルのID
const HIGHLIGHT_STYLE_ID = 'html-semantic-checker-highlight-styles';

/**
 * ハイライト機能の初期化
 */
export function initializeHighlight() {
  if (!document.getElementById(HIGHLIGHT_STYLE_ID)) {
    addHighlightStyles();
  }

  // メッセージリスナーを追加
  window.addEventListener('message', handleHighlightMessage);

  debugLog('Highlight', 'Highlight system initialized');
}

/**
 * ハイライト用のスタイルを追加
 */
function addHighlightStyles() {
  const styleElement = document.createElement('style');
  styleElement.id = HIGHLIGHT_STYLE_ID;
  styleElement.textContent = `
    .hsc-highlighted-element {
      outline: 3px solid #dc3545 !important;
      outline-offset: 2px !important;
      position: relative !important;
      z-index: 999998 !important;
      /* H1要素の背景を強調（画像のみの場合でも見えるように） */
      background: rgba(220, 53, 69, 0.1) !important;
      /* ボーダーも追加で確実に見えるようにする */
      border: 2px solid #dc3545 !important;
      box-shadow: 0 0 0 1px rgba(220, 53, 69, 0.3) !important;
    }
    
    .hsc-selected-element {
      outline: 3px solid #28a745 !important;
      outline-offset: 2px !important;
      position: relative !important;
      z-index: 999999 !important;
      background-color: rgba(40, 167, 69, 0.1) !important;
    }
    
    .hsc-element-marker {
      position: absolute !important;
      background: #28a745 !important;
      color: white !important;
      padding: 4px 8px !important;
      font-size: 12px !important;
      font-weight: bold !important;
      border-radius: 4px !important;
      z-index: 1000000 !important;
      pointer-events: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      line-height: 1 !important;
      white-space: nowrap !important;
      top: -25px !important;
      left: 0 !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    }
    
    .hsc-element-marker::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 8px;
      border: 4px solid transparent;
      border-top-color: #28a745;
    }
    
  `;

  document.head.appendChild(styleElement);
}

/**
 * メッセージハンドラー
 * @param {MessageEvent} event - メッセージイベント
 */
function handleHighlightMessage(event) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'HTML_CHECKER_HIGHLIGHT_ELEMENTS':
        highlightElements(event.data.elements);
        break;
      case 'HTML_CHECKER_CLEAR_HIGHLIGHTS':
        clearAllHighlights();
        break;
      case 'HTML_CHECKER_SELECT_ELEMENT':
        selectElement(event.data.element);
        break;
    }
  }
}

/**
 * 全問題要素をハイライト（bookmarklet準拠）
 * @param {Object} results - 分析結果
 */
export function highlightAllIssueElements(results) {
  clearAllHighlights();

  const allElements = new Set();

  // 全ての問題から要素を収集
  results.issues.forEach(issue => {
    if (issue.elements && Array.isArray(issue.elements)) {
      issue.elements.forEach(element => {
        if (element && element.nodeType === 1) {
          // Element node
          allElements.add(element);
        }
      });
    }
  });

  // 要素をハイライト
  allElements.forEach(element => {
    element.classList.add('hsc-highlighted-element');
    highlightedElements.push(element);
  });

  debugLog('Highlight', `Highlighted ${allElements.size} issue elements`);
}

/**
 * 特定の要素群をハイライト
 * @param {Array} elements - ハイライトする要素の配列
 */
export function highlightElements(elements) {
  // 既存のハイライトをクリアしない（持続性を保つ）

  if (!Array.isArray(elements)) return;

  elements.forEach(element => {
    if (element && element.nodeType === 1) {
      // 既にハイライトされていない場合のみ追加
      if (!element.classList.contains('hsc-highlighted-element')) {
        element.classList.add('hsc-highlighted-element');
        highlightedElements.push(element);
      }
    }
  });

  debugLog('Highlight', `Highlighted ${elements.length} elements`);
}

/**
 * 要素を選択状態にする
 * @param {Element} element - 選択する要素
 */
export function selectElement(element) {
  debugLog('Highlight', 'selectElement called with:', element);

  if (!element) {
    debugLog('Highlight', 'No element provided');
    return;
  }

  if (element.nodeType !== 1) {
    debugLog('Highlight', 'Element is not an Element node:', element.nodeType);
    return;
  }

  clearSelectedElementHighlight();

  selectedElement = element;
  element.classList.add('hsc-selected-element');

  debugLog('Highlight', 'Element classes after selection:', element.className);

  // マーカーを作成
  try {
    createElementMarker(element);
  } catch (error) {
    debugLog('Highlight', 'Error creating marker:', error);
  }

  // 要素が見える位置にスクロール（少し遅延を入れて確実に実行）
  setTimeout(() => {
    try {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      debugLog('Highlight', 'Scrolled to element');
    } catch (error) {
      debugLog('Highlight', 'Error scrolling to element:', error);
    }
  }, 100);

  // 他のハイライトは維持する（元の実装に合わせて持続性を保つ）
  // 一時的なクリアは行わない

  debugLog('Highlight', 'Element selected successfully:', element.tagName);
}

/**
 * 選択状態のハイライトをクリア
 */
export function clearSelectedElementHighlight() {
  if (selectedElement) {
    selectedElement.classList.remove('hsc-selected-element');
    selectedElement = null;
  }

  // マーカーを削除
  if (selectedElementMarker) {
    selectedElementMarker.remove();
    selectedElementMarker = null;
  }
}

/**
 * 全てのハイライトをクリア
 */
export function clearAllHighlights() {
  // 問題要素のハイライトをクリア
  highlightedElements.forEach(element => {
    if (element && element.classList) {
      element.classList.remove('hsc-highlighted-element');
    }
  });
  highlightedElements = [];

  // 選択要素のハイライトをクリア
  clearSelectedElementHighlight();

  debugLog('Highlight', 'All highlights cleared');
}

/**
 * 要素のマーカーを作成
 * @param {Element} element - 対象要素
 */
function createElementMarker(element) {
  if (selectedElementMarker) {
    selectedElementMarker.remove();
  }

  const marker = document.createElement('div');
  marker.className = 'hsc-element-marker';
  marker.textContent = element.tagName.toLowerCase();

  // img, input, br, hr等のvoid要素は子要素を持てないため、親要素に配置
  const voidElements = [
    'IMG',
    'INPUT',
    'BR',
    'HR',
    'META',
    'LINK',
    'AREA',
    'BASE',
    'COL',
    'EMBED',
    'SOURCE',
    'TRACK',
    'WBR',
  ];

  if (voidElements.includes(element.tagName)) {
    // void要素の場合は親要素に配置し、位置を調整
    const parent = element.parentElement;
    if (parent) {
      parent.style.position = parent.style.position || 'relative';
      parent.appendChild(marker);

      // 要素の位置に合わせてマーカーを配置
      const rect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      marker.style.position = 'absolute';
      marker.style.left = rect.left - parentRect.left + 'px';
      marker.style.top = rect.top - parentRect.top - 25 + 'px';
    } else {
      // 親要素がない場合はbodyに配置
      document.body.appendChild(marker);
      const rect = element.getBoundingClientRect();
      marker.style.position = 'fixed';
      marker.style.left = rect.left + 'px';
      marker.style.top = rect.top - 25 + 'px';
    }
  } else {
    // 通常の要素の場合
    element.style.position = element.style.position || 'relative';
    element.appendChild(marker);
  }

  selectedElementMarker = marker;
}

/**
 * 要素のポップアップを作成
 * @param {Element} element - 対象要素
 */
// この関数は削除されました - ポップアップ機能は不要のため

/**
 * ハイライトシステムのクリーンアップ
 */
export function cleanupHighlight() {
  clearAllHighlights();

  // スタイルを削除
  const styleElement = document.getElementById(HIGHLIGHT_STYLE_ID);
  if (styleElement) {
    styleElement.remove();
  }

  // メッセージリスナーを削除
  window.removeEventListener('message', handleHighlightMessage);

  debugLog('Highlight', 'Highlight system cleaned up');
}

/**
 * 現在ハイライトされている要素数を取得
 * @returns {number} ハイライト要素数
 */
export function getHighlightedElementsCount() {
  return highlightedElements.length;
}

/**
 * 選択されている要素を取得
 * @returns {Element|null} 選択中の要素
 */
export function getSelectedElement() {
  return selectedElement;
}
