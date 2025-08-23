/******/ (() => { // webpackBootstrap
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = 'function' == typeof Symbol ? Symbol : {}, n = r.iterator || '@@iterator', o = r.toStringTag || '@@toStringTag'; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, '_invoke', function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError('Generator is already running'); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = 'next'), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError('iterator result is not an object'); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i['return']) && t.call(i), c < 2 && (u = TypeError('The iterator does not provide a \'' + o + '\' method'), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, 'GeneratorFunction')), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, 'constructor', GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, 'constructor', GeneratorFunction), GeneratorFunction.displayName = 'GeneratorFunction', _regeneratorDefine2(GeneratorFunctionPrototype, o, 'GeneratorFunction'), _regeneratorDefine2(u), _regeneratorDefine2(u, o, 'Generator'), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, 'toString', function () { return '[object Generator]'; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, '', {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o('next', 0), o('throw', 1), o('return', 2)); }, _regeneratorDefine2(e, r, n, t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, 'next', n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, 'throw', n); } _next(void 0); }); }; }
  // Background Script - ES Modules版
  console.log('[Background] Service Worker starting...');

  // インストール時の処理
  self.addEventListener('install', function (_event) {
    console.log('[Background] Extension installed');
    self.skipWaiting();
  });

  // アクティベート時の処理
  self.addEventListener('activate', function (event) {
    console.log('[Background] Extension activated');
    event.waitUntil(self.clients.claim());
  });

  // タブごとのチェック実行状態を管理
  var tabCheckState = new Map();

  // 拡張機能のアイコンクリック時の処理（ポップアップなしで直接検証開始）
  chrome.action.onClicked.addListener(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(tab) {
      var isInitialRun, contentScriptInjected, response, _t, _t2, _t3, _t4, _t5;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
        case 0:
          console.log('[Background] Extension icon clicked for tab:', tab.url);
          _context.p = 1;
          if (!(!(tab !== null && tab !== void 0 && tab.id) || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://'))) {
            _context.n = 2;
            break;
          }
          console.log('[Background] Invalid tab for content script injection');
          return _context.a(2);
        case 2:
          // このタブで既にチェックが実行されたかを確認
          isInitialRun = !tabCheckState.has(tab.id);
          console.log('[Background] Is initial run for tab:', isInitialRun);

          // Content Scriptが注入されているかチェック
          contentScriptInjected = false;
          _context.p = 3;
          _context.n = 4;
          return chrome.tabs.sendMessage(tab.id, {
            type: 'PING'
          });
        case 4:
          console.log('[Background] Content script already loaded');
          contentScriptInjected = true;
          _context.n = 10;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.log('[Background] Content script not found, injecting...');

          // Content Scriptを手動で注入
          _context.p = 6;
          _context.n = 7;
          return chrome.scripting.executeScript({
            target: {
              tabId: tab.id
            },
            files: ['content-script.js']
          });
        case 7:
          _context.n = 8;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 500);
          });
        case 8:
          console.log('[Background] Content script injected successfully');
          contentScriptInjected = true;
          _context.n = 10;
          break;
        case 9:
          _context.p = 9;
          _t2 = _context.v;
          console.error('[Background] Failed to inject content script:', _t2);
          return _context.a(2);
        case 10:
          _context.p = 10;
          _context.n = 11;
          return Promise.race([chrome.tabs.sendMessage(tab.id, {
            type: 'START_CHECK',
            timestamp: Date.now(),
            source: 'background',
            isInitialRun: isInitialRun || !contentScriptInjected // 新規注入の場合は初回として扱う
          }), new Promise(function (_, reject) {
            return setTimeout(function () {
              return reject(new Error('Message timeout'));
            }, 5000);
          })]);
        case 11:
          response = _context.v;
          console.log('[Background] Response from content script:', response);
          if (response !== null && response !== void 0 && response.success) {
            console.log('[Background] Check completed successfully, drawer should be visible');
            // このタブでチェックが実行されたことを記録
            tabCheckState.set(tab.id, Date.now());
          } else {
            console.error('[Background] Check failed:', (response === null || response === void 0 ? void 0 : response.error) || 'Unknown error');
          }
          _context.n = 16;
          break;
        case 12:
          _context.p = 12;
          _t3 = _context.v;
          console.error('[Background] Failed to communicate with content script:', _t3);

          // フォールバック: 直接Windowメッセージを送信
          _context.p = 13;
          _context.n = 14;
          return chrome.scripting.executeScript({
            target: {
              tabId: tab.id
            },
            func: function func(isInitial) {
              if (isInitial) {
                window.postMessage({
                  type: 'HTML_CHECKER_START'
                }, '*');
              } else {
                window.postMessage({
                  type: 'HTML_CHECKER_RECHECK'
                }, '*');
              }
            },
            args: [isInitialRun || !contentScriptInjected]
          });
        case 14:
          console.log('[Background] Fallback message sent via window.postMessage');

          // フォールバックでも成功した場合は記録
          if (isInitialRun || !contentScriptInjected) {
            tabCheckState.set(tab.id, Date.now());
          }
          _context.n = 16;
          break;
        case 15:
          _context.p = 15;
          _t4 = _context.v;
          console.error('[Background] Fallback communication also failed:', _t4);
        case 16:
          _context.n = 18;
          break;
        case 17:
          _context.p = 17;
          _t5 = _context.v;
          console.error('[Background] Extension icon click failed:', _t5);
        case 18:
          return _context.a(2);
        }
      }, _callee, null, [[13, 15], [10, 12], [6, 9], [3, 5], [1, 17]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  // メッセージ処理
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('[Background] Message received:', message, 'from:', sender);

    // 基本的なPINGメッセージ
    if (message.type === 'PING') {
      console.log('[Background] PING received');
      sendResponse({
        type: 'PONG',
        timestamp: Date.now()
      });
      return true;
    }

    // その他のメッセージは現時点では特別な処理不要
    // Content Script と Popup が直接通信する
    return false;
  });

  // タブ更新時の処理（必要に応じて）
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
      console.log('[Background] Tab updated:', tab.url);
      // タブがリロードされた場合、チェック状態をリセット
      if (tabCheckState.has(tabId)) {
        tabCheckState['delete'](tabId);
        console.log('[Background] Tab check state reset for tab:', tabId);
      }
    }
  });

  // タブが閉じられた時の処理
  chrome.tabs.onRemoved.addListener(function (tabId, _removeInfo) {
  // タブが閉じられた場合、状態を削除してメモリリークを防ぐ
    if (tabCheckState.has(tabId)) {
      tabCheckState['delete'](tabId);
      console.log('[Background] Tab check state cleaned up for closed tab:', tabId);
    }
  });
  console.log('[Background] Service Worker ready');
/******/ })()
;
//# sourceMappingURL=background.js.map