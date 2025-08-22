// Options Script - Pure JavaScript
(function() {
  'use strict';

  console.log('[Options] Loading...');

  // デフォルト設定
  const defaultSettings = {
    enableSemantic: true,
    enableAccessibility: true,
    enableSEO: true,
    enablePerformance: true,
    enableDebug: false,
    enableAutoCheck: false
  };

  // DOM要素
  const elements = {};

  /**
   * ステータス表示
   */
  function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // 3秒後に非表示
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  /**
   * 設定の読み込み
   */
  async function loadSettings() {
    console.log('[Options] Loading settings...');
    
    try {
      const result = await chrome.storage.sync.get(defaultSettings);
      console.log('[Options] Loaded settings:', result);
      
      // UI要素に設定値を反映
      Object.keys(defaultSettings).forEach(key => {
        const element = elements[key];
        if (element && element.type === 'checkbox') {
          element.checked = result[key];
        }
      });
      
    } catch (error) {
      console.error('[Options] Failed to load settings:', error);
      showStatus('設定の読み込みに失敗しました', 'error');
    }
  }

  /**
   * 設定の保存
   */
  async function saveSettings() {
    console.log('[Options] Saving settings...');
    
    try {
      const settings = {};
      
      // UI要素から設定値を取得
      Object.keys(defaultSettings).forEach(key => {
        const element = elements[key];
        if (element && element.type === 'checkbox') {
          settings[key] = element.checked;
        }
      });
      
      console.log('[Options] Saving settings:', settings);
      
      // Chrome Storageに保存
      await chrome.storage.sync.set(settings);
      
      showStatus('設定を保存しました', 'success');
      
    } catch (error) {
      console.error('[Options] Failed to save settings:', error);
      showStatus('設定の保存に失敗しました', 'error');
    }
  }

  /**
   * イベントリスナーの登録
   */
  function initializeEventListeners() {
    // 設定項目のDOM要素を取得
    Object.keys(defaultSettings).forEach(key => {
      elements[key] = document.getElementById(key);
    });

    // 保存ボタンのイベントリスナー
    const saveButton = document.getElementById('saveSettings');
    if (saveButton) {
      saveButton.addEventListener('click', saveSettings);
    }

    console.log('[Options] Event listeners registered');
  }

  /**
   * 初期化
   */
  async function initialize() {
    console.log('[Options] Initializing...');
    
    try {
      initializeEventListeners();
      await loadSettings();
      
      console.log('[Options] Ready');
      
    } catch (error) {
      console.error('[Options] Initialization failed:', error);
      showStatus('初期化に失敗しました', 'error');
    }
  }

  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();