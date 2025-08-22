/**
 * HTML Semantic Checker - Content Script Entry Point
 * 全てのモジュールを統合するメインエントリーポイント
 */

import { debugLog, errorLog } from './utils/debug.js';
import { performFullCheck } from './engine/main-engine.js';
import { initializeDrawer, displayResultsInDrawer, closeDrawer } from './ui/drawer.js';
import { initializeHighlight, highlightAllIssueElements, clearAllHighlights, selectElement } from './ui/highlight.js';

/**
 * HTML Semantic Checker メインクラス
 */
class HTMLSemanticChecker {
  constructor() {
    this.isInitialized = false;
    this.checkResults = null;
  }

  /**
   * 初期化
   */
  initialize() {
    if (this.isInitialized) {
      debugLog('Checker', 'Already initialized');
      return;
    }
    
    debugLog('Checker', 'Initializing HTML Semantic Checker...');
    
    try {
      // UIコンポーネントの初期化
      initializeDrawer();
      initializeHighlight();
      
      // メッセージリスナーの設定
      this.setupMessageListeners();
      
      // キーボードショートカットの設定
      this.setupKeyboardShortcuts();
      
      this.isInitialized = true;
      debugLog('Checker', 'Initialization complete');
      
    } catch (error) {
      errorLog('Checker', 'Initialization failed:', error);
    }
  }

  /**
   * メッセージリスナーの設定
   */
  setupMessageListeners() {
    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.type) return;
      
      switch (event.data.type) {
        case 'HTML_CHECKER_START':
          this.performFullCheck();
          break;
        case 'HTML_CHECKER_RECHECK':
          this.performFullCheck(false); // 再チェックなので isInitialRun = false
          break;
        case 'HTML_CHECKER_CLOSE':
          this.cleanup();
          break;
      }
    });
    
    // Background scriptからのメッセージ
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      debugLog('Checker', 'Message received from background:', request);
      
      // PINGメッセージに応答
      if (request.type === 'PING') {
        debugLog('Checker', 'Responding to PING');
        sendResponse({ type: 'PONG', timestamp: Date.now() });
        return true;
      }
      
      // チェック開始メッセージ
      if (request.type === 'START_CHECK') {
        debugLog('Checker', 'Starting check from background');
        try {
          // Background scriptから送信されたisInitialRunフラグを使用
          const isInitialRun = request.isInitialRun !== undefined ? request.isInitialRun : true;
          debugLog('Checker', 'Is initial run from background:', isInitialRun);
          this.performFullCheck(isInitialRun);
          sendResponse({ success: true, timestamp: Date.now() });
        } catch (error) {
          errorLog('Checker', 'Check failed:', error);
          sendResponse({ success: false, error: error.message });
        }
        return true;
      }
      
      // レガシーメッセージハンドリング
      switch (request.action) {
        case 'startCheck':
          this.performFullCheck(false); // レガシーアクションは再実行として扱う
          sendResponse({ success: true });
          return true;
        case 'getResults':
          sendResponse({ results: this.checkResults });
          return true;
      }
      
      return false;
    });
  }

  /**
   * キーボードショートカットの設定
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Escape キーでドロワーを閉じる
      if (event.key === 'Escape') {
        closeDrawer();
      }
      
      // Ctrl+Shift+H でチェッカーを起動
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        this.performFullCheck(false); // キーボードショートカットは再実行として扱う
      }
    });
  }

  /**
   * 完全なページ分析を実行
   * @param {boolean} isInitialRun - 初回実行かどうか
   */
  async performFullCheck(isInitialRun = false) {
    debugLog('Checker', 'Starting full semantic analysis...');
    
    try {
      // 再実行の場合はページをリロードしてから実行
      if (!isInitialRun && this.checkResults !== null) {
        debugLog('Checker', 'Reloading page for re-check...');
        window.location.reload();
        return;
      }
      
      // 前回の結果をクリア
      clearAllHighlights();
      
      // 分析を実行
      const results = performFullCheck();
      this.checkResults = results;
      
      // 結果をドロワーで表示
      displayResultsInDrawer(results);
      
      // 全問題要素を軽くハイライト
      highlightAllIssueElements(results);
      
      // Background scriptに結果を送信
      chrome.runtime.sendMessage({
        action: 'checkComplete',
        results: {
          url: results.url,
          title: results.title,
          issueCount: results.issues.length,
          timestamp: results.timestamp
        }
      });
      
      debugLog('Checker', 'Analysis completed successfully');
      
    } catch (error) {
      errorLog('Checker', 'Analysis failed:', error);
      
      // エラーをBackground scriptに送信
      chrome.runtime.sendMessage({
        action: 'checkError',
        error: error.message
      });
    }
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    debugLog('Checker', 'Cleaning up...');
    
    try {
      clearAllHighlights();
      closeDrawer();
      
      // イベントリスナーの削除は各モジュールで実行
      
      this.isInitialized = false;
      this.checkResults = null;
      
      debugLog('Checker', 'Cleanup complete');
      
    } catch (error) {
      errorLog('Checker', 'Cleanup failed:', error);
    }
  }

  /**
   * 結果を取得
   * @returns {Object|null} 分析結果
   */
  getResults() {
    return this.checkResults;
  }
}

// 重複注入防止
if (window.__htmlSemanticCheckerLoaded) {
  debugLog('Content Script', 'Already loaded, skipping...');
} else {
  window.__htmlSemanticCheckerLoaded = true;
  
  debugLog('Content Script', 'Loading HTML Semantic Checker...');
  
  // メインインスタンスを作成
  const checker = new HTMLSemanticChecker();
  
  // DOM準備完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checker.initialize();
    });
  } else {
    checker.initialize();
  }
  
  // グローバルからアクセス可能にする（開発・デバッグ用）
  window.__htmlSemanticChecker = checker;
  
  debugLog('Content Script', 'HTML Semantic Checker loaded successfully');
}

// 手動起動用の関数をエクスポート
export function startCheck() {
  if (window.__htmlSemanticChecker) {
    window.__htmlSemanticChecker.performFullCheck(false); // 手動起動は再実行として扱う
  }
}

export function getChecker() {
  return window.__htmlSemanticChecker;
}