// Popup Script - Pure JavaScript (ES Modules不使用)
(function () {
  'use strict';

  console.log('[Popup] Loading...');

  // DOM要素の取得
  const startCheckButton = document.getElementById('startCheck');
  const openOptionsButton = document.getElementById('openOptions');
  const statusDiv = document.getElementById('status');
  const resultsDiv = document.getElementById('results');

  // 状態管理
  let isChecking = false;

  /**
   * ステータス表示
   */
  function showStatus(message, type = 'loading') {
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
  }

  /**
   * ステータス非表示
   */
  function hideStatus() {
    statusDiv.style.display = 'none';
  }

  /**
   * 結果表示
   */
  function showResults(data) {
    console.log('[Popup] Showing results:', data);

    const items = [
      { label: 'URL', value: data.url || '不明' },
      { label: 'タイトル', value: data.title || '不明' },
      { label: '全要素数', value: data.statistics?.totalElements || 0 },
      { label: '見出し', value: data.statistics?.headings || 0 },
      { label: '画像', value: data.statistics?.images || 0 },
      { label: 'リンク', value: data.statistics?.links || 0 },
      {
        label: 'セマンティック要素',
        value: Object.values(data.semantic || {}).reduce((a, b) => a + b, 0),
      },
      { label: 'H1の数', value: data.headingStructure?.h1Count || 0 },
      {
        label: 'Alt属性なし画像',
        value: data.accessibility?.images?.withoutAlt || 0,
      },
      {
        label: 'メタ説明',
        value: data.seo?.metaDescription?.exists ? '✓' : '✗',
      },
    ];

    const html = items
      .map(
        item =>
          `<div class="result-item">
        <span>${item.label}:</span>
        <span>${item.value}</span>
      </div>`
      )
      .join('');

    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');
  }

  /**
   * アクティブタブの取得
   */
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  }

  /**
   * チェック開始
   */
  async function startCheck() {
    if (isChecking) return;

    try {
      isChecking = true;
      startCheckButton.textContent = 'チェック中...';
      startCheckButton.disabled = true;

      showStatus('ページを分析中...', 'loading');
      resultsDiv.classList.remove('show');

      console.log('[Popup] Starting check...');

      // アクティブタブを取得
      const tab = await getActiveTab();
      if (!tab?.id) {
        throw new Error('アクティブタブが見つかりません');
      }

      console.log('[Popup] Active tab:', tab.url);

      // Content Scriptが注入されているかチェック
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
      } catch (pingError) {
        console.log('[Popup] Content script not found, injecting...');

        // Content Scriptを手動で注入
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-script.js'],
          });

          // 少し待ってから再試行
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (injectError) {
          console.error(
            '[Popup] Failed to inject content script:',
            injectError
          );
          throw new Error('Content Scriptの注入に失敗しました');
        }
      }

      // Content Scriptにメッセージを送信
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'START_CHECK',
        timestamp: Date.now(),
      });

      console.log('[Popup] Response from content script:', response);

      if (response?.success && response?.data) {
        showStatus('分析完了！', 'success');
        showResults(response.data);
      } else {
        throw new Error(response?.error || 'チェックに失敗しました');
      }
    } catch (error) {
      console.error('[Popup] Check failed:', error);
      showStatus(`エラー: ${error.message}`, 'error');

      // エラーが Content Script 未読み込みの場合の対処
      if (error.message.includes('Could not establish connection')) {
        showStatus('拡張機能を再読み込みしてから再試行してください', 'error');
      }
    } finally {
      isChecking = false;
      startCheckButton.textContent = 'チェック開始';
      startCheckButton.disabled = false;
    }
  }

  /**
   * 設定ページを開く
   */
  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  /**
   * イベントリスナーの登録
   */
  function initializeEventListeners() {
    startCheckButton?.addEventListener('click', startCheck);
    openOptionsButton?.addEventListener('click', openOptions);
  }

  /**
   * 初期化
   */
  function initialize() {
    console.log('[Popup] Initializing...');

    initializeEventListeners();
    hideStatus();

    console.log('[Popup] Ready');
  }

  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
