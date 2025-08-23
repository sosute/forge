/**
 * ドロワーUI管理モジュール
 */

import { debugLog } from '../utils/debug.js';
import { selectElement, highlightElements } from './highlight.js';
import { getElementDetails, isNonVisibleElement } from '../utils/dom.js';

// グローバル状態
let drawerElement = null;

/**
 * ドロワーの初期化
 */
export function initializeDrawer() {
  if (drawerElement) {
    debugLog('Drawer', 'Drawer already initialized');
    return;
  }
  
  createDrawerElement();
  attachDrawerEvents();
  debugLog('Drawer', 'Drawer initialized');
}

/**
 * ドロワー要素を作成
 */
function createDrawerElement() {
  drawerElement = document.createElement('div');
  drawerElement.id = 'html-semantic-checker-drawer';
  drawerElement.innerHTML = getDrawerHTML();
  
  // ドロワーのスタイルを追加
  if (!document.getElementById('html-semantic-checker-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'html-semantic-checker-styles';
    styleElement.textContent = getDrawerStyles();
    document.head.appendChild(styleElement);
  }
  
  document.body.appendChild(drawerElement);
}

/**
 * ドロワーのHTML構造
 * @returns {string} HTMLテンプレート
 */
function getDrawerHTML() {
  return `
    <div class="hsc-drawer-overlay"></div>
    <div class="hsc-drawer-panel">
      <div class="hsc-drawer-header">
        <button class="hsc-close-btn" title="閉じる">×</button>
      </div>
      
      <div class="hsc-drawer-content">
        <div class="hsc-loading">
          <div class="hsc-spinner"></div>
          <p>分析中...</p>
        </div>
        
        <div class="hsc-results" style="display: none;">
          
          <div class="hsc-issue-filters">
            <select id="hsc-category-filter">
              <option value="all">全カテゴリ</option>
              <option value="heading">見出し</option>
              <option value="accessibility">アクセシビリティ</option>
              <option value="cleanup">クリーンアップ</option>
            </select>
            <select id="hsc-severity-filter">
              <option value="all">全重要度</option>
              <option value="error">エラー</option>
              <option value="warning">警告</option>
              <option value="info">情報</option>
            </select>
          </div>
          
          <div class="hsc-issues-list"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * ドロワーのスタイル
 * @returns {string} CSSスタイル
 */
function getDrawerStyles() {
  return `
    /* ドロワーのベーススタイル */
    #html-semantic-checker-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000000;
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* 外部CSSの影響を防ぐための強制スタイル */
    #html-semantic-checker-drawer *,
    #html-semantic-checker-drawer *:before,
    #html-semantic-checker-drawer *:after {
      text-align: left !important;
      direction: ltr !important;
      text-indent: 0 !important;
      letter-spacing: normal !important;
      word-spacing: normal !important;
      text-transform: none !important;
    }

    #html-semantic-checker-drawer.open {
      visibility: visible;
      opacity: 1;
    }

    .hsc-drawer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    .hsc-drawer-panel {
      position: absolute;
      top: 0;
      right: -420px;
      width: 420px;
      height: 100%;
      background: #ffffff;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #html-semantic-checker-drawer.open .hsc-drawer-panel {
      right: 0;
    }

    /* ヘッダー */
    .hsc-drawer-header {
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom: 1px solid #e1e5e9;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-shrink: 0;
    }


    .hsc-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .hsc-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* メインコンテンツエリア */
    .hsc-drawer-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    /* ローディング */
    .hsc-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #6c757d;
    }

    .hsc-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f1f3f4;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }


    /* フィルターセクション */
    .hsc-issue-filters {
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .hsc-issue-filters select {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      color: #495057;
    }

    /* 結果エリア */
    .hsc-results {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    /* 問題リスト */
    .hsc-issues-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }

    .hsc-issue-item {
      margin: 0 16px 16px 16px;
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
    }

    .hsc-issue-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #667eea;
    }

    /* 問題ヘッダー */
    .hsc-issue-header {
      padding: 16px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
    }

    .hsc-issue-severity {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .hsc-issue-severity.error {
      background: #dc3545;
    }

    .hsc-issue-severity.warning {
      background: #ffc107;
    }

    .hsc-issue-title {
      flex: 1;
      font-weight: 600;
      color: #2c3e50;
      font-size: 15px;
      text-align: left !important;
      direction: ltr !important;
    }

    .hsc-issue-count {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .hsc-expand-icon {
      color: #6c757d;
      font-size: 14px;
      transition: transform 0.2s;
    }

    .hsc-issue-item.expanded .hsc-expand-icon {
      transform: rotate(180deg);
    }

    /* 問題詳細 */
    .hsc-issue-details {
      display: none;
      padding: 20px;
    }

    .hsc-issue-item.expanded .hsc-issue-details {
      display: block;
    }

    .hsc-issue-message {
      font-size: 14px;
      color: #495057;
      line-height: 1.6;
      margin-bottom: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-left: 3px solid #667eea;
      border-radius: 0 4px 4px 0;
      text-align: left !important;
      direction: ltr !important;
    }

    /* 要素リスト */
    .hsc-issue-elements h4 {
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 12px 0;
      text-align: left !important;
      direction: ltr !important;
    }

    .hsc-elements-list {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
    }

    .hsc-element-item {
      padding: 12px 16px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .hsc-element-item:hover {
      background: #e9ecef;
      border-color: #667eea;
    }

    .hsc-element-item.non-visible {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .hsc-element-tag {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      color: #495057;
      text-align: left !important;
      direction: ltr !important;
      word-break: break-all;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      max-width: 100%;
    }

    /* === 解決方法のシンプルなスタイル === */
    .hsc-issue-solution {
      margin-top: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      padding: 16px;
    }

    .hsc-solution-header {
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-align: left !important;
      direction: ltr !important;
    }

    .hsc-solution-header::before {
      content: "💡";
      font-size: 16px;
    }

    .hsc-solution-content {
      font-size: 14px;
      color: #495057;
      line-height: 1.6;
      text-align: left !important;
      direction: ltr !important;
    }

    /* セクション */
    .hsc-solution-section {
      margin-bottom: 16px;
    }

    .hsc-solution-section:last-child {
      margin-bottom: 0;
    }

    .hsc-solution-title {
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
      margin: 0 0 8px 0;
      text-align: left !important;
      direction: ltr !important;
    }

    .hsc-solution-text {
      color: #495057;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      text-align: left !important;
      direction: ltr !important;
    }

    /* コード例 */
    .hsc-code-example {
      margin-top: 8px;
      padding: 12px;
      background: #2c3e50;
      color: #f8f9fa;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      border: 2px solid;
    }

    .hsc-good-example {
      border-color: #28a745;
    }

    .hsc-bad-example {
      border-color: #dc3545;
    }

    .hsc-example-header {
      padding: 12px 16px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }



    /* レスポンシブ */
    @media (max-width: 480px) {
      .hsc-drawer-panel {
        width: 100%;
        right: -100%;
      }


      .hsc-examples {
        grid-template-columns: 1fr;
      }
    }

    /* スクロールバー */
    .hsc-issues-list::-webkit-scrollbar {
      width: 6px;
    }

    .hsc-issues-list::-webkit-scrollbar-track {
      background: #f1f3f4;
    }

    .hsc-issues-list::-webkit-scrollbar-thumb {
      background: #ced4da;
      border-radius: 3px;
    }

    .hsc-issues-list::-webkit-scrollbar-thumb:hover {
      background: #adb5bd;
    }
  `;
}

/**
 * ドロワーイベントのアタッチ
 */
function attachDrawerEvents() {
  // 閉じるボタン
  const closeBtn = drawerElement.querySelector('.hsc-close-btn');
  closeBtn.addEventListener('click', closeDrawer);
  
  // オーバーレイクリック
  const overlay = drawerElement.querySelector('.hsc-drawer-overlay');
  overlay.addEventListener('click', closeDrawer);
  
  
  // フィルター
  const categoryFilter = drawerElement.querySelector('#hsc-category-filter');
  const severityFilter = drawerElement.querySelector('#hsc-severity-filter');
  
  categoryFilter.addEventListener('change', filterIssues);
  severityFilter.addEventListener('change', filterIssues);
  
}

/**
 * ドロワーを開く
 */
export function openDrawer() {
  if (!drawerElement) {
    initializeDrawer();
  }
  
  drawerElement.classList.add('open');
  debugLog('Drawer', 'Drawer opened');
}

/**
 * ドロワーを閉じる
 */
export function closeDrawer() {
  if (drawerElement) {
    drawerElement.classList.remove('open');
  }
  debugLog('Drawer', 'Drawer closed');
}

/**
 * 結果をドロワーに表示
 * @param {Object} results - 分析結果
 */
export function displayResultsInDrawer(results) {
  
  if (!drawerElement) {
    initializeDrawer();
  }
  
  // ローディングを隠し、結果を表示
  const loading = drawerElement.querySelector('.hsc-loading');
  const resultsDiv = drawerElement.querySelector('.hsc-results');
  
  loading.style.display = 'none';
  resultsDiv.style.display = 'flex';
  
  
  // 問題リストを更新
  updateIssuesList(results.issues);
  
  // タブシステムを削除したため、概要・構造タブの更新は不要
  
  openDrawer();
}

/**
 * 問題リストを更新
 * @param {Array} issues - 問題リスト
 */
function updateIssuesList(issues) {
  const issuesList = drawerElement.querySelector('.hsc-issues-list');
  
  if (issues.length === 0) {
    issuesList.innerHTML = '<p class="hsc-no-issues">問題は見つかりませんでした。</p>';
    return;
  }
  
  // 問題をグループ化
  const groupedIssues = groupIssuesByName(issues);
  
  issuesList.innerHTML = '';
  Object.entries(groupedIssues).forEach(([name, issueGroup]) => {
    const issueElement = createIssueElement(name, issueGroup);
    issuesList.appendChild(issueElement);
  });
}

/**
 * 問題を名前でグループ化
 * @param {Array} issues - 問題リスト
 * @returns {Object} グループ化された問題
 */
function groupIssuesByName(issues) {
  const grouped = {};
  
  issues.forEach(issue => {
    if (!grouped[issue.name]) {
      grouped[issue.name] = {
        ...issue,
        count: 0,
        allElements: []
      };
    }
    grouped[issue.name].count += issue.elements ? issue.elements.length : 1;
    if (issue.elements) {
      grouped[issue.name].allElements.push(...issue.elements);
    }
  });
  
  return grouped;
}

/**
 * 問題要素を作成
 * @param {string} name - 問題名
 * @param {Object} issue - 問題データ
 * @returns {HTMLElement} 問題要素
 */
function createIssueElement(name, issue) {
  const div = document.createElement('div');
  div.className = 'hsc-issue-item';
  div.dataset.category = issue.category;
  div.dataset.severity = issue.severity;
  
  // 関連要素の詳細リストを作成（すべて表示）
  let elementsListHTML = '';
  if (issue.allElements && issue.allElements.length > 0) {
    elementsListHTML = `
      <div class="hsc-issue-elements">
        <h4>関連要素 (${issue.allElements.length}個):</h4>
        <ul class="hsc-elements-list">
          ${issue.allElements.map((element, index) => {
    // 元の詳細な要素表示を使用
    const elementDetails = getElementDetails(element);
    const isNonVisible = isNonVisibleElement(element);
            
    return `
              <li class="hsc-element-item ${isNonVisible ? 'non-visible' : ''}" data-element-index="${index}" ${isNonVisible ? 'data-non-visible="true"' : ''}>
                <div class="hsc-element-tag">${escapeHtml(elementDetails)}</div>
              </li>
            `;
  }).join('')}
        </ul>
      </div>
    `;
  }
  
  // 解決策をHTMLとして適切にフォーマット
  let solutionHTML = '';
  if (issue.solution) {
    const formattedSolution = formatSolutionForUI(issue.solution);
    solutionHTML = `
      <div class="hsc-issue-solution">
        <div class="hsc-solution-header">解決方法</div>
        ${formattedSolution}
      </div>
    `;
  }
  
  div.innerHTML = `
    <div class="hsc-issue-header">
      <div class="hsc-issue-severity ${issue.severity}"></div>
      <div class="hsc-issue-title">${name}</div>
      <div class="hsc-issue-count">${issue.count}個</div>
      <div class="hsc-expand-icon">▼</div>
    </div>
    <div class="hsc-issue-details">
      <div class="hsc-issue-message">${issue.message}</div>
      ${issue.text ? `<div class="hsc-issue-html"><strong>検出されたHTML:</strong><br><code style="display: block; background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 8px 0; white-space: pre-wrap; font-size: 11px; word-break: break-all; overflow-wrap: break-word;">${escapeHtml(issue.text)}</code></div>` : ''}
      ${elementsListHTML}
      ${solutionHTML}
    </div>
  `;
  
  // 初期状態は閉じた状態
  
  // クリックで詳細を表示/非表示
  const header = div.querySelector('.hsc-issue-header');
  header.addEventListener('click', () => {
    const wasExpanded = div.classList.contains('expanded');
    div.classList.toggle('expanded');
    
    const expandIcon = div.querySelector('.hsc-expand-icon');
    expandIcon.textContent = div.classList.contains('expanded') ? '▲' : '▼';
    
    // 要素をハイライト（展開時のみ、既存のハイライトは維持）
    if (!wasExpanded && issue.allElements && issue.allElements.length > 0) {
      highlightElements(issue.allElements);
    }
    // 閉じる時はハイライトを維持（変更前の動作に合わせる）
  });
  
  
  // 個別要素のクリック処理（後でイベントリスナーを追加）
  setTimeout(() => {
    const elementItems = div.querySelectorAll('.hsc-element-item');
    elementItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 非表示要素はクリックを無効化
        if (item.dataset.nonVisible === 'true') {
          debugLog('Drawer', `Non-visible element clicked, ignoring: ${index}`);
          return;
        }
        
        debugLog('Drawer', `Element item ${index} clicked`);
        
        if (issue.allElements && issue.allElements[index]) {
          debugLog('Drawer', 'Selecting element:', issue.allElements[index]);
          // 直接ハイライト関数を呼び出し
          selectElement(issue.allElements[index]);
        } else {
          debugLog('Drawer', 'No element found at index:', index);
        }
      });
    });
  }, 0);
  
  return div;
}


/**
 * 問題をフィルタリング
 */
function filterIssues() {
  const categoryFilter = drawerElement.querySelector('#hsc-category-filter').value;
  const severityFilter = drawerElement.querySelector('#hsc-severity-filter').value;
  
  const issueItems = drawerElement.querySelectorAll('.hsc-issue-item');
  
  issueItems.forEach(item => {
    const category = item.dataset.category;
    const severity = item.dataset.severity;
    
    const categoryMatch = categoryFilter === 'all' || category === categoryFilter;
    const severityMatch = severityFilter === 'all' || severity === severityFilter;
    
    item.style.display = categoryMatch && severityMatch ? 'block' : 'none';
  });
}




/**
 * HTMLエスケープ（改行保持）
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


/**
 * 解決策をシンプルなUIフォーマットに変換
 * @param {string} text - 解決策テキスト
 * @returns {string} フォーマットされたHTML
 */
function formatSolutionForUI(text) {
  if (!text) return '';
  
  // シンプルなフォーマット化
  const sections = text.split(/\n\s*\n/).filter(s => s.trim());
  let html = '<div class="hsc-solution-content">';
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    
    // コードブロックの検出
    if (section.includes('<') && section.includes('>')) {
      html += `<div class="hsc-code-example">${escapeHtml(section)}</div>`;
    }
    // 箇条書きの検出
    else if (section.includes('•') || /^\d+\./.test(section)) {
      html += '<div class="hsc-solution-section">';
      html += `<div class="hsc-solution-text">${escapeHtml(section)}</div>`;
      html += '</div>';
    }
    // 通常テキスト
    else {
      html += '<div class="hsc-solution-section">';
      // 最初の行がタイトルの可能性
      if (lines.length > 1 && (lines[0].includes('：') || lines[0].includes('設定') || lines[0].includes('方法'))) {
        html += `<h4 class="hsc-solution-title">${escapeHtml(lines[0])}</h4>`;
        html += `<div class="hsc-solution-text">${escapeHtml(lines.slice(1).join('\n'))}</div>`;
      } else {
        html += `<div class="hsc-solution-text">${escapeHtml(section)}</div>`;
      }
      html += '</div>';
    }
  });
  
  html += '</div>';
  return html;
}

