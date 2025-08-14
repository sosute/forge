// Background Script - ES Modules版
console.log('[Background] Service Worker starting...');

// インストール時の処理
self.addEventListener('install', (event) => {
  console.log('[Background] Extension installed');
  self.skipWaiting();
});

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  console.log('[Background] Extension activated');
  event.waitUntil(self.clients.claim());
});

// 拡張機能のアイコンクリック時の処理（ポップアップなしで直接検証開始）
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[Background] Extension icon clicked for tab:', tab.url);
  
  try {
    // アクティブタブが有効かチェック
    if (!tab?.id || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.log('[Background] Invalid tab for content script injection');
      return;
    }

    // Content Scriptが注入されているかチェック
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
      console.log('[Background] Content script already loaded');
    } catch (pingError) {
      console.log('[Background] Content script not found, injecting...');
      
      // Content Scriptを手動で注入
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-script.js']
        });
        
        // 少し待ってから処理続行
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('[Background] Content script injected successfully');
      } catch (injectError) {
        console.error('[Background] Failed to inject content script:', injectError);
        return;
      }
    }

    // Content Scriptに検証開始メッセージを送信
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'START_CHECK',
      timestamp: Date.now(),
      source: 'background'
    });

    console.log('[Background] Response from content script:', response);

    if (response?.success) {
      console.log('[Background] Check completed successfully, drawer should be visible');
    } else {
      console.error('[Background] Check failed:', response?.error);
    }

  } catch (error) {
    console.error('[Background] Extension icon click failed:', error);
  }
});

// メッセージ処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Message received:', message, 'from:', sender);
  
  // 基本的なPINGメッセージ
  if (message.type === 'PING') {
    console.log('[Background] PING received');
    sendResponse({ type: 'PONG', timestamp: Date.now() });
    return true;
  }
  
  // その他のメッセージは現時点では特別な処理不要
  // Content Script と Popup が直接通信する
  return false;
});

// タブ更新時の処理（必要に応じて）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('[Background] Tab updated:', tab.url);
    // 必要に応じてContent Scriptの状態をリセットなど
  }
});

console.log('[Background] Service Worker ready');