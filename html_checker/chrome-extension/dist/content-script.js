/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// UNUSED EXPORTS: getChecker, startCheck

;// ./src/content-script/config.js
/**
 * HTML Semantic Checker - Configuration
 */

var CONFIG = {
  debug: true,
  enabledRules: ['all'] // すべてのルールを有効
};
var SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
var CATEGORIES = {
  HEADING: 'heading',
  ACCESSIBILITY: 'accessibility',
  SEO: 'seo',
  STRUCTURE: 'structure',
  CLEANUP: 'cleanup'
};

// 非表示要素のタグリスト
var NON_VISIBLE_TAGS = ['META', 'SCRIPT', 'STYLE', 'LINK', 'TITLE', 'BASE', 'NOSCRIPT'];

// ハイライトから除外するタグ
var EXCLUDE_HIGHLIGHT_TAGS = (/* unused pure expression or super */ null && (['BODY', 'HTML', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'SECTION', 'ARTICLE', 'ASIDE']));

// 見出し構造チェックで許可される単純なタグ
var ALLOWED_SIMPLE_TAGS = ['BR', 'A', 'STRONG', 'EM', 'SPAN', 'I', 'B', 'SMALL'];

// 装飾目的のHTMLタグ（非推奨）
var PRESENTATIONAL_TAGS = (/* unused pure expression or super */ null && (['FONT', 'CENTER', 'U', 'S', 'STRIKE', 'BIG', 'SMALL', 'TT']));

// インラインセマンティックタグ
var INLINE_SEMANTIC_TAGS = (/* unused pure expression or super */ null && (['STRONG', 'EM', 'MARK', 'CODE', 'KBD', 'SAMP', 'VAR']));

// トラッキングピクセルのパターン
var TRACKING_PIXEL_PATTERNS = [/adsct/i,
// Twitter/X tracking
/doubleclick/i,
// Google DoubleClick
/googletagmanager/i,
// Google Tag Manager
/facebook/i,
// Facebook tracking
/analytics/i,
// General analytics
/pixel/i,
// General pixel tracking
/tr\?/i,
// Common tracking parameter
/1x1/i // 1x1 pixel indicator
];

// 古いGoogle Analyticsのパターン
var LEGACY_GA_PATTERNS = [/UA-\d+-\d+/, /_gat\._getTracker/, /pageTracker/, /google-analytics\.com\/ga\.js/];

// Adobe関連のパターン
var ADOBE_PATTERNS = [/s_code\.js/, /omniture\.js/, /sitecatalyst/i, /adobe\.com\/dtm/, /s\.t\(\)/, /s\.tl\(/];

// スタイル設定
var DRAWER_STYLES = {
  width: '450px',
  zIndex: 2147483647 // 最大値に近い値
};
;// ./src/content-script/utils/debug.js
/**
 * デバッグ関連のユーティリティ
 */



/**
 * 条件付きログ出力
 * @param {string} prefix - ログのプレフィックス
 * @param {...any} args - ログ引数
 */
function debug_debugLog(prefix) {
  if (CONFIG.debug) {
    var _console;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    (_console = console).log.apply(_console, ["[".concat(prefix, "]")].concat(args));
  }
}

/**
 * エラーログ出力
 * @param {string} prefix - ログのプレフィックス
 * @param {...any} args - ログ引数
 */
function errorLog(prefix) {
  var _console2;
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  (_console2 = console).error.apply(_console2, ["[".concat(prefix, "]")].concat(args));
}

/**
 * 警告ログ出力
 * @param {string} prefix - ログのプレフィックス  
 * @param {...any} args - ログ引数
 */
function warnLog(prefix) {
  var _console3;
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  (_console3 = console).warn.apply(_console3, ["[".concat(prefix, "]")].concat(args));
}
;// ./src/content-script/utils/dom.js
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * DOM操作関連のユーティリティ関数
 */



/**
 * 非表示要素かどうかを判定
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} 非表示要素の場合true
 */
function isNonVisibleElement(element) {
  // head内の要素
  if (element.closest('head') !== null) {
    return true;
  }

  // meta、script、style、linkタグなど
  if (NON_VISIBLE_TAGS.includes(element.tagName)) {
    return true;
  }

  // CSS で完全に隠されている要素
  var computedStyle = window.getComputedStyle(element);
  if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || element.offsetParent === null) {
    return true;
  }
  return false;
}

/**
 * HTML Semantic Checkerの要素かどうかを判定
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} HTML Checkerの要素の場合true
 */
function isHtmlCheckerElement(element) {
  // HTML Checkerのドロワー要素
  if (element.id === 'html-semantic-checker-drawer' || element.closest('#html-semantic-checker-drawer') !== null) {
    return true;
  }

  // HTML Checkerのスタイル要素
  if (element.id === 'html-semantic-checker-styles' || element.id === 'html-semantic-checker-highlight-styles') {
    return true;
  }

  // HTML Checkerのクラス名を持つ要素
  if (element.className && typeof element.className === 'string') {
    if (element.className.includes('hsc-') || element.className.includes('html-semantic-checker')) {
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
function dom_isExcludedElement(element) {
  // HTML Checker要素の除外
  if (isHtmlCheckerElement(element)) {
    return true;
  }

  // 指定されたヘッダー要素の除外
  if (element.closest('.mc_sp-header-wrapper') !== null || element.closest('.mc_pc-header-wrapper') !== null) {
    return true;
  }

  // 指定されたフッター要素の除外
  if (element.closest('.mc_pc-footer-wrapper') !== null || element.closest('.mc_sp-footer-wrapper') !== null) {
    return true;
  }
  return false;
}

/**
 * 要素の深さ（ネストレベル）をチェック
 * @param {Element} element - チェック対象の要素
 * @returns {boolean} 3階層以上のネストがある場合true
 */
function checkDeepNesting(element) {
  function getMaxDepth(el) {
    var currentDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (currentDepth >= 3) return currentDepth; // 3階層に達したら早期終了

    var maxChildDepth = currentDepth;
    var _iterator = _createForOfIteratorHelper(el.children),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;
        var childDepth = getMaxDepth(child, currentDepth + 1);
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return maxChildDepth;
  }
  var maxDepth = getMaxDepth(element);
  console.log("[Checker] Max nesting depth: ".concat(maxDepth));
  return maxDepth >= 3;
}

/**
 * 要素のテキストを安全に取得（最大文字数制限付き）
 * @param {Element} element - 対象要素
 * @param {number} maxLength - 最大文字数
 * @returns {string} 切り詰められたテキスト
 */
function getElementText(element) {
  var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
  var text = element.textContent || '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 要素の完全なHTMLソースを取得
 * @param {Element} element - 対象要素
 * @param {boolean} includeChildren - 子要素も含めるかどうか
 * @returns {string} 完全なHTMLソース
 */
function getElementFullHTML(element) {
  var includeChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!element || !element.outerHTML) {
    return 'HTML取得不可';
  }
  var html = element.outerHTML;

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
  return html.replace(/></g, '>\n<') // タグ間に改行を挿入
  .replace(/\s+/g, ' ') // 複数の空白を1つに統一
  .trim();
}

/**
 * 要素の詳細情報を取得（元の実装を完全復元）
 * @param {Element} element - 対象要素
 * @returns {string} 要素の詳細情報
 */
function getElementDetails(element) {
  if (element.tagName === "IMG") {
    var src = element.src || element.getAttribute("src");
    var alt = element.getAttribute("alt");
    return "<img src=\"".concat(src ? src.split("/").pop() : "src不明", "\" alt=\"").concat(alt || "(alt属性なし)", "\">");
  } else if (element.tagName === "META") {
    var name = element.getAttribute("name");
    var content = element.getAttribute("content");
    return "<meta name=\"".concat(name || "name不明", "\" content=\"").concat(content || "content不明", "\">");
  } else if (element.tagName === "SCRIPT") {
    var _src = element.getAttribute("src");
    if (_src) {
      return "<script src=\"".concat(_src, "\">");
    } else {
      var scriptContent = element.textContent || element.innerHTML;
      return "<script>".concat(scriptContent.substring(0, 100)).concat(scriptContent.length > 100 ? "..." : "", "</script>");
    }
  } else if (element.tagName.startsWith("H")) {
    // 見出し要素の詳細表示
    var headingLevel = element.tagName.charAt(1);
    var id = element.getAttribute("id") || "";
    var className = element.getAttribute("class") || "";
    var innerContent = element.innerHTML.trim();
    if (innerContent.length > 200) {
      innerContent = innerContent.substring(0, 200) + "...";
    }
    var elementText = "<h".concat(headingLevel);
    if (id) elementText += " id=\"".concat(id, "\"");
    if (className) elementText += " class=\"".concat(className, "\"");
    elementText += ">".concat(innerContent, "</h").concat(headingLevel, ">");
    return elementText;
  } else if (["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName)) {
    // フォーム要素の詳細表示
    var type = element.getAttribute("type") || "";
    var _name = element.getAttribute("name") || "";
    var _id = element.getAttribute("id") || "";
    var placeholder = element.getAttribute("placeholder") || "";
    var formInfo = "<".concat(element.tagName.toLowerCase());
    if (type) formInfo += " type=\"".concat(type, "\"");
    if (_id) formInfo += " id=\"".concat(_id, "\"");
    if (_name) formInfo += " name=\"".concat(_name, "\"");
    if (placeholder) formInfo += " placeholder=\"".concat(placeholder, "\"");
    formInfo += ">";
    return formInfo;
  } else if (element.tagName === "A") {
    // リンク要素の詳細表示
    var href = element.getAttribute("href") || "";
    var title = element.getAttribute("title") || "";
    var ariaLabel = element.getAttribute("aria-label") || "";
    var textContent = element.textContent.trim();
    var linkInfo = "<a";
    if (href) linkInfo += " href=\"".concat(href, "\"");
    if (title) linkInfo += " title=\"".concat(title, "\"");
    if (ariaLabel) linkInfo += " aria-label=\"".concat(ariaLabel, "\"");
    linkInfo += ">";
    if (textContent) {
      linkInfo += textContent.length > 50 ? textContent.substring(0, 50) + "..." : textContent;
    } else {
      linkInfo += "(テキストなし)";
    }
    linkInfo += "</a>";
    return linkInfo;
  } else if (element.tagName === "TABLE") {
    // テーブル要素の詳細表示
    var border = element.getAttribute("border") || "";
    var cellpadding = element.getAttribute("cellpadding") || "";
    var cellspacing = element.getAttribute("cellspacing") || "";
    var _className = element.getAttribute("class") || "";
    var tableInfo = "<table";
    if (_className) tableInfo += " class=\"".concat(_className, "\"");
    if (border) tableInfo += " border=\"".concat(border, "\"");
    if (cellpadding) tableInfo += " cellpadding=\"".concat(cellpadding, "\"");
    if (cellspacing) tableInfo += " cellspacing=\"".concat(cellspacing, "\"");
    tableInfo += ">";
    return tableInfo;
  }

  // その他の要素は基本的な表示
  return getElementText(element);
}
;// ./src/content-script/engine/element-preprocessor.js
/**
 * 要素プリプロセッサー - 検査対象要素の事前選別
 * 一度の処理で全DOM要素をスキャンし、検査対象要素を効率的に分類
 */




/**
 * 分析対象要素を事前に選別・分類
 * @returns {Object} 要素タイプ別に分類された検査対象要素
 */
function getAnalysisTargetElements() {
  debug_debugLog('Preprocessor', 'Starting element preprocessing...');
  var startTime = performance.now();

  // 検査対象要素を格納するオブジェクト
  var targetElements = {
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
  var stats = {
    totalElements: 0,
    excludedElements: 0,
    processedElements: 0
  };

  // 全要素を一度だけスキャン
  var allElements = document.querySelectorAll('*');
  stats.totalElements = allElements.length;
  debug_debugLog('Preprocessor', "Scanning ".concat(stats.totalElements, " elements..."));
  Array.from(allElements).forEach(function (element) {
    // 除外対象チェック（一度だけ実行）
    if (dom_isExcludedElement(element)) {
      stats.excludedElements++;
      return;
    }
    stats.processedElements++;

    // 要素タイプ別に分類
    classifyElement(element, targetElements);
  });
  var endTime = performance.now();
  var processingTime = endTime - startTime;

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
  var tagName = element.tagName.toLowerCase();

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
  var tagName = element.tagName.toLowerCase();

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
    if (element.closest('nav') || element.classList.contains('breadcrumb') || element.classList.contains('pagination') || element.closest('.breadcrumb') || element.closest('.pagination')) {
      accessibilityElements.navigationLinks.push(element);
    }
  }

  // フォーム要素
  if (['input', 'select', 'textarea'].includes(tagName)) {
    var inputType = element.getAttribute('type');
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
  if (element.hasAttribute('data-toggle') || element.hasAttribute('aria-controls') || tagName === 'button' && element.hasAttribute('data-toggle') || element.classList.contains('dropdown-toggle') || element.classList.contains('accordion-toggle')) {
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
  var tagName = element.tagName.toLowerCase();

  // time要素
  if (tagName === 'time') {
    semanticElements.timeElements.push(element);
  }

  // 日付らしいテキストを含むdiv要素
  if (tagName === 'div') {
    var text = element.textContent.trim();
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
  var tagName = element.tagName.toLowerCase();

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
  debug_debugLog('Preprocessor', '=== Element Preprocessing Complete ===');
  debug_debugLog('Preprocessor', "Processing time: ".concat(processingTime.toFixed(2), "ms"));
  debug_debugLog('Preprocessor', "Total elements: ".concat(stats.totalElements));
  debug_debugLog('Preprocessor', "Excluded elements: ".concat(stats.excludedElements));
  debug_debugLog('Preprocessor', "Processed elements: ".concat(stats.processedElements));

  // 見出し統計
  debug_debugLog('Preprocessor', "Headings: ".concat(targetElements.headings.all.length, " total"));
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
    var count = targetElements.headings[tag].length;
    if (count > 0) {
      debug_debugLog('Preprocessor', "  ".concat(tag.toUpperCase(), ": ").concat(count));
    }
  });

  // アクセシビリティ統計
  debug_debugLog('Preprocessor', "Images: ".concat(targetElements.accessibility.images.length, " (").concat(targetElements.accessibility.imagesWithoutAlt.length, " without alt)"));
  debug_debugLog('Preprocessor', "Links: ".concat(targetElements.accessibility.links.length));
  debug_debugLog('Preprocessor', "Form elements: ".concat(targetElements.accessibility.formElements.length));
  debug_debugLog('Preprocessor', "Elements with role: ".concat(targetElements.accessibility.elementsWithRole.length));
  debug_debugLog('Preprocessor', '======================================');
}

/**
 * 除外要素統計を取得（開発・デバッグ用）
 * @returns {Object} 除外要素の統計情報
 */
function getExclusionStats() {
  var allElements = document.querySelectorAll('*');
  var excludedElements = [];
  var excludedByReason = {
    htmlChecker: 0,
    header: 0,
    footer: 0
  };
  Array.from(allElements).forEach(function (element) {
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
;// ./src/content-script/analysis/heading.js
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || heading_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function heading_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return heading_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? heading_arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return heading_arrayLikeToArray(r); }
function heading_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * 見出し構造分析モジュール
 */





/**
 * 見出し構造を分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Object} 見出し構造の分析結果
 */
function analyzeHeadingStructure() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  // プリプロセス済み要素が提供されている場合はそれを使用
  var headings = targetElements ? targetElements.headings : {
    all: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h1: Array.from(document.querySelectorAll('h1')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h2: Array.from(document.querySelectorAll('h2')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h3: Array.from(document.querySelectorAll('h3')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h4: Array.from(document.querySelectorAll('h4')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h5: Array.from(document.querySelectorAll('h5')).filter(function (h) {
      return !dom_isExcludedElement(h);
    }),
    h6: Array.from(document.querySelectorAll('h6')).filter(function (h) {
      return !dom_isExcludedElement(h);
    })
  };
  var structure = {
    total: headings.all.length,
    h1Count: headings.h1.length,
    h2Count: headings.h2.length,
    h3Count: headings.h3.length,
    h4Count: headings.h4.length,
    h5Count: headings.h5.length,
    h6Count: headings.h6.length,
    hasProperHierarchy: true,
    issues: []
  };

  // 見出し階層チェック
  if (structure.h1Count === 0) {
    structure.issues.push('H1見出しが存在しません');
    structure.hasProperHierarchy = false;
  }
  if (structure.h1Count > 1) {
    structure.issues.push('H1見出しが複数存在します');
  }
  return structure;
}

/**
 * 見出し関連の問題を検出（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
function detectHeadingIssues() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];

  // H1タグチェック（プリプロセス済み要素を使用）
  var h1Elements = targetElements ? targetElements.headings.h1 : Array.from(document.querySelectorAll('h1')).filter(function (h) {
    return !dom_isExcludedElement(h);
  });
  debug_debugLog('Checker', 'H1 elements found (excluding excluded elements):', h1Elements.length);
  if (h1Elements.length === 0) {
    issues.push({
      category: 'heading',
      severity: SEVERITY.ERROR,
      rule: 'missing_h1',
      name: 'H1タグの欠落',
      message: 'ページにH1タグがありません。H1はページのメインタイトルを表し、SEOとアクセシビリティの観点から必須です。',
      elements: [],
      solution: getH1SolutionText()
    });
  }

  // 見出し構造の詳細チェック
  var headingStructureIssues = analyzeDetailedHeadingStructure(targetElements);
  issues.push.apply(issues, _toConsumableArray(headingStructureIssues));
  return issues;
}

/**
 * 詳細な見出し構造の分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 見出し構造の問題リスト
 */
function analyzeDetailedHeadingStructure() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];
  var headings = targetElements ? targetElements.headings.all : Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(function (h) {
    return !dom_isExcludedElement(h);
  });
  var problematicHeadings = [];
  var headingStructureProblems = [];
  var previousLevel = 0;
  headings.forEach(function (heading, index) {
    var level = parseInt(heading.tagName.charAt(1));
    var rawText = heading.textContent.trim();
    var headingText = rawText.substring(0, 30) + (rawText.length > 30 ? '...' : '');
    debug_debugLog('Checker', "Processing heading ".concat(index + 1, ": H").concat(level, " \"").concat(headingText, "\" (previous: H").concat(previousLevel, ")"));
    debug_debugLog('Checker', "- innerHTML: ".concat(heading.innerHTML.substring(0, 100)));
    debug_debugLog('Checker', "- textContent: \"".concat(heading.textContent, "\""));
    debug_debugLog('Checker', "- trimmed length: ".concat(rawText.length));

    // 空の見出しチェック（より厳密な判定）
    var hasVisibleText = rawText.length > 0 && !/^\s*$/.test(rawText);

    // H1が画像のみの場合の特別処理
    var isImageOnlyH1 = level === 1 && !hasVisibleText && heading.children.length === 1 && heading.children[0].tagName === 'IMG' && heading.children[0].hasAttribute('alt') && heading.children[0].getAttribute('alt').trim().length > 0;
    if (!hasVisibleText && !isImageOnlyH1) {
      debug_debugLog('Checker', "Empty heading detected: H".concat(level));
      debug_debugLog('Checker', "- Raw text: \"".concat(rawText, "\""));
      debug_debugLog('Checker', "- Has children: ".concat(heading.children.length > 0));

      // 子要素がある場合は、本当にテキストがないか再確認
      if (heading.children.length > 0) {
        var childrenText = Array.from(heading.children).map(function (child) {
          return child.textContent.trim();
        }).join('');
        debug_debugLog('Checker', "- Children text: \"".concat(childrenText, "\""));

        // 子要素にもテキストがない場合のみ空と判定
        if (childrenText.length === 0) {
          problematicHeadings.push(heading);
          headingStructureProblems.push({
            element: heading,
            problem: "H".concat(level, "\u304C\u7A7A\u3067\u3059\uFF08\u30C6\u30AD\u30B9\u30C8\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\uFF09"),
            text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
            suggestion: "\u3053\u306E\u898B\u51FA\u3057\u8981\u7D20\u3092\u524A\u9664\u3059\u308B\u304B\u3001\u9069\u5207\u306A\u30C6\u30AD\u30B9\u30C8\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044"
          });
        }
      } else {
        // 子要素がなく、テキストもない場合
        problematicHeadings.push(heading);
        headingStructureProblems.push({
          element: heading,
          problem: "H".concat(level, "\u304C\u7A7A\u3067\u3059\uFF08\u30C6\u30AD\u30B9\u30C8\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\uFF09"),
          text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
          suggestion: "\u3053\u306E\u898B\u51FA\u3057\u8981\u7D20\u3092\u524A\u9664\u3059\u308B\u304B\u3001\u9069\u5207\u306A\u30C6\u30AD\u30B9\u30C8\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044"
        });
      }
    }

    // 画像のみのH1に対する警告（エラーではなく警告として）
    if (isImageOnlyH1) {
      debug_debugLog('Checker', "Image-only H1 detected with alt text");
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: "H1\u304C\u753B\u50CF\u306E\u307F\u3067\u3059\uFF08SEO\u3068\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u306E\u89B3\u70B9\u304B\u3089\u6539\u5584\u63A8\u5968\uFF09",
        text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
        suggestion: "\u753B\u50CF\u306EH1\u3092\u30C6\u30AD\u30B9\u30C8\u30D9\u30FC\u30B9\u306EH1\u306B\u5909\u66F4\u3059\u308B\u3053\u3068\u3092\u63A8\u5968\u3057\u307E\u3059\uFF1A<h1>\u962A\u6025\u30D3\u30E5\u30FC\u30C6\u30A3\u30FC\u30AA\u30F3\u30E9\u30A4\u30F3</h1>\n\u753B\u50CF\u306F<img>\u30BF\u30B0\u3068\u3057\u3066\u5225\u9014\u914D\u7F6E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
      });
    }

    // 不適切な複数タグ挿入のチェック
    var childElements = heading.children;
    var childTags = Array.from(childElements).map(function (el) {
      return el.tagName;
    });

    // 複雑すぎる構造の検出条件を改善
    var hasDeepNesting = checkDeepNesting(heading);
    var hasTooManyChildren = childElements.length >= 5; // 5つ以上の子要素
    var hasMultipleSameTypeTags = childTags.filter(function (tag) {
      return tag === 'SPAN';
    }).length >= 5 ||
    // 5つ以上のSPAN
    childTags.filter(function (tag) {
      return tag === 'DIV';
    }).length >= 3; // 3つ以上のDIV

    // 単純なタグは除外
    var hasOnlySimpleTags = childTags.length > 0 && childTags.every(function (tag) {
      return ALLOWED_SIMPLE_TAGS.includes(tag);
    });

    // 単純なタグのみの場合は複雑な構造として扱わない
    var isActuallyComplex = (hasDeepNesting || hasTooManyChildren || hasMultipleSameTypeTags) && !hasOnlySimpleTags;

    // デバッグ情報を追加
    debug_debugLog('Checker', "Analyzing H".concat(level, " structure:"));
    debug_debugLog('Checker', "- Children count: ".concat(childElements.length));
    debug_debugLog('Checker', "- Child tags: ".concat(childTags));
    debug_debugLog('Checker', "- SPAN count: ".concat(childTags.filter(function (tag) {
      return tag === 'SPAN';
    }).length));
    debug_debugLog('Checker', "- DIV count: ".concat(childTags.filter(function (tag) {
      return tag === 'DIV';
    }).length));
    debug_debugLog('Checker', "- Deep nesting check result: ".concat(hasDeepNesting));
    debug_debugLog('Checker', "- Too many children: ".concat(hasTooManyChildren));
    debug_debugLog('Checker', "- Multiple same type tags: ".concat(hasMultipleSameTypeTags));
    debug_debugLog('Checker', "- Has only simple tags: ".concat(hasOnlySimpleTags));
    debug_debugLog('Checker', "- Is actually complex: ".concat(isActuallyComplex));
    if (isActuallyComplex) {
      debug_debugLog('Checker', "Complex heading structure detected: H".concat(level));
      debug_debugLog('Checker', "- Deep nesting: ".concat(hasDeepNesting, ", Many children: ").concat(hasTooManyChildren, ", Multiple same tags: ").concat(hasMultipleSameTypeTags));
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: "H".concat(level, "\u306E\u69CB\u9020\u304C\u8907\u96D1\u3059\u304E\u307E\u3059\uFF08").concat(childElements.length, "\u500B\u306E\u5B50\u8981\u7D20\u3001\u307E\u305F\u306F\u6DF1\u3044\u30CD\u30B9\u30C8\u69CB\u9020\uFF09"),
        text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
        suggestion: "\u898B\u51FA\u3057\u30BF\u30B0\u5185\u306E\u69CB\u9020\u3092\u30B7\u30F3\u30D7\u30EB\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u63A8\u5968: <h".concat(level, ">\u30B7\u30F3\u30D7\u30EB\u306A\u30C6\u30AD\u30B9\u30C8</h").concat(level, "> \u307E\u305F\u306F <h").concat(level, "><span>\u88C5\u98FE\u30C6\u30AD\u30B9\u30C8</span></h").concat(level, ">")
      });
    }

    // 装飾目的のH1チェック（フッターロゴなど）
    if (level === 1 && (heading.closest('footer') !== null || heading.className.includes('footer') && heading.className.includes('logo'))) {
      debug_debugLog('Checker', "Decorative H1 detected in footer");
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: "H1\u304C\u30D5\u30C3\u30BF\u30FC\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u88C5\u98FE\u76EE\u7684\u3067\u306E\u4E0D\u9069\u5207\u306A\u4F7F\u7528\uFF09",
        text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
        suggestion: "\u30D5\u30C3\u30BF\u30FC\u306E\u30ED\u30B4\u306Fdiv\u3084span\u306B\u5909\u66F4\u3057\u3001\u30DA\u30FC\u30B8\u672C\u6587\u306E\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u306BH1\u3092\u4F7F\u7528\u3057\u3066\u304F\u3060\u3055\u3044"
      });
    }

    // 最初の要素でない場合のレベルジャンプチェック
    if (index > 0 && level - previousLevel > 1) {
      debug_debugLog('Checker', "Level skip detected: H".concat(previousLevel, " \u2192 H").concat(level));
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: "H".concat(previousLevel, "\u306E\u6B21\u306BH").concat(level, "\u304C\u6765\u3066\u3044\u307E\u3059\uFF08H").concat(previousLevel + 1, "\u3092\u30B9\u30AD\u30C3\u30D7\uFF09"),
        text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
        suggestion: "H".concat(level, "\u3092H").concat(previousLevel + 1, "\u306B\u5909\u66F4\u3059\u308B\u304B\u3001\u4E0D\u8DB3\u3057\u3066\u3044\u308B\u898B\u51FA\u3057\u30EC\u30D9\u30EB\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044")
      });
    }

    // H1が複数ある場合（装飾目的でない場合のみ）
    if (level === 1 && index > 0 && !heading.className.includes('logo') && !heading.className.includes('footer')) {
      var firstH1Index = Array.from(headings).findIndex(function (h) {
        return parseInt(h.tagName.charAt(1)) === 1;
      });
      if (index > firstH1Index) {
        debug_debugLog('Checker', "Multiple H1 detected at index ".concat(index));
        problematicHeadings.push(heading);
        headingStructureProblems.push({
          element: heading,
          problem: "H1\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\uFF08\u30DA\u30FC\u30B8\u306B1\u3064\u306EH1\u306E\u307F\u63A8\u5968\uFF09",
          text: "\u5B9F\u969B\u306EHTML:\n".concat(getElementFullHTML(heading)),
          suggestion: "H1\u3092H2\u4EE5\u4E0B\u306B\u5909\u66F4\u3059\u308B\u304B\u3001\u3053\u306EH1\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044"
        });
      }
    }

    // 見出しレベルの記録
    // テキストがある見出しまたは画像のみのH1の場合はレベルを記録
    if (hasVisibleText || isImageOnlyH1) {
      previousLevel = level;
      if (isImageOnlyH1) {
        debug_debugLog('Checker', "Image-only H1 detected, setting previousLevel to ".concat(level, " for proper hierarchy"));
      }
    }
  });
  debug_debugLog('Checker', "Heading analysis complete. Problematic headings: ".concat(problematicHeadings.length));
  debug_debugLog('Checker', 'Problematic headings:', problematicHeadings.map(function (h) {
    return {
      tag: h.tagName,
      text: h.textContent.trim().substring(0, 20)
    };
  }));
  if (problematicHeadings.length > 0) {
    // 具体的な問題説明と解決策を生成
    var detailedMessage = "".concat(problematicHeadings.length, "\u500B\u306E\u898B\u51FA\u3057\u3067\u968E\u5C64\u69CB\u9020\u306B\u554F\u984C\u304C\u3042\u308A\u307E\u3059\u3002\u9069\u5207\u306A\u898B\u51FA\u3057\u69CB\u9020\u306F\u3001\u30DA\u30FC\u30B8\u306E\u5185\u5BB9\u3092\u8AD6\u7406\u7684\u306B\u6574\u7406\u3057\u3001\u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u30E6\u30FC\u30B6\u30FC\u306E\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u3092\u6539\u5584\u3057\u307E\u3059\u3002");
    issues.push({
      category: 'heading',
      severity: SEVERITY.WARNING,
      rule: 'heading_structure',
      name: '見出し構造の不適切',
      message: detailedMessage,
      elements: problematicHeadings,
      solution: formatHeadingStructureSolution(headingStructureProblems)
    });
  }
  return issues;
}

/**
 * H1欠落時の解決策テキストを取得
 * @returns {string} 解決策のテキスト
 */
function getH1SolutionText() {
  return "H1\u30BF\u30B0\u306E\u8FFD\u52A0\u65B9\u6CD5:\n\n\u57FA\u672C\u7684\u306A\u8FFD\u52A0:\n<h1>\u30DA\u30FC\u30B8\u306E\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB</h1>\n\n\u5177\u4F53\u4F8B:\n\u2022 \u5546\u54C1\u30DA\u30FC\u30B8: <h1>\u5546\u54C1\u540D</h1>\n\u2022 \u8A18\u4E8B\u30DA\u30FC\u30B8: <h1>\u8A18\u4E8B\u30BF\u30A4\u30C8\u30EB</h1>  \n\u2022 \u30B5\u30FC\u30D3\u30B9\u30DA\u30FC\u30B8: <h1>\u30B5\u30FC\u30D3\u30B9\u540D</h1>\n\u2022 \u4F1A\u793E\u60C5\u5831: <h1>\u4F1A\u793E\u6982\u8981</h1>\n\n\u91CD\u8981\u306A\u6CE8\u610F\u70B9:\n\u2022 H1\u306F1\u30DA\u30FC\u30B8\u306B1\u3064\u3060\u3051\n\u2022 \u30DA\u30FC\u30B8\u306E\u6700\u3082\u91CD\u8981\u306A\u5185\u5BB9\u3092\u8868\u3059\n\u2022 \u30ED\u30B4\u3084\u30B5\u30A4\u30C8\u540D\u3067\u306F\u306A\u304F\u3001\u305D\u306E\u30DA\u30FC\u30B8\u56FA\u6709\u306E\u5185\u5BB9\n\u2022 \u4ED6\u306E\u898B\u51FA\u3057\uFF08H2, H3\u7B49\uFF09\u3088\u308A\u524D\u306B\u914D\u7F6E\n\n\u274C \u907F\u3051\u308B\u3079\u304D\u4F8B:\n<h1>\u3088\u3046\u3053\u305D</h1>  \u2190 \u6C4E\u7528\u7684\u3059\u304E\u308B\n<h1>\u30B5\u30A4\u30C8\u540D</h1>  \u2190 \u30B5\u30A4\u30C8\u540D\u306FH1\u306B\u4E0D\u9069\u5207\n\n\u2705 \u826F\u3044\u4F8B:\n<h1>HTML \u30BB\u30DE\u30F3\u30C6\u30A3\u30C3\u30AF\u30C1\u30A7\u30C3\u30AB\u30FC\u306E\u4F7F\u3044\u65B9</h1>  \u2190 \u5177\u4F53\u7684\u3067\u6709\u7528";
}

/**
 * 見出し構造の問題に対する解決策をフォーマット
 * @param {Array} problems - 見出しの問題リスト
 * @returns {string} フォーマットされた解決策テキスト
 */
function formatHeadingStructureSolution(problems) {
  var problemsByRule = {
    emptyHeading: problems.filter(function (p) {
      return p.problem.includes('空です');
    }),
    logoH1: problems.filter(function (p) {
      return p.problem.includes('フッター');
    }),
    levelSkip: problems.filter(function (p) {
      return p.problem.includes('スキップ');
    }),
    multipleH1: problems.filter(function (p) {
      return p.problem.includes('複数存在');
    }),
    complexStructure: problems.filter(function (p) {
      return p.problem.includes('複雑すぎます');
    })
  };
  var solutionText = '';

  // 各問題タイプごとに解決策を生成
  if (problemsByRule.emptyHeading.length > 0) {
    solutionText += formatProblemSection('空の見出しタグ', problemsByRule.emptyHeading, '見出し要素を削除するか、適切なテキストを追加', '<h1>ページタイトル</h1> または <div class="logo">サイト名</div>', 'SEO効果なし、スクリーンリーダーで認識不可');
  }
  if (problemsByRule.logoH1.length > 0) {
    solutionText += formatProblemSection('フッターでのH1使用', problemsByRule.logoH1, 'フッターのテキストは div または span に変更', '<div class="footer__logo">サイト名</div>', 'H1の意味が曖昧になり、SEOに悪影響');
  }

  // 他の問題タイプも同様にフォーマット...

  return solutionText;
}

/**
 * 問題セクションをフォーマット
 * @param {string} title - 問題のタイトル
 * @param {Array} problems - 問題リスト
 * @param {string} solution - 解決方法
 * @param {string} example - 例
 * @param {string} impact - 影響
 * @returns {string} フォーマットされたセクション
 */
function formatProblemSection(title, problems, solution, example, impact) {
  return "\uD83D\uDEA8 \u554F\u984C: ".concat(title, " (").concat(problems.length, "\u500B)\n").concat(problems.map(function (p) {
    return "\u2022 ".concat(p.text || '(空の要素)');
  }).join('\n'), "\n\n\uD83D\uDD27 \u4FEE\u6B63\u65B9\u6CD5: ").concat(solution, "\n\u2705 \u4F8B: ").concat(example, "\n\uD83D\uDCD6 \u5F71\u97FF: ").concat(impact, "\n\n");
}
;// ./src/content-script/analysis/accessibility.js
function accessibility_toConsumableArray(r) { return accessibility_arrayWithoutHoles(r) || accessibility_iterableToArray(r) || accessibility_unsupportedIterableToArray(r) || accessibility_nonIterableSpread(); }
function accessibility_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function accessibility_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return accessibility_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? accessibility_arrayLikeToArray(r, a) : void 0; } }
function accessibility_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function accessibility_arrayWithoutHoles(r) { if (Array.isArray(r)) return accessibility_arrayLikeToArray(r); }
function accessibility_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * アクセシビリティ分析モジュール
 */





/**
 * アクセシビリティ全体の分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Object} アクセシビリティ分析結果
 */
function analyzeAccessibility() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  // プリプロセス済み要素がある場合はそれを使用
  if (targetElements) {
    return {
      images: {
        total: targetElements.accessibility.images.length,
        withoutAlt: targetElements.accessibility.imagesWithoutAlt.length,
        withEmptyAlt: targetElements.accessibility.images.filter(function (img) {
          return img.getAttribute('alt') === '';
        }).length
      },
      links: {
        total: targetElements.accessibility.links.length,
        withoutText: targetElements.accessibility.links.filter(function (link) {
          return !link.textContent.trim();
        }).length,
        withoutAriaLabel: targetElements.accessibility.links.filter(function (link) {
          return !link.hasAttribute('aria-label') && !link.hasAttribute('title');
        }).length
      },
      forms: {
        inputs: targetElements.accessibility.formElements.filter(function (el) {
          return el.tagName === 'INPUT';
        }).length,
        inputsWithoutLabels: targetElements.accessibility.formElements.filter(function (el) {
          return !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby');
        }).length,
        textareas: targetElements.accessibility.formElements.filter(function (el) {
          return el.tagName === 'TEXTAREA';
        }).length
      },
      landmarks: {
        hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        hasMainLandmark: document.querySelectorAll('main, [role="main"]').length > 0
      }
    };
  }

  // フォールバック：従来の方式
  return {
    images: {
      total: document.querySelectorAll('img').length,
      withoutAlt: document.querySelectorAll('img:not([alt])').length,
      withEmptyAlt: document.querySelectorAll('img[alt=""]').length
    },
    links: {
      total: document.querySelectorAll('a').length,
      withoutText: document.querySelectorAll('a:empty').length,
      withoutAriaLabel: document.querySelectorAll('a:not([aria-label]):not([title])').length
    },
    forms: {
      inputs: document.querySelectorAll('input').length,
      inputsWithoutLabels: document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').length,
      textareas: document.querySelectorAll('textarea').length
    },
    landmarks: {
      hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
      hasMainLandmark: document.querySelectorAll('main, [role="main"]').length > 0
    }
  };
}

/**
 * アクセシビリティ関連の問題を検出（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
function detectAccessibilityIssues() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];

  // alt属性チェック
  var altIssues = checkImageAltAttributes(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(altIssues));

  // フォームラベルチェック
  var formLabelIssues = checkFormLabels(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(formLabelIssues));

  // ARIA属性チェック
  var ariaIssues = checkAriaAttributes(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(ariaIssues));

  // 必須ARIA属性チェック
  var ariaRequiredIssues = checkAriaRequired(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(ariaRequiredIssues));

  // リンクのアクセシビリティチェック
  var linkIssues = checkLinkAccessibility(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(linkIssues));

  // レイアウトテーブルチェック
  var tableIssues = checkLayoutTables(targetElements);
  issues.push.apply(issues, accessibility_toConsumableArray(tableIssues));
  return issues;
}

/**
 * 画像のalt属性をチェック（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} alt属性に関する問題リスト
 */
function checkImageAltAttributes() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];

  // プリプロセス済み要素がある場合はそれを使用
  var imagesWithoutAlt = targetElements ? targetElements.accessibility.imagesWithoutAlt : Array.from(document.querySelectorAll('img:not([alt])')).filter(function (img) {
    return !dom_isExcludedElement(img);
  });
  debug_debugLog('Checker', 'Images without alt found:', imagesWithoutAlt.length);

  // トラッキングピクセルを除外（プリプロセス済みの場合は既に除外済み）
  var filteredImages = targetElements ? imagesWithoutAlt.filter(function (img) {
    // プリプロセス済みの場合は除外チェックは不要、トラッキングピクセルのみチェック
    var src = img.src || img.getAttribute('src') || '';
    var isTrackingUrl = TRACKING_PIXEL_PATTERNS.some(function (pattern) {
      return pattern.test(src);
    });

    // サイズチェック（1x1ピクセル）
    var is1x1Pixel = img.width === 1 && img.height === 1 || img.naturalWidth === 1 && img.naturalHeight === 1 || img.getAttribute('width') === '1' && img.getAttribute('height') === '1';

    // 隠し要素チェック
    var computedStyle = window.getComputedStyle(img);
    var isHidden = computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || img.style.display === 'none' || img.style.visibility === 'hidden';
    return !isTrackingUrl && !is1x1Pixel && !isHidden;
  }) : imagesWithoutAlt.filter(function (img) {
    // 従来の方式：すべてのチェックを実行
    // URLチェック
    var src = img.src || img.getAttribute('src') || '';
    var isTrackingUrl = TRACKING_PIXEL_PATTERNS.some(function (pattern) {
      return pattern.test(src);
    });

    // サイズチェック（1x1ピクセル）
    var is1x1Pixel = img.width === 1 && img.height === 1 || img.naturalWidth === 1 && img.naturalHeight === 1 || img.getAttribute('width') === '1' && img.getAttribute('height') === '1';

    // 隠し要素チェック
    var computedStyle = window.getComputedStyle(img);
    var isHidden = computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || img.style.display === 'none' || img.style.visibility === 'hidden';

    // トラッキングピクセルでない場合のみ含める
    return !isTrackingUrl && !is1x1Pixel && !isHidden;
  });
  debug_debugLog('Checker', 'After filtering tracking pixels:', filteredImages.length);
  if (filteredImages.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'missing_alt',
      name: '画像のalt属性欠落',
      message: "".concat(filteredImages.length, "\u500B\u306E\u753B\u50CF\u306Balt\u5C5E\u6027\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u8996\u899A\u969C\u5BB3\u306E\u3042\u308B\u30E6\u30FC\u30B6\u30FC\u304C\u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u3067\u753B\u50CF\u306E\u5185\u5BB9\u3092\u7406\u89E3\u3067\u304D\u307E\u305B\u3093\u3002SEO\u7684\u306B\u3082\u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u304C\u753B\u50CF\u3092\u8A8D\u8B58\u3067\u304D\u307E\u305B\u3093\u3002"),
      elements: filteredImages,
      solution: getAltAttributeSolution()
    });
  }
  return issues;
}

/**
 * フォーム要素のラベルをチェック
 * @returns {Array} ラベルに関する問題リスト
 */
function checkFormLabels() {
  var issues = [];
  var formElements = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
  var missingLabels = Array.from(formElements).filter(function (el) {
    var _el$id, _el$className;
    // 除外対象要素を除外
    if (dom_isExcludedElement(el)) {
      return false;
    }
    var hasLabel = el.id && document.querySelector("label[for=\"".concat(el.id, "\"]")) !== null;
    var hasAriaLabel = el.hasAttribute('aria-label');
    var hasAriaLabelledby = el.hasAttribute('aria-labelledby');
    var hasPlaceholder = el.hasAttribute('placeholder');
    var hasTitle = el.hasAttribute('title');

    // 検索フィールドなど、コンテキストが明確な要素を除外
    var isSearchField = el.name === 'q' || el.name === 'search' || ((_el$id = el.id) === null || _el$id === void 0 ? void 0 : _el$id.includes('search')) || ((_el$className = el.className) === null || _el$className === void 0 ? void 0 : _el$className.includes('search'));
    return !hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasPlaceholder && !hasTitle && !isSearchField;
  });
  if (missingLabels.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'missing_form_labels',
      name: 'フォーム要素のラベル不足',
      message: "".concat(missingLabels.length, "\u500B\u306E\u30D5\u30A9\u30FC\u30E0\u8981\u7D20\u306B\u30A2\u30AF\u30BB\u30B7\u30D6\u30EB\u306A\u30E9\u30D9\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002"),
      elements: missingLabels,
      solution: getFormLabelSolution()
    });
  }
  return issues;
}

/**
 * ARIA属性をチェック
 * @returns {Array} ARIA属性に関する問題リスト
 */
function checkAriaAttributes() {
  var issues = [];

  // aria-expandedチェック
  var expandableSelectors = ['button[data-toggle]', '[role="button"][data-toggle]', 'details summary', '.dropdown-toggle', '.accordion-toggle', '[aria-controls]'];
  var expandableElements = document.querySelectorAll(expandableSelectors.join(', '));
  var missingAriaExpanded = Array.from(expandableElements).filter(function (el) {
    if (el.tagName === 'SUMMARY') return false; // details要素は除外
    return !el.hasAttribute('aria-expanded');
  });
  if (missingAriaExpanded.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.WARNING,
      rule: 'missing_aria_expanded',
      name: 'インタラクティブ要素のARIA展開状態不足',
      message: "".concat(missingAriaExpanded.length, "\u500B\u306E\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6\u8981\u7D20\u306Baria-expanded\u5C5E\u6027\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059"),
      elements: missingAriaExpanded,
      solution: getAriaExpandedSolution()
    });
  }

  // aria-currentチェック
  var navigationLinks = document.querySelectorAll('nav a, .breadcrumb a, .pagination a');
  var missingAriaCurrent = Array.from(navigationLinks).filter(function (link) {
    var hasActiveClass = link.classList.contains('active') || link.classList.contains('current');
    var isSameUrl = link.href === window.location.href;
    return (hasActiveClass || isSameUrl) && !link.hasAttribute('aria-current');
  });
  if (missingAriaCurrent.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.WARNING,
      rule: 'missing_aria_current',
      name: '現在位置のARIA属性不足',
      message: "".concat(missingAriaCurrent.length, "\u500B\u306E\u30A2\u30AF\u30C6\u30A3\u30D6\u306A\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u30EA\u30F3\u30AF\u306Baria-current\u5C5E\u6027\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059"),
      elements: missingAriaCurrent,
      solution: getAriaCurrentSolution()
    });
  }
  return issues;
}

/**
 * 必須ARIA属性をチェック（元の実装）
 * @returns {Array} 必須ARIA属性に関する問題リスト
 */
function checkAriaRequired() {
  var issues = [];

  // role属性に基づく必須ARIA属性チェック
  var elementsWithRole = document.querySelectorAll('[role]');
  var missingRequired = [];
  Array.from(elementsWithRole).forEach(function (element) {
    // 除外対象要素を除外
    if (dom_isExcludedElement(element)) {
      return;
    }
    var role = element.getAttribute('role');

    // roleに応じた必須属性をチェック
    switch (role) {
      case 'button':
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && !element.textContent.trim()) {
          missingRequired.push(element);
        }
        break;
      case 'tab':
        if (!element.hasAttribute('aria-selected')) {
          missingRequired.push(element);
        }
        break;
      case 'tabpanel':
        if (!element.hasAttribute('aria-labelledby')) {
          missingRequired.push(element);
        }
        break;
      case 'slider':
        if (!element.hasAttribute('aria-valuenow') || !element.hasAttribute('aria-valuemin') || !element.hasAttribute('aria-valuemax')) {
          missingRequired.push(element);
        }
        break;
      case 'progressbar':
        if (!element.hasAttribute('aria-valuenow')) {
          missingRequired.push(element);
        }
        break;
    }
  });
  if (missingRequired.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'missing_aria_required',
      name: '必須ARIA属性不足',
      message: "".concat(missingRequired.length, "\u500B\u306E\u8981\u7D20\u306B\u5FC5\u9808\u306EARIA\u5C5E\u6027\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059\u3002role\u306B\u5FDC\u3058\u305F\u9069\u5207\u306AARIA\u5C5E\u6027\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: missingRequired,
      solution: getAriaRequiredSolution()
    });
  }
  return issues;
}

/**
 * 必須ARIA属性の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAriaRequiredSolution() {
  return "\u5FC5\u9808ARIA\u5C5E\u6027\u306E\u8A2D\u5B9A\u65B9\u6CD5:\n\nrole\u306B\u5FDC\u3058\u305F\u5FC5\u9808\u5C5E\u6027:\n\n1. role=\"button\"\u306E\u5834\u5408:\n<div role=\"button\" aria-label=\"\u9001\u4FE1\">\u9001\u4FE1</div>\n\u307E\u305F\u306F\n<div role=\"button\" aria-labelledby=\"btn-label\">\n  <span id=\"btn-label\">\u9001\u4FE1</span>\n</div>\n\n2. role=\"tab\"\u306E\u5834\u5408:\n<div role=\"tab\" aria-selected=\"true\">\u30BF\u30D61</div>\n<div role=\"tab\" aria-selected=\"false\">\u30BF\u30D62</div>\n\n3. role=\"tabpanel\"\u306E\u5834\u5408:\n<div role=\"tabpanel\" aria-labelledby=\"tab1\">\n  \u30BF\u30D6\u30D1\u30CD\u30EB\u306E\u5185\u5BB9\n</div>\n\n4. role=\"slider\"\u306E\u5834\u5408:\n<div role=\"slider\" \n     aria-valuenow=\"50\" \n     aria-valuemin=\"0\" \n     aria-valuemax=\"100\"\n     aria-label=\"\u97F3\u91CF\">\n</div>\n\n5. role=\"progressbar\"\u306E\u5834\u5408:\n<div role=\"progressbar\" \n     aria-valuenow=\"70\" \n     aria-valuemin=\"0\" \n     aria-valuemax=\"100\"\n     aria-label=\"\u9032\u6357\">\n</div>\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 role\u3092\u8A2D\u5B9A\u3057\u305F\u3089\u5BFE\u5FDC\u3059\u308B\u5FC5\u9808\u5C5E\u6027\u3082\u8A2D\u5B9A\n\u2022 \u8996\u899A\u7684\u306A\u60C5\u5831\u3092ARIA\u5C5E\u6027\u3067\u88DC\u5B8C\n\u2022 \u52D5\u7684\u306A\u5024\u306E\u5909\u66F4\u6642\u306FJavaScript\u3067\u5C5E\u6027\u3082\u66F4\u65B0\n\u2022 \u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u3067\u306E\u8AAD\u307F\u4E0A\u3052\u3092\u8003\u616E\n\n\u274C \u60AA\u3044\u4F8B:\n<div role=\"button\">\u30DC\u30BF\u30F3</div>  \u2190 aria-label\u306A\u3057\n\n\u2705 \u826F\u3044\u4F8B:\n<div role=\"button\" aria-label=\"\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F\">\u2630</div>";
}

/**
 * リンクのアクセシビリティをチェック（元の実装を復元）
 * @returns {Array} リンクに関する問題リスト
 */
function checkLinkAccessibility() {
  var issues = [];

  // リンクのボタン化チェック（改善版）
  var problematicLinksSet = new Set();
  var links = document.querySelectorAll('a');
  Array.from(links).forEach(function (link) {
    // 除外対象要素を除外
    if (dom_isExcludedElement(link)) {
      return;
    }
    var href = link.getAttribute('href');
    var onclick = link.getAttribute('onclick');
    var hasJSAction = onclick !== null || link.onclick !== null;

    // 以下の場合は問題として検出
    // 1. href が空/# + JavaScriptアクションあり
    // 2. javascript:void(0) を使用（JavaScriptアクションの有無に関わらず）
    var isButtonMisuse = (!href || href === '#') && hasJSAction;
    var hasJSVoid = href === 'javascript:void(0)';
    if (isButtonMisuse || hasJSVoid) {
      problematicLinksSet.add(link);
    }
  });
  var problematicLinks = Array.from(problematicLinksSet);
  if (problematicLinks.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'link_button_misuse',
      name: 'リンクのボタン化',
      message: "".concat(problematicLinks.length, "\u500B\u306E\u30EA\u30F3\u30AF\u304C\u30DC\u30BF\u30F3\u3068\u3057\u3066\u8AA4\u7528\u3055\u308C\u3066\u3044\u307E\u3059\u3002href=\"#\"\u3084javascript:void(0)\u3092\u4F7F\u7528\u305B\u305A\u3001\u9069\u5207\u306A<button>\u30BF\u30B0\u307E\u305F\u306F\u6709\u52B9\u306AURL\u3092\u4F7F\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: problematicLinks,
      solution: getLinkButtonMisuseSolution()
    });
  }
  return issues;
}

/**
 * リンクボタン誤用の解決策テキスト（元の実装）
 * @returns {string} 解決策のテキスト
 */
function getLinkButtonMisuseSolution() {
  return "\u30EA\u30F3\u30AF\u306E\u30DC\u30BF\u30F3\u5316\u306E\u4FEE\u6B63\u65B9\u6CD5:\n\n\u274C \u73FE\u5728\uFF08\u30EA\u30F3\u30AF\u306E\u30DC\u30BF\u30F3\u5316\uFF09:\n<a href=\"#\" onclick=\"doSomething()\">\u30DC\u30BF\u30F3</a>\n<a href=\"javascript:void(0)\" onclick=\"action()\">\u30A2\u30AF\u30B7\u30E7\u30F3</a>\n\n\u2705 \u4FEE\u6B63\u5F8C\uFF08\u9069\u5207\u306A\u30DC\u30BF\u30F3\uFF09:\n<button type=\"button\" onclick=\"doSomething()\">\u30DC\u30BF\u30F3</button>\n<button type=\"button\" onclick=\"action()\">\u30A2\u30AF\u30B7\u30E7\u30F3</button>\n\n\u6B63\u3057\u3044\u4F7F\u3044\u5206\u3051:\n\u2022 \u30DA\u30FC\u30B8\u79FB\u52D5\u30FB\u5916\u90E8\u30EA\u30F3\u30AF \u2192 <a href=\"url\">\u30EA\u30F3\u30AF</a>\n\u2022 JavaScript\u5B9F\u884C\u30FB\u30D5\u30A9\u30FC\u30E0\u64CD\u4F5C \u2192 <button>\u30DC\u30BF\u30F3</button>\n\n\u5177\u4F53\u7684\u306A\u4FEE\u6B63\u4F8B:\n\u274C <a href=\"#\" onclick=\"toggleMenu()\">\u30E1\u30CB\u30E5\u30FC</a>\n\u2705 <button type=\"button\" onclick=\"toggleMenu()\">\u30E1\u30CB\u30E5\u30FC</button>\n\n\u274C <a href=\"javascript:void(0)\" onclick=\"submitForm()\">\u9001\u4FE1</a>\n\u2705 <button type=\"submit\" onclick=\"submitForm()\">\u9001\u4FE1</button>\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 \u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u3067\u30EA\u30F3\u30AF\u3068\u30DC\u30BF\u30F3\u306F\u7570\u306A\u308B\u8AAD\u307F\u4E0A\u3052\n\u2022 \u30AD\u30FC\u30DC\u30FC\u30C9\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u3067\u306E\u6319\u52D5\u304C\u9055\u3046\n\u2022 \u30BB\u30DE\u30F3\u30C6\u30A3\u30C3\u30AFHTML\u306E\u89B3\u70B9\u304B\u3089\u9069\u5207\u306A\u8981\u7D20\u3092\u4F7F\u7528\n\u2022 \u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u3068\u30E6\u30FC\u30B6\u30D3\u30EA\u30C6\u30A3\u306E\u5411\u4E0A\n\nSEO\u30FB\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u3078\u306E\u5F71\u97FF:\n\u2022 \u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u304C\u30DA\u30FC\u30B8\u69CB\u9020\u3092\u6B63\u3057\u304F\u7406\u89E3\n\u2022 \u652F\u63F4\u6280\u8853\u3067\u306E\u9069\u5207\u306A\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\n\u2022 \u30E6\u30FC\u30B6\u30FC\u30A8\u30AF\u30B9\u30DA\u30EA\u30A8\u30F3\u30B9\u306E\u5411\u4E0A";
}

/**
 * ARIA展開状態の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAriaExpandedSolution() {
  return "ARIA\u5C55\u958B\u72B6\u614B\u306E\u8A2D\u5B9A\u65B9\u6CD5:\n\n\u57FA\u672C\u7684\u306A\u8A2D\u5B9A:\n<button aria-expanded=\"false\" aria-controls=\"menu\">\u30E1\u30CB\u30E5\u30FC</button>\n<ul id=\"menu\" style=\"display: none;\">...</ul>\n\n\u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3\u30E1\u30CB\u30E5\u30FC\u306E\u4F8B:\n<button aria-expanded=\"false\" onclick=\"toggleMenu()\">\n  \u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3\n</button>\n\n\u30A2\u30B3\u30FC\u30C7\u30A3\u30AA\u30F3\u306E\u4F8B:\n<button aria-expanded=\"false\" aria-controls=\"content1\">\n  \u30BB\u30AF\u30B7\u30E7\u30F31\n</button>\n<div id=\"content1\" style=\"display: none;\">\u5185\u5BB9</div>\n\nJavaScript\u8A2D\u5B9A\u4F8B:\nfunction toggleMenu() {\n  const button = document.querySelector('[aria-controls=\"menu\"]');\n  const menu = document.getElementById('menu');\n  const isExpanded = button.getAttribute('aria-expanded') === 'true';\n  \n  button.setAttribute('aria-expanded', !isExpanded);\n  menu.style.display = isExpanded ? 'none' : 'block';\n}\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 true/false\u306E\u6587\u5B57\u5217\u3067\u8A2D\u5B9A\n\u2022 \u5C55\u958B\u30FB\u53CE\u7E2E\u6642\u306B\u52D5\u7684\u306B\u66F4\u65B0\n\u2022 aria-controls\u3068\u7D44\u307F\u5408\u308F\u305B\u3066\u4F7F\u7528\n\n\u274C \u60AA\u3044\u4F8B:\n<button onclick=\"toggleMenu()\">\u30E1\u30CB\u30E5\u30FC</button>  \u2190 aria-expanded \u306A\u3057\n\n\u2705 \u826F\u3044\u4F8B:\n<button aria-expanded=\"false\" aria-controls=\"menu\">\u30E1\u30CB\u30E5\u30FC</button>";
}

/**
 * ARIA現在位置の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAriaCurrentSolution() {
  return "ARIA\u73FE\u5728\u4F4D\u7F6E\u306E\u8A2D\u5B9A\u65B9\u6CD5:\n\n\u57FA\u672C\u7684\u306A\u8A2D\u5B9A:\n<nav>\n  <a href=\"/home\">\u30DB\u30FC\u30E0</a>\n  <a href=\"/about\" aria-current=\"page\">\u4F1A\u793E\u6982\u8981</a>\n  <a href=\"/contact\">\u304A\u554F\u3044\u5408\u308F\u305B</a>\n</nav>\n\n\u30D1\u30F3\u304F\u305A\u30EA\u30B9\u30C8\u306E\u4F8B:\n<nav aria-label=\"\u30D1\u30F3\u304F\u305A\u30EA\u30B9\u30C8\">\n  <a href=\"/\">\u30DB\u30FC\u30E0</a> &gt;\n  <a href=\"/category\">\u30AB\u30C6\u30B4\u30EA</a> &gt;\n  <span aria-current=\"page\">\u5546\u54C1\u8A73\u7D30</span>\n</nav>\n\n\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u306E\u4F8B:\n<nav aria-label=\"\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\">\n  <a href=\"?page=1\">1</a>\n  <span aria-current=\"page\">2</span>\n  <a href=\"?page=3\">3</a>\n</nav>\n\naria-current \u306E\u5024:\n\u2022 page: \u73FE\u5728\u306E\u30DA\u30FC\u30B8\n\u2022 step: \u591A\u6BB5\u968E\u30D7\u30ED\u30BB\u30B9\u306E\u73FE\u5728\u306E\u30B9\u30C6\u30C3\u30D7\n\u2022 location: \u73FE\u5728\u306E\u5834\u6240\n\u2022 date: \u73FE\u5728\u306E\u65E5\u4ED8\n\u2022 time: \u73FE\u5728\u306E\u6642\u523B\n\u2022 true: \u305D\u306E\u4ED6\u306E\u73FE\u5728\u9805\u76EE\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 \u73FE\u5728\u4F4D\u7F6E\u3092\u660E\u78BA\u306B\u793A\u3059\n\u2022 \u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u3067\u300C\u73FE\u5728\u306E\u30DA\u30FC\u30B8\u300D\u3068\u8AAD\u307F\u4E0A\u3052\n\u2022 CSS\u3067\u306E\u8996\u899A\u7684\u306A\u30B9\u30BF\u30A4\u30EA\u30F3\u30B0\u3068\u7D44\u307F\u5408\u308F\u305B\n\n\u274C \u60AA\u3044\u4F8B:\n<a href=\"/current\" class=\"active\">\u73FE\u5728\u306E\u30DA\u30FC\u30B8</a>  \u2190 aria-current \u306A\u3057\n\n\u2705 \u826F\u3044\u4F8B:\n<a href=\"/current\" class=\"active\" aria-current=\"page\">\u73FE\u5728\u306E\u30DA\u30FC\u30B8</a>";
}

/**
 * レイアウトテーブルの解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getLayoutTableSolution() {
  return "\u30EC\u30A4\u30A2\u30A6\u30C8\u76EE\u7684\u306Etable\u4F7F\u7528\u306E\u4FEE\u6B63\u65B9\u6CD5:\n\n\u274C \u73FE\u5728\uFF08\u30EC\u30A4\u30A2\u30A6\u30C8\u76EE\u7684\uFF09:\n<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n  <tr>\n    <td>\u5DE6\u30AB\u30E9\u30E0</td>\n    <td>\u53F3\u30AB\u30E9\u30E0</td>\n  </tr>\n</table>\n\n\u2705 \u4FEE\u6B63\u5F8C\uFF08CSS\u30EC\u30A4\u30A2\u30A6\u30C8\uFF09:\n<div class=\"layout-container\">\n  <div class=\"left-column\">\u5DE6\u30AB\u30E9\u30E0</div>\n  <div class=\"right-column\">\u53F3\u30AB\u30E9\u30E0</div>\n</div>\n\nCSS\u4F8B:\n.layout-container {\n  display: flex;\n  gap: 20px;\n}\n.left-column, .right-column {\n  flex: 1;\n}\n\n\u307E\u305F\u306FCSS Grid:\n.layout-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n}\n\n\u30C7\u30FC\u30BF\u30C6\u30FC\u30D6\u30EB\u306E\u6B63\u3057\u3044\u4F7F\u7528\u4F8B:\n<table>\n  <caption>\u58F2\u4E0A\u30C7\u30FC\u30BF</caption>\n  <thead>\n    <tr>\n      <th>\u6708</th>\n      <th>\u58F2\u4E0A</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>1\u6708</td>\n      <td>100\u4E07\u5186</td>\n    </tr>\n  </tbody>\n</table>\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 table\u306F\u8868\u5F62\u5F0F\u30C7\u30FC\u30BF\u306B\u306E\u307F\u4F7F\u7528\n\u2022 \u30EC\u30A4\u30A2\u30A6\u30C8\u306FCSS\uFF08flexbox, grid\uFF09\u3092\u4F7F\u7528\n\u2022 \u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u304C\u30C6\u30FC\u30D6\u30EB\u3068\u3057\u3066\u8AA4\u8A8D\u8B58\u3055\u308C\u308B\u554F\u984C\u3092\u89E3\u6C7A\n\n\u274C \u30EC\u30A4\u30A2\u30A6\u30C8\u7528table\n\u2705 CSS flexbox/grid + \u30BB\u30DE\u30F3\u30C6\u30A3\u30C3\u30AFHTML";
}

/**
 * レイアウト目的のテーブルをチェック
 * @returns {Array} テーブルに関する問題リスト
 */
function checkLayoutTables() {
  var issues = [];
  var tables = document.querySelectorAll('table');
  var layoutTables = Array.from(tables).filter(function (table) {
    var hasLayoutIndicators = table.hasAttribute('cellpadding') || table.hasAttribute('cellspacing') || table.hasAttribute('border') && table.getAttribute('border') === '0';
    var hasTableHeaders = table.querySelectorAll('th').length > 0;
    var hasCaption = table.querySelector('caption') !== null;
    var hasDataIndicators = hasTableHeaders || hasCaption;
    return hasLayoutIndicators && !hasDataIndicators;
  });
  if (layoutTables.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'layout_table_usage',
      name: 'レイアウト目的のtable使用',
      message: "".concat(layoutTables.length, "\u500B\u306E\u30C6\u30FC\u30D6\u30EB\u304C\u30EC\u30A4\u30A2\u30A6\u30C8\u76EE\u7684\u3067\u4F7F\u7528\u3055\u308C\u3066\u3044\u307E\u3059"),
      elements: layoutTables,
      solution: getLayoutTableSolution()
    });
  }
  return issues;
}

/**
 * alt属性の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAltAttributeSolution() {
  return "alt\u5C5E\u6027\u306E\u6B63\u3057\u3044\u8A2D\u5B9A\u65B9\u6CD5:\n\n\u57FA\u672C\u7684\u306A\u8A2D\u5B9A:\n<img src=\"image.jpg\" alt=\"\u753B\u50CF\u306E\u8AAC\u660E\">\n\n\u753B\u50CF\u306E\u7A2E\u985E\u5225\u306E\u4F8B:\n\u2022 \u5546\u54C1\u753B\u50CF: <img src=\"shoes.jpg\" alt=\"\u9ED2\u3044\u30E9\u30F3\u30CB\u30F3\u30B0\u30B7\u30E5\u30FC\u30BA\">\n\u2022 \u4EBA\u7269\u5199\u771F: <img src=\"person.jpg\" alt=\"\u30B9\u30FC\u30C4\u3092\u7740\u305F\u7537\u6027\u304C\u7B11\u9854\u3067\u7ACB\u3063\u3066\u3044\u308B\">\n\u2022 \u56F3\u8868\u30FB\u30B0\u30E9\u30D5: <img src=\"chart.jpg\" alt=\"2024\u5E74\u58F2\u4E0A\u63A8\u79FB\u30B0\u30E9\u30D5\u3001\u524D\u5E74\u6BD4120%\u5897\u52A0\">\n\u2022 \u30ED\u30B4: <img src=\"logo.jpg\" alt=\"ABC\u4F1A\u793E\u30ED\u30B4\">\n\u2022 \u88C5\u98FE\u753B\u50CF: <img src=\"decoration.jpg\" alt=\"\">\uFF08\u7A7A\u6587\u5B57\u3067OK\uFF09\n\n\u91CD\u8981\u306A\u30EB\u30FC\u30EB:\n\u2022 \u753B\u50CF\u304C\u898B\u3048\u306A\u3044\u72B6\u6CC1\u3067\u3082\u5185\u5BB9\u304C\u4F1D\u308F\u308B\u8AAC\u660E\n\u2022 \u5358\u306B\u300C\u753B\u50CF\u300D\u300C\u5199\u771F\u300D\u3068\u66F8\u304B\u306A\u3044\n\u2022 \u88C5\u98FE\u76EE\u7684\u306E\u5834\u5408\u306F alt=\"\" \u3092\u4F7F\u7528\n\u2022 \u9577\u3044\u8AAC\u660E\u304C\u5FC5\u8981\u306A\u5834\u5408\u306F\u5225\u9014\u8AAC\u660E\u6587\u3092\u7528\u610F\n\n\u274C \u60AA\u3044\u4F8B:\n<img src=\"product.jpg\" alt=\"\u753B\u50CF\">  \u2190 \u4F55\u306E\u753B\u50CF\u304B\u4E0D\u660E\n<img src=\"chart.jpg\" alt=\"\u30B0\u30E9\u30D5\">  \u2190 \u5185\u5BB9\u304C\u4E0D\u660E\n\n\u2705 \u826F\u3044\u4F8B:\n<img src=\"product.jpg\" alt=\"\u9752\u3044\u30C7\u30CB\u30E0\u30B8\u30E3\u30B1\u30C3\u30C8 M\u30B5\u30A4\u30BA\">\n<img src=\"chart.jpg\" alt=\"\u6708\u5225\u58F2\u4E0A\u30B0\u30E9\u30D5\uFF1A1\u6708100\u4E07\u5186\u304B\u308912\u6708500\u4E07\u5186\u307E\u3067\u53F3\u80A9\u4E0A\u304C\u308A\">";
}

/**
 * フォームラベルの解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getFormLabelSolution() {
  return "\u30D5\u30A9\u30FC\u30E0\u8981\u7D20\u306E\u30E9\u30D9\u30EB\u8A2D\u5B9A\u65B9\u6CD5:\n\n\u57FA\u672C\u7684\u306A\u8A2D\u5B9A:\n<label for=\"username\">\u30E6\u30FC\u30B6\u30FC\u540D</label>\n<input type=\"text\" id=\"username\" name=\"username\">\n\n\u4EE3\u66FF\u65B9\u6CD5:\n1. aria-label\u5C5E\u6027\u3092\u4F7F\u7528:\n<input type=\"email\" aria-label=\"\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\">\n\n2. aria-labelledby\u5C5E\u6027\u3092\u4F7F\u7528:\n<h3 id=\"billing\">\u8ACB\u6C42\u5148\u60C5\u5831</h3>\n<input type=\"text\" aria-labelledby=\"billing\">\n\n3. placeholder + title \u306E\u7D44\u307F\u5408\u308F\u305B:\n<input type=\"text\" placeholder=\"\u4F8B: yamada@example.com\" title=\"\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\">\n\n\u91CD\u8981\u306A\u30DD\u30A4\u30F3\u30C8:\n\u2022 \u5168\u3066\u306E\u30D5\u30A9\u30FC\u30E0\u8981\u7D20\u306B\u9069\u5207\u306A\u30E9\u30D9\u30EB\u304C\u5FC5\u8981\n\u2022 \u30E9\u30D9\u30EB\u306F\u30D5\u30A9\u30FC\u30E0\u8981\u7D20\u306E\u76EE\u7684\u3092\u660E\u78BA\u306B\u793A\u3059\n\u2022 placeholder\u3060\u3051\u3067\u306F\u4E0D\u5341\u5206\uFF08\u6D88\u3048\u3066\u3057\u307E\u3046\u305F\u3081\uFF09\n\n\u274C \u60AA\u3044\u4F8B:\n<input type=\"text\">  \u2190 \u30E9\u30D9\u30EB\u304C\u5168\u304F\u306A\u3044\n<input type=\"email\" placeholder=\"\u30E1\u30FC\u30EB\">  \u2190 placeholder\u306E\u307F\n\n\u2705 \u826F\u3044\u4F8B:\n<label for=\"email\">\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9</label>\n<input type=\"email\" id=\"email\" placeholder=\"\u4F8B: user@example.com\">";
}
;// ./src/content-script/analysis/semantic.js
function semantic_toConsumableArray(r) { return semantic_arrayWithoutHoles(r) || semantic_iterableToArray(r) || semantic_unsupportedIterableToArray(r) || semantic_nonIterableSpread(); }
function semantic_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function semantic_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return semantic_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? semantic_arrayLikeToArray(r, a) : void 0; } }
function semantic_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function semantic_arrayWithoutHoles(r) { if (Array.isArray(r)) return semantic_arrayLikeToArray(r); }
function semantic_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * セマンティックHTML分析モジュール
 */




/**
 * セマンティック関連の問題を検出
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
function detectSemanticIssues() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];

  // 日付情報のDIVタグ使用チェック
  var dateIssues = checkDateInformation(targetElements);
  issues.push.apply(issues, semantic_toConsumableArray(dateIssues));
  return issues;
}

/**
 * DIVタグで日付情報を表現している箇所をチェック
 * @returns {Array} 日付情報に関する問題リスト
 */
function checkDateInformation() {
  var issues = [];
  var divElements = document.querySelectorAll('div');
  var problematicElements = [];

  // 日付パターン（元の実装から復元）
  var datePatterns = [/\b\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\b/,
  // 2023-01-15, 2023/01/15
  /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{4}\b/,
  // 15-01-2023, 15/01/2023
  /\b\d{4}年\d{1,2}月\d{1,2}日\b/,
  // 2023年1月15日
  /\b\d{1,2}月\d{1,2}日\b/,
  // 1月15日
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/i,
  // Jan 15, 2023
  /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/i // 15 Jan 2023
  ];
  Array.from(divElements).forEach(function (div) {
    var text = div.textContent.trim();

    // 日付パターンに一致し、すでにtimeタグで囲まれていない場合
    if (datePatterns.some(function (pattern) {
      return pattern.test(text);
    })) {
      // timeタグが子要素にないかチェック
      var hasTimeTag = div.querySelector('time') !== null;
      // divの親がすでにtimeタグでないかチェック
      var isInTimeTag = div.closest('time') !== null;
      if (!hasTimeTag && !isInTimeTag && text.length < 100) {
        // 長すぎるテキストは除外
        debug_debugLog('Checker', "Date pattern found in div: ".concat(text.substring(0, 50)));
        problematicElements.push(div);
      }
    }
  });
  if (problematicElements.length > 0) {
    issues.push({
      category: 'structure',
      severity: SEVERITY.WARNING,
      rule: 'date_in_div',
      name: 'DIVタグでの日付情報表現',
      message: "".concat(problematicElements.length, "\u500B\u306EDIV\u30BF\u30B0\u3067\u65E5\u4ED8\u60C5\u5831\u304C\u8868\u73FE\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u610F\u5473\u7684\u306B\u3088\u308A\u9069\u5207\u306A<time>\u30BF\u30B0\u306E\u4F7F\u7528\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: problematicElements,
      solution: getDateInformationSolution()
    });
  }
  return issues;
}

/**
 * 日付情報の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getDateInformationSolution() {
  return "\u65E5\u4ED8\u60C5\u5831\u306E\u9069\u5207\u306A\u8868\u73FE\u65B9\u6CD5:\n\n\uD83D\uDEA8 \u554F\u984C: <div>2023\u5E741\u670815\u65E5</div>\n\uD83D\uDD27 \u4FEE\u6B63: <time datetime=\"2023-01-15\">2023\u5E741\u670815\u65E5</time>\n\n\u2705 \u6B63\u3057\u3044\u4F7F\u7528\u4F8B:\n\u2022 <time datetime=\"2023-01-15\">2023\u5E741\u670815\u65E5</time>\n\u2022 <time datetime=\"2023-01-15T10:30:00\">2023\u5E741\u670815\u65E5 10:30</time>\n\u2022 <time datetime=\"2023-01\">2023\u5E741\u6708</time>\n\n\uD83D\uDCD6 \u5F71\u97FF: \n\u2022 \u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u304C\u65E5\u4ED8\u60C5\u5831\u3092\u6B63\u3057\u304F\u8A8D\u8B58\n\u2022 \u30B9\u30AF\u30EA\u30FC\u30F3\u30EA\u30FC\u30C0\u30FC\u3067\u65E5\u4ED8\u3068\u3057\u3066\u9069\u5207\u306B\u8AAD\u307F\u4E0A\u3052\n\u2022 \u69CB\u9020\u5316\u30C7\u30FC\u30BF\u3068\u3057\u3066\u3088\u308A\u610F\u5473\u7684\u306B\u6B63\u78BA";
}
;// ./src/content-script/analysis/cleanup.js
function cleanup_toConsumableArray(r) { return cleanup_arrayWithoutHoles(r) || cleanup_iterableToArray(r) || cleanup_unsupportedIterableToArray(r) || cleanup_nonIterableSpread(); }
function cleanup_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function cleanup_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return cleanup_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? cleanup_arrayLikeToArray(r, a) : void 0; } }
function cleanup_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function cleanup_arrayWithoutHoles(r) { if (Array.isArray(r)) return cleanup_arrayLikeToArray(r); }
function cleanup_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * コードクリーンアップ分析モジュール
 */




/**
 * クリーンアップ関連の問題を検出
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 検出された問題のリスト
 */
function detectCleanupIssues() {
  var targetElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var issues = [];

  // 古いGoogle Analytics検知
  var gaIssues = checkLegacyGoogleAnalytics(targetElements);
  issues.push.apply(issues, cleanup_toConsumableArray(gaIssues));

  // 古いGTMコンテナ検知
  var gtmIssues = checkLegacyGTMContainer(targetElements);
  issues.push.apply(issues, cleanup_toConsumableArray(gtmIssues));

  // Adobe Analytics検知
  var adobeIssues = checkAdobeAnalytics(targetElements);
  issues.push.apply(issues, cleanup_toConsumableArray(adobeIssues));

  // 不要なnoscriptタグ検知
  var noscriptIssues = checkUnnecessaryNoScript(targetElements);
  issues.push.apply(issues, cleanup_toConsumableArray(noscriptIssues));

  // 古いROBOTSメタタグ検知
  var robotsIssues = checkOldRobotsMetaTags();
  issues.push.apply(issues, cleanup_toConsumableArray(robotsIssues));

  // 廃止されたmetaタグ検知
  var deprecatedMetaIssues = checkDeprecatedMetaTags();
  issues.push.apply(issues, cleanup_toConsumableArray(deprecatedMetaIssues));
  return issues;
}

/**
 * 古いGoogle Analyticsコードをチェック
 * @returns {Array} 古いGA関連の問題リスト
 */
function checkLegacyGoogleAnalytics() {
  var issues = [];
  var scripts = document.querySelectorAll('script');
  var problematicScripts = [];
  Array.from(scripts).forEach(function (script) {
    var content = script.textContent || script.innerHTML || '';
    var src = script.src || '';

    // UAパターンまたは古いGA JSファイルをチェック
    var hasLegacyPattern = LEGACY_GA_PATTERNS.some(function (pattern) {
      return pattern.test(content) || pattern.test(src);
    });
    if (hasLegacyPattern) {
      debug_debugLog('Checker', 'Legacy GA code detected:', content.substring(0, 100));
      problematicScripts.push(script);
    }
  });
  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.WARNING,
      rule: 'legacy_google_analytics',
      name: '古いGoogle Analyticsコード',
      message: "".concat(problematicScripts.length, "\u500B\u306E\u53E4\u3044Google Analytics\uFF08UA-\uFF09\u30B3\u30FC\u30C9\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002Google Analytics 4\uFF08GA4\uFF09\u3078\u306E\u79FB\u884C\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: problematicScripts,
      solution: getLegacyGASolution()
    });
  }
  return issues;
}

/**
 * 古いGTMコンテナをチェック
 * @returns {Array} 古いGTM関連の問題リスト
 */
function checkLegacyGTMContainer() {
  var issues = [];
  var scripts = document.querySelectorAll('script');
  var problematicScripts = [];

  // 特定の古いGTMコンテナIDをチェック（元の実装から）
  var legacyGTMPattern = /GTM-[A-Z0-9]{6,7}/g;
  Array.from(scripts).forEach(function (script) {
    var content = script.textContent || script.innerHTML || '';
    var src = script.src || '';
    if (legacyGTMPattern.test(content) || legacyGTMPattern.test(src)) {
      // ここで特定の古いコンテナIDかどうかを判定
      var matches = (content + src).match(legacyGTMPattern);
      if (matches) {
        debug_debugLog('Checker', 'GTM container detected:', matches);
        problematicScripts.push(script);
      }
    }
  });
  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'legacy_gtm_container',
      name: '古いGTMコンテナの可能性',
      message: "".concat(problematicScripts.length, "\u500B\u306EGoogle Tag Manager\u30B3\u30F3\u30C6\u30CA\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002\u4F7F\u7528\u3057\u3066\u3044\u306A\u3044\u53E4\u3044\u30B3\u30F3\u30C6\u30CA\u304C\u306A\u3044\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: problematicScripts,
      solution: getLegacyGTMSolution()
    });
  }
  return issues;
}

/**
 * Adobe Analyticsコードをチェック
 * @returns {Array} Adobe Analytics関連の問題リスト
 */
function checkAdobeAnalytics() {
  var issues = [];
  var scripts = document.querySelectorAll('script');
  var problematicScripts = [];
  Array.from(scripts).forEach(function (script) {
    var content = script.textContent || script.innerHTML || '';
    var src = script.src || '';
    var hasAdobePattern = ADOBE_PATTERNS.some(function (pattern) {
      return pattern.test(content) || pattern.test(src);
    });
    if (hasAdobePattern) {
      debug_debugLog('Checker', 'Adobe Analytics code detected:', content.substring(0, 100));
      problematicScripts.push(script);
    }
  });
  if (problematicScripts.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'adobe_analytics_code',
      name: 'Adobe Analyticsコード',
      message: "".concat(problematicScripts.length, "\u500B\u306EAdobe Analytics/Omniture\u30B3\u30FC\u30C9\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002\u4F7F\u7528\u3057\u3066\u3044\u306A\u3044\u5834\u5408\u306F\u524A\u9664\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
      elements: problematicScripts,
      solution: getAdobeAnalyticsSolution()
    });
  }
  return issues;
}

/**
 * 不要なnoscriptタグをチェック
 * @returns {Array} noscript関連の問題リスト
 */
function checkUnnecessaryNoScript() {
  var issues = [];
  var noscriptTags = document.querySelectorAll('noscript');
  var problematicTags = [];
  Array.from(noscriptTags).forEach(function (noscript) {
    var content = noscript.innerHTML.trim();

    // 空または<!-- -->コメントのみの場合
    var isEmpty = content === '' || /^<!--.*-->$/.test(content.replace(/\s/g, ''));
    if (isEmpty) {
      debug_debugLog('Checker', 'Empty noscript tag detected');
      problematicTags.push(noscript);
    }
  });
  if (problematicTags.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'unnecessary_noscript',
      name: '不要なnoscriptタグ',
      message: "".concat(problematicTags.length, "\u500B\u306E\u7A7A\u307E\u305F\u306F\u4E0D\u8981\u306Anoscript\u30BF\u30B0\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002"),
      elements: problematicTags,
      solution: getUnnecessaryNoScriptSolution()
    });
  }
  return issues;
}

/**
 * 古いROBOTSメタタグをチェック
 * @returns {Array} ROBOTS関連の問題リスト
 */
function checkOldRobotsMetaTags() {
  var issues = [];
  var metaTags = document.querySelectorAll('meta[name="robots"]');
  var problematicTags = [];
  Array.from(metaTags).forEach(function (meta) {
    var content = meta.getAttribute('content') || '';

    // 古いROBOTSディレクティブをチェック
    var hasOldDirectives = /\b(NOODP|NOYDIR|NOARCHIVE)\b/i.test(content);
    if (hasOldDirectives) {
      debug_debugLog('Checker', 'Old ROBOTS directive detected:', content);
      problematicTags.push(meta);
    }
  });
  if (problematicTags.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.WARNING,
      rule: 'old_robots_meta',
      name: '古いROBOTSメタタグ',
      message: "".concat(problematicTags.length, "\u500B\u306E\u53E4\u3044ROBOTS\u30C7\u30A3\u30EC\u30AF\u30C6\u30A3\u30D6\uFF08NOODP\u3001NOYDIR\u3001NOARCHIVE\uFF09\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002\u3053\u308C\u3089\u306F\u73FE\u5728\u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002"),
      elements: problematicTags,
      solution: getOldRobotsMetaSolution()
    });
  }
  return issues;
}

/**
 * 廃止されたmetaタグをチェック
 * @returns {Array} 廃止されたmeta関連の問題リスト
 */
function checkDeprecatedMetaTags() {
  var issues = [];
  var keywordsMeta = document.querySelectorAll('meta[name="keywords"]');
  if (keywordsMeta.length > 0) {
    issues.push({
      category: 'cleanup',
      severity: SEVERITY.INFO,
      rule: 'deprecated_meta_keywords',
      name: '廃止されたmeta keywordsタグ',
      message: "".concat(keywordsMeta.length, "\u500B\u306Emeta keywords\u30BF\u30B0\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002\u73FE\u5728\u306ESEO\u3067\u306F\u52B9\u679C\u304C\u306A\u304F\u3001\u524A\u9664\u3092\u63A8\u5968\u3057\u307E\u3059\u3002"),
      elements: Array.from(keywordsMeta),
      solution: getDeprecatedMetaSolution()
    });
  }
  return issues;
}

/**
 * 古いGA解決策テキスト
 */
function getLegacyGASolution() {
  return "\u53E4\u3044Google Analytics\u30B3\u30FC\u30C9\u306E\u5BFE\u5FDC:\n\n\uD83D\uDEA8 \u554F\u984C: UA-xxxxxxx-x\u5F62\u5F0F\u306E\u53E4\u3044\u30C8\u30E9\u30C3\u30AD\u30F3\u30B0\u30B3\u30FC\u30C9\n\uD83D\uDD27 \u4FEE\u6B63: Google Analytics 4\uFF08GA4\uFF09\u3078\u306E\u79FB\u884C\n\n\u2705 GA4\u79FB\u884C\u624B\u9806:\n1. GA4\u30D7\u30ED\u30D1\u30C6\u30A3\u306E\u4F5C\u6210\n2. gtag.js\u307E\u305F\u306FGTM\u3067\u306E\u65B0\u3057\u3044\u30C8\u30E9\u30C3\u30AD\u30F3\u30B0\u8A2D\u5B9A\n3. \u53E4\u3044analytics.js\u30B3\u30FC\u30C9\u306E\u524A\u9664\n\n\uD83D\uDCD6 \u5F71\u97FF: 2023\u5E747\u6708\u4EE5\u964D\u3001UA\u30D7\u30ED\u30D1\u30C6\u30A3\u306F\u52D5\u4F5C\u505C\u6B62";
}

/**
 * 古いGTM解決策テキスト
 */
function getLegacyGTMSolution() {
  return "GTM\u30B3\u30F3\u30C6\u30CA\u306E\u78BA\u8A8D:\n\n\u2705 \u78BA\u8A8D\u9805\u76EE:\n\u2022 \u4F7F\u7528\u4E2D\u306E\u30B3\u30F3\u30C6\u30CA\u304B\u3069\u3046\u304B\n\u2022 \u8907\u6570\u30B3\u30F3\u30C6\u30CA\u306E\u5FC5\u8981\u6027\n\u2022 \u53E4\u3044\u5B9F\u88C5\u306E\u524A\u9664\n\n\uD83D\uDD27 \u63A8\u5968\u5BFE\u5FDC:\n\u2022 \u4E0D\u8981\u306A\u30B3\u30F3\u30C6\u30CA\u30B3\u30FC\u30C9\u306E\u524A\u9664\n\u2022 GTM\u3067\u306E\u4E00\u5143\u7BA1\u7406";
}

/**
 * Adobe Analytics解決策テキスト
 */
function getAdobeAnalyticsSolution() {
  return "Adobe Analytics\u30B3\u30FC\u30C9\u306E\u78BA\u8A8D:\n\n\u2705 \u78BA\u8A8D\u9805\u76EE:\n\u2022 \u73FE\u5728\u3082\u4F7F\u7528\u3057\u3066\u3044\u308B\u304B\n\u2022 \u4ED6\u306E\u89E3\u6790\u30C4\u30FC\u30EB\u3068\u306E\u91CD\u8907\n\n\uD83D\uDD27 \u63A8\u5968\u5BFE\u5FDC:\n\u2022 \u4E0D\u8981\u306A\u5834\u5408\u306F\u524A\u9664\n\u2022 \u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u5411\u4E0A\u306E\u305F\u3081\u6700\u9069\u5316";
}

/**
 * 不要なnoscript解決策テキスト
 */
function getUnnecessaryNoScriptSolution() {
  return "\u4E0D\u8981\u306Anoscript\u30BF\u30B0\u306E\u5BFE\u5FDC:\n\n\uD83D\uDEA8 \u554F\u984C: \u7A7A\u307E\u305F\u306F\u610F\u5473\u306E\u306A\u3044noscript\u30BF\u30B0\n\uD83D\uDD27 \u4FEE\u6B63: \u4E0D\u8981\u306A\u30BF\u30B0\u306E\u524A\u9664\n\n\u2705 \u9069\u5207\u306A\u4F7F\u7528:\n\u2022 JavaScript\u304C\u7121\u52B9\u306A\u5834\u5408\u306E\u4EE3\u66FF\u30B3\u30F3\u30C6\u30F3\u30C4\u306E\u307F\n\u2022 \u7A7A\u306E\u30BF\u30B0\u306F\u524A\u9664";
}

/**
 * 古いROBOTSメタ解決策テキスト
 */
function getOldRobotsMetaSolution() {
  return "\u53E4\u3044ROBOTS\u30C7\u30A3\u30EC\u30AF\u30C6\u30A3\u30D6\u306E\u5BFE\u5FDC:\n\n\uD83D\uDEA8 \u554F\u984C: NOODP\u3001NOYDIR\u3001NOARCHIVE\u30C7\u30A3\u30EC\u30AF\u30C6\u30A3\u30D6\n\uD83D\uDD27 \u4FEE\u6B63: \u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u308B\u30C7\u30A3\u30EC\u30AF\u30C6\u30A3\u30D6\u306B\u5909\u66F4\n\n\u2705 \u73FE\u5728\u6709\u52B9\u306A\u30C7\u30A3\u30EC\u30AF\u30C6\u30A3\u30D6:\n\u2022 index/noindex\n\u2022 follow/nofollow\n\u2022 nosnippet\n\u2022 noarchive\uFF08Google\u3067\u30B5\u30DD\u30FC\u30C8\u7D99\u7D9A\uFF09";
}

/**
 * 廃止されたmeta解決策テキスト
 */
function getDeprecatedMetaSolution() {
  return "meta keywords\u30BF\u30B0\u306E\u5BFE\u5FDC:\n\n\uD83D\uDEA8 \u554F\u984C: <meta name=\"keywords\" content=\"...\">\n\uD83D\uDD27 \u4FEE\u6B63: \u30BF\u30B0\u306E\u524A\u9664\n\n\uD83D\uDCD6 \u7406\u7531:\n\u2022 \u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u306Fkeywords\u30E1\u30BF\u30BF\u30B0\u3092\u7121\u8996\n\u2022 \u30B9\u30D1\u30E0\u306E\u6E29\u5E8A\u3068\u306A\u3063\u305F\u305F\u3081\u5EC3\u6B62\n\u2022 \u73FE\u5728\u306F\u30B3\u30F3\u30C6\u30F3\u30C4\u306E\u8CEA\u304C\u91CD\u8981";
}
;// ./src/content-script/engine/main-engine.js
function main_engine_toConsumableArray(r) { return main_engine_arrayWithoutHoles(r) || main_engine_iterableToArray(r) || main_engine_unsupportedIterableToArray(r) || main_engine_nonIterableSpread(); }
function main_engine_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function main_engine_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return main_engine_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? main_engine_arrayLikeToArray(r, a) : void 0; } }
function main_engine_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function main_engine_arrayWithoutHoles(r) { if (Array.isArray(r)) return main_engine_arrayLikeToArray(r); }
function main_engine_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * メイン分析エンジン
 * 各分析モジュールを統合し、全体的な分析を実行
 */








// Removed non-original modules: seo.js and structure.js

/**
 * 完全なページ分析を実行
 * @returns {Object} 分析結果
 */
function main_engine_performFullCheck() {
  debug_debugLog('Engine', 'Starting full semantic analysis...');
  try {
    // Phase 1: 要素の事前プリプロセス（一度だけ実行）
    var targetElements = getAnalysisTargetElements();
    var results = {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      // 基本統計（プリプロセス済み要素から生成）
      statistics: generateBasicStatistics(targetElements),
      // セマンティック要素分析
      semantic: analyzeSemanticElements(targetElements),
      // 各分析モジュールの結果（プリプロセス済み要素を使用）
      headingStructure: analyzeHeadingStructure(targetElements),
      accessibility: analyzeAccessibility(targetElements),
      // パフォーマンス指標
      performance: analyzePerformance(),
      // 詳細な問題検出（プリプロセス済み要素を使用）
      issues: detectAllIssues(targetElements)
    };
    debug_debugLog('Engine', 'Full analysis completed:', results);
    return results;
  } catch (error) {
    errorLog('Engine', 'Error during analysis:', error);
    throw error;
  }
}

/**
 * 基本統計を生成（プリプロセス済み要素から）
 * @param {Object} targetElements - プリプロセス済み要素
 * @returns {Object} 基本統計データ
 */
function generateBasicStatistics(targetElements) {
  var allDocumentElements = document.querySelectorAll('*').length;
  var processedElements = targetElements.headings.all.length + targetElements.accessibility.images.length + targetElements.accessibility.links.length;
  return {
    totalElements: allDocumentElements,
    processedElements: processedElements,
    headings: targetElements.headings.all.length,
    images: targetElements.accessibility.images.length,
    links: targetElements.accessibility.links.length,
    forms: targetElements.accessibility.formElements.length,
    tables: targetElements.accessibility.tables.length
  };
}

/**
 * セマンティック要素を分析（プリプロセス済み要素から）
 * @param {Object} targetElements - プリプロセス済み要素
 * @returns {Object} セマンティック要素の使用状況
 */
function analyzeSemanticElements(targetElements) {
  // セマンティック要素は現在プリプロセスで収集していないため、
  // 従来通りDOMスキャンを行うが、除外要素チェックは省略（後で最適化可能）
  return {
    header: document.querySelectorAll('header').length,
    nav: document.querySelectorAll('nav').length,
    main: document.querySelectorAll('main').length,
    article: document.querySelectorAll('article').length,
    section: document.querySelectorAll('section').length,
    aside: document.querySelectorAll('aside').length,
    footer: document.querySelectorAll('footer').length,
    timeElements: targetElements.semantic.timeElements.length,
    dateElements: targetElements.semantic.dateElements.length
  };
}

/**
 * パフォーマンス指標を分析
 * @returns {Object} パフォーマンス関連データ
 */
function analyzePerformance() {
  var performanceData = {
    // DOM要素数
    domElementCount: document.querySelectorAll('*').length,
    // スクリプトタグ数
    scriptTags: document.querySelectorAll('script').length,
    // 外部CSSファイル数
    externalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
    // インラインスタイル数
    inlineStyles: document.querySelectorAll('[style]').length,
    // 画像数
    imageCount: document.querySelectorAll('img').length,
    // iframe数
    iframeCount: document.querySelectorAll('iframe').length
  };

  // パフォーマンススコアの計算
  performanceData.performanceScore = calculatePerformanceScore(performanceData);
  return performanceData;
}

/**
 * パフォーマンススコアを計算
 * @param {Object} data - パフォーマンスデータ
 * @returns {number} 0-100のスコア
 */
function calculatePerformanceScore(data) {
  var score = 100;

  // DOM要素数によるペナルティ
  if (data.domElementCount > 1500) {
    score -= Math.min((data.domElementCount - 1500) / 50, 20);
  }

  // スクリプトタグ数によるペナルティ
  if (data.scriptTags > 10) {
    score -= Math.min((data.scriptTags - 10) * 2, 15);
  }

  // インラインスタイル数によるペナルティ
  if (data.inlineStyles > 20) {
    score -= Math.min((data.inlineStyles - 20) * 0.5, 10);
  }

  // iframe数によるペナルティ
  if (data.iframeCount > 3) {
    score -= Math.min((data.iframeCount - 3) * 5, 15);
  }
  return Math.max(0, Math.round(score));
}

/**
 * 全ての問題を検出（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素
 * @returns {Array} 検出された全問題のリスト
 */
function detectAllIssues(targetElements) {
  var allIssues = [];
  try {
    // 各分析モジュールから問題を検出（プリプロセス済み要素を渡す）
    var headingIssues = detectHeadingIssues(targetElements);
    var accessibilityIssues = detectAccessibilityIssues(targetElements);
    var semanticIssues = detectSemanticIssues(targetElements);
    var cleanupIssues = detectCleanupIssues(targetElements);

    // 全問題をマージ
    allIssues.push.apply(allIssues, main_engine_toConsumableArray(headingIssues));
    allIssues.push.apply(allIssues, main_engine_toConsumableArray(accessibilityIssues));
    allIssues.push.apply(allIssues, main_engine_toConsumableArray(semanticIssues));
    allIssues.push.apply(allIssues, main_engine_toConsumableArray(cleanupIssues));
    debug_debugLog('Engine', "Total issues detected: ".concat(allIssues.length));

    // 重要度順にソート
    allIssues.sort(function (a, b) {
      var severityOrder = {
        'error': 3,
        'warning': 2,
        'info': 1
      };
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    });
  } catch (error) {
    errorLog('Engine', 'Error detecting issues:', error);
  }
  return allIssues;
}

/**
 * 問題カテゴリ別の統計を生成
 * @param {Array} issues - 問題リスト
 * @returns {Object} カテゴリ別統計
 */
function generateIssueSummary(issues) {
  var summary = {
    total: issues.length,
    byCategory: {},
    bySeverity: {
      error: 0,
      warning: 0,
      info: 0
    }
  };
  issues.forEach(function (issue) {
    // カテゴリ別カウント
    if (!summary.byCategory[issue.category]) {
      summary.byCategory[issue.category] = 0;
    }
    summary.byCategory[issue.category]++;

    // 重要度別カウント
    if (summary.bySeverity[issue.severity] !== undefined) {
      summary.bySeverity[issue.severity]++;
    }
  });
  return summary;
}

/**
 * 全体的な品質スコアを計算
 * @param {Object} results - 分析結果
 * @returns {number} 0-100の品質スコア
 */
function calculateOverallScore(results) {
  var score = 100;

  // 問題の重要度に基づくペナルティ
  results.issues.forEach(function (issue) {
    switch (issue.severity) {
      case 'error':
        score -= 10;
        break;
      case 'warning':
        score -= 5;
        break;
      case 'info':
        score -= 2;
        break;
    }
  });

  // セマンティック要素の使用でボーナス
  var semanticElements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  semanticElements.forEach(function (element) {
    if (results.semantic[element] > 0) {
      score += 2;
    }
  });

  // パフォーマンススコアを加味
  score = (score + results.performance.performanceScore) / 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}
;// ./src/content-script/ui/highlight.js
/**
 * 要素ハイライト管理モジュール
 */



// ハイライト状態の管理
var highlightedElements = [];
var selectedElement = null;
var selectedElementMarker = null;

// ハイライトスタイルのID
var HIGHLIGHT_STYLE_ID = 'html-semantic-checker-highlight-styles';

/**
 * ハイライト機能の初期化
 */
function initializeHighlight() {
  if (!document.getElementById(HIGHLIGHT_STYLE_ID)) {
    addHighlightStyles();
  }

  // メッセージリスナーを追加
  window.addEventListener('message', handleHighlightMessage);
  debug_debugLog('Highlight', 'Highlight system initialized');
}

/**
 * ハイライト用のスタイルを追加
 */
function addHighlightStyles() {
  var styleElement = document.createElement('style');
  styleElement.id = HIGHLIGHT_STYLE_ID;
  styleElement.textContent = "\n    .hsc-highlighted-element {\n      outline: 3px solid #dc3545 !important;\n      outline-offset: 2px !important;\n      position: relative !important;\n      z-index: 999998 !important;\n      /* H1\u8981\u7D20\u306E\u80CC\u666F\u3092\u5F37\u8ABF\uFF08\u753B\u50CF\u306E\u307F\u306E\u5834\u5408\u3067\u3082\u898B\u3048\u308B\u3088\u3046\u306B\uFF09 */\n      background: rgba(220, 53, 69, 0.1) !important;\n      /* \u30DC\u30FC\u30C0\u30FC\u3082\u8FFD\u52A0\u3067\u78BA\u5B9F\u306B\u898B\u3048\u308B\u3088\u3046\u306B\u3059\u308B */\n      border: 2px solid #dc3545 !important;\n      box-shadow: 0 0 0 1px rgba(220, 53, 69, 0.3) !important;\n    }\n    \n    .hsc-selected-element {\n      outline: 3px solid #28a745 !important;\n      outline-offset: 2px !important;\n      position: relative !important;\n      z-index: 999999 !important;\n      background-color: rgba(40, 167, 69, 0.1) !important;\n    }\n    \n    .hsc-element-marker {\n      position: absolute !important;\n      background: #28a745 !important;\n      color: white !important;\n      padding: 4px 8px !important;\n      font-size: 12px !important;\n      font-weight: bold !important;\n      border-radius: 4px !important;\n      z-index: 1000000 !important;\n      pointer-events: none !important;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n      line-height: 1 !important;\n      white-space: nowrap !important;\n      top: -25px !important;\n      left: 0 !important;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;\n    }\n    \n    .hsc-element-marker::after {\n      content: '';\n      position: absolute;\n      top: 100%;\n      left: 8px;\n      border: 4px solid transparent;\n      border-top-color: #28a745;\n    }\n    \n  ";
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
function highlightAllIssueElements(results) {
  clearAllHighlights();
  var allElements = new Set();

  // 全ての問題から要素を収集
  results.issues.forEach(function (issue) {
    if (issue.elements && Array.isArray(issue.elements)) {
      issue.elements.forEach(function (element) {
        if (element && element.nodeType === 1) {
          // Element node
          allElements.add(element);
        }
      });
    }
  });

  // 要素をハイライト
  allElements.forEach(function (element) {
    element.classList.add('hsc-highlighted-element');
    highlightedElements.push(element);
  });
  debug_debugLog('Highlight', "Highlighted ".concat(allElements.size, " issue elements"));
}

/**
 * 特定の要素群をハイライト
 * @param {Array} elements - ハイライトする要素の配列
 */
function highlightElements(elements) {
  // 既存のハイライトをクリアしない（持続性を保つ）

  if (!Array.isArray(elements)) return;
  elements.forEach(function (element) {
    if (element && element.nodeType === 1) {
      // 既にハイライトされていない場合のみ追加
      if (!element.classList.contains('hsc-highlighted-element')) {
        element.classList.add('hsc-highlighted-element');
        highlightedElements.push(element);
      }
    }
  });
  debug_debugLog('Highlight', "Highlighted ".concat(elements.length, " elements"));
}

/**
 * 要素を選択状態にする
 * @param {Element} element - 選択する要素
 */
function selectElement(element) {
  debug_debugLog('Highlight', 'selectElement called with:', element);
  if (!element) {
    debug_debugLog('Highlight', 'No element provided');
    return;
  }
  if (element.nodeType !== 1) {
    debug_debugLog('Highlight', 'Element is not an Element node:', element.nodeType);
    return;
  }
  clearSelectedElementHighlight();
  selectedElement = element;
  element.classList.add('hsc-selected-element');
  debug_debugLog('Highlight', 'Element classes after selection:', element.className);

  // マーカーを作成
  try {
    createElementMarker(element);
  } catch (error) {
    debug_debugLog('Highlight', 'Error creating marker:', error);
  }

  // 要素が見える位置にスクロール（少し遅延を入れて確実に実行）
  setTimeout(function () {
    try {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      debug_debugLog('Highlight', 'Scrolled to element');
    } catch (error) {
      debug_debugLog('Highlight', 'Error scrolling to element:', error);
    }
  }, 100);

  // 他のハイライトは維持する（元の実装に合わせて持続性を保つ）
  // 一時的なクリアは行わない

  debug_debugLog('Highlight', 'Element selected successfully:', element.tagName);
}

/**
 * 選択状態のハイライトをクリア
 */
function clearSelectedElementHighlight() {
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
function clearAllHighlights() {
  // 問題要素のハイライトをクリア
  highlightedElements.forEach(function (element) {
    if (element && element.classList) {
      element.classList.remove('hsc-highlighted-element');
    }
  });
  highlightedElements = [];

  // 選択要素のハイライトをクリア
  clearSelectedElementHighlight();
  debug_debugLog('Highlight', 'All highlights cleared');
}

/**
 * 要素のマーカーを作成
 * @param {Element} element - 対象要素
 */
function createElementMarker(element) {
  if (selectedElementMarker) {
    selectedElementMarker.remove();
  }
  var marker = document.createElement('div');
  marker.className = 'hsc-element-marker';
  marker.textContent = element.tagName.toLowerCase();

  // img, input, br, hr等のvoid要素は子要素を持てないため、親要素に配置
  var voidElements = ['IMG', 'INPUT', 'BR', 'HR', 'META', 'LINK', 'AREA', 'BASE', 'COL', 'EMBED', 'SOURCE', 'TRACK', 'WBR'];
  if (voidElements.includes(element.tagName)) {
    // void要素の場合は親要素に配置し、位置を調整
    var parent = element.parentElement;
    if (parent) {
      parent.style.position = parent.style.position || 'relative';
      parent.appendChild(marker);

      // 要素の位置に合わせてマーカーを配置
      var rect = element.getBoundingClientRect();
      var parentRect = parent.getBoundingClientRect();
      marker.style.position = 'absolute';
      marker.style.left = rect.left - parentRect.left + 'px';
      marker.style.top = rect.top - parentRect.top - 25 + 'px';
    } else {
      // 親要素がない場合はbodyに配置
      document.body.appendChild(marker);
      var _rect = element.getBoundingClientRect();
      marker.style.position = 'fixed';
      marker.style.left = _rect.left + 'px';
      marker.style.top = _rect.top - 25 + 'px';
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
function cleanupHighlight() {
  clearAllHighlights();

  // スタイルを削除
  var styleElement = document.getElementById(HIGHLIGHT_STYLE_ID);
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
function getHighlightedElementsCount() {
  return highlightedElements.length;
}

/**
 * 選択されている要素を取得
 * @returns {Element|null} 選択中の要素
 */
function getSelectedElement() {
  return selectedElement;
}
;// ./src/content-script/ui/drawer.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function drawer_toConsumableArray(r) { return drawer_arrayWithoutHoles(r) || drawer_iterableToArray(r) || drawer_unsupportedIterableToArray(r) || drawer_nonIterableSpread(); }
function drawer_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function drawer_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function drawer_arrayWithoutHoles(r) { if (Array.isArray(r)) return drawer_arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || drawer_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function drawer_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return drawer_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? drawer_arrayLikeToArray(r, a) : void 0; } }
function drawer_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * ドロワーUI管理モジュール
 */





// グローバル状態
var drawerElement = null;
var currentResults = null;

/**
 * ドロワーの初期化
 */
function initializeDrawer() {
  if (drawerElement) {
    debug_debugLog('Drawer', 'Drawer already initialized');
    return;
  }
  createDrawerElement();
  attachDrawerEvents();
  debug_debugLog('Drawer', 'Drawer initialized');
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
    var styleElement = document.createElement('style');
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
  return "\n    <div class=\"hsc-drawer-overlay\"></div>\n    <div class=\"hsc-drawer-panel\">\n      <div class=\"hsc-drawer-header\">\n        <button class=\"hsc-close-btn\" title=\"\u9589\u3058\u308B\">\xD7</button>\n      </div>\n      \n      <div class=\"hsc-drawer-content\">\n        <div class=\"hsc-loading\">\n          <div class=\"hsc-spinner\"></div>\n          <p>\u5206\u6790\u4E2D...</p>\n        </div>\n        \n        <div class=\"hsc-results\" style=\"display: none;\">\n          \n          <div class=\"hsc-issue-filters\">\n            <select id=\"hsc-category-filter\">\n              <option value=\"all\">\u5168\u30AB\u30C6\u30B4\u30EA</option>\n              <option value=\"heading\">\u898B\u51FA\u3057</option>\n              <option value=\"accessibility\">\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3</option>\n              <option value=\"cleanup\">\u30AF\u30EA\u30FC\u30F3\u30A2\u30C3\u30D7</option>\n            </select>\n            <select id=\"hsc-severity-filter\">\n              <option value=\"all\">\u5168\u91CD\u8981\u5EA6</option>\n              <option value=\"error\">\u30A8\u30E9\u30FC</option>\n              <option value=\"warning\">\u8B66\u544A</option>\n              <option value=\"info\">\u60C5\u5831</option>\n            </select>\n          </div>\n          \n          <div class=\"hsc-issues-list\"></div>\n        </div>\n      </div>\n    </div>\n  ";
}

/**
 * ドロワーのスタイル
 * @returns {string} CSSスタイル
 */
function getDrawerStyles() {
  return "\n    /* \u30C9\u30ED\u30EF\u30FC\u306E\u30D9\u30FC\u30B9\u30B9\u30BF\u30A4\u30EB */\n    #html-semantic-checker-drawer {\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      z-index: 1000000;\n      visibility: hidden;\n      opacity: 0;\n      transition: all 0.3s ease;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n    }\n\n    /* \u5916\u90E8CSS\u306E\u5F71\u97FF\u3092\u9632\u3050\u305F\u3081\u306E\u5F37\u5236\u30B9\u30BF\u30A4\u30EB */\n    #html-semantic-checker-drawer *,\n    #html-semantic-checker-drawer *:before,\n    #html-semantic-checker-drawer *:after {\n      text-align: left !important;\n      direction: ltr !important;\n      text-indent: 0 !important;\n      letter-spacing: normal !important;\n      word-spacing: normal !important;\n      text-transform: none !important;\n    }\n\n    #html-semantic-checker-drawer.open {\n      visibility: visible;\n      opacity: 1;\n    }\n\n    .hsc-drawer-overlay {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.5);\n    }\n\n    .hsc-drawer-panel {\n      position: absolute;\n      top: 0;\n      right: -420px;\n      width: 420px;\n      height: 100%;\n      background: #ffffff;\n      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);\n      transition: right 0.3s ease;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n    }\n\n    #html-semantic-checker-drawer.open .hsc-drawer-panel {\n      right: 0;\n    }\n\n    /* \u30D8\u30C3\u30C0\u30FC */\n    .hsc-drawer-header {\n      padding: 12px 16px;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      color: white;\n      border-bottom: 1px solid #e1e5e9;\n      display: flex;\n      justify-content: flex-end;\n      align-items: center;\n      flex-shrink: 0;\n    }\n\n\n    .hsc-close-btn {\n      background: none;\n      border: none;\n      color: white;\n      font-size: 24px;\n      cursor: pointer;\n      padding: 0;\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: background 0.2s;\n    }\n\n    .hsc-close-btn:hover {\n      background: rgba(255, 255, 255, 0.2);\n    }\n\n    /* \u30E1\u30A4\u30F3\u30B3\u30F3\u30C6\u30F3\u30C4\u30A8\u30EA\u30A2 */\n    .hsc-drawer-content {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      min-height: 0;\n      overflow: hidden;\n    }\n\n    /* \u30ED\u30FC\u30C7\u30A3\u30F3\u30B0 */\n    .hsc-loading {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      height: 200px;\n      color: #6c757d;\n    }\n\n    .hsc-spinner {\n      width: 40px;\n      height: 40px;\n      border: 3px solid #f1f3f4;\n      border-top: 3px solid #667eea;\n      border-radius: 50%;\n      animation: spin 1s linear infinite;\n      margin-bottom: 16px;\n    }\n\n    @keyframes spin {\n      0% { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n\n\n    /* \u30D5\u30A3\u30EB\u30BF\u30FC\u30BB\u30AF\u30B7\u30E7\u30F3 */\n    .hsc-issue-filters {\n      padding: 12px 20px;\n      background: white;\n      border-bottom: 1px solid #e9ecef;\n      display: flex;\n      gap: 10px;\n      flex-shrink: 0;\n    }\n\n    .hsc-issue-filters select {\n      flex: 1;\n      padding: 8px 12px;\n      border: 1px solid #ced4da;\n      border-radius: 6px;\n      background: white;\n      font-size: 14px;\n      color: #495057;\n    }\n\n    /* \u7D50\u679C\u30A8\u30EA\u30A2 */\n    .hsc-results {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      min-height: 0;\n      overflow: hidden;\n    }\n\n    /* \u554F\u984C\u30EA\u30B9\u30C8 */\n    .hsc-issues-list {\n      flex: 1;\n      overflow-y: auto;\n      padding: 16px 0;\n    }\n\n    .hsc-issue-item {\n      margin: 0 16px 16px 16px;\n      background: white;\n      border: 1px solid #e9ecef;\n      border-radius: 8px;\n      overflow: hidden;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);\n      transition: all 0.2s ease;\n    }\n\n    .hsc-issue-item:hover {\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n      border-color: #667eea;\n    }\n\n    /* \u554F\u984C\u30D8\u30C3\u30C0\u30FC */\n    .hsc-issue-header {\n      padding: 16px 20px;\n      background: #f8f9fa;\n      border-bottom: 1px solid #e9ecef;\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      cursor: pointer;\n      user-select: none;\n    }\n\n    .hsc-issue-severity {\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      flex-shrink: 0;\n    }\n\n    .hsc-issue-severity.error {\n      background: #dc3545;\n    }\n\n    .hsc-issue-severity.warning {\n      background: #ffc107;\n    }\n\n    .hsc-issue-title {\n      flex: 1;\n      font-weight: 600;\n      color: #2c3e50;\n      font-size: 15px;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    .hsc-issue-count {\n      background: #667eea;\n      color: white;\n      padding: 4px 8px;\n      border-radius: 12px;\n      font-size: 12px;\n      font-weight: 500;\n    }\n\n    .hsc-expand-icon {\n      color: #6c757d;\n      font-size: 14px;\n      transition: transform 0.2s;\n    }\n\n    .hsc-issue-item.expanded .hsc-expand-icon {\n      transform: rotate(180deg);\n    }\n\n    /* \u554F\u984C\u8A73\u7D30 */\n    .hsc-issue-details {\n      display: none;\n      padding: 20px;\n    }\n\n    .hsc-issue-item.expanded .hsc-issue-details {\n      display: block;\n    }\n\n    .hsc-issue-message {\n      font-size: 14px;\n      color: #495057;\n      line-height: 1.6;\n      margin-bottom: 16px;\n      padding: 12px;\n      background: #f8f9fa;\n      border-left: 3px solid #667eea;\n      border-radius: 0 4px 4px 0;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    /* \u8981\u7D20\u30EA\u30B9\u30C8 */\n    .hsc-issue-elements h4 {\n      font-size: 14px;\n      font-weight: 600;\n      color: #2c3e50;\n      margin: 0 0 12px 0;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    .hsc-elements-list {\n      list-style: none;\n      padding: 0;\n      margin: 0 0 20px 0;\n    }\n\n    .hsc-element-item {\n      padding: 12px 16px;\n      background: #f8f9fa;\n      border: 1px solid #e9ecef;\n      border-radius: 6px;\n      margin-bottom: 8px;\n      cursor: pointer;\n      transition: all 0.2s;\n    }\n\n    .hsc-element-item:hover {\n      background: #e9ecef;\n      border-color: #667eea;\n    }\n\n    .hsc-element-item.non-visible {\n      opacity: 0.5;\n      cursor: not-allowed;\n    }\n\n    .hsc-element-tag {\n      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;\n      font-size: 13px;\n      color: #495057;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    /* === \u89E3\u6C7A\u65B9\u6CD5\u306E\u30B7\u30F3\u30D7\u30EB\u306A\u30B9\u30BF\u30A4\u30EB === */\n    .hsc-issue-solution {\n      margin-top: 16px;\n      background: #f8f9fa;\n      border-radius: 6px;\n      padding: 16px;\n    }\n\n    .hsc-solution-header {\n      font-size: 14px;\n      font-weight: 600;\n      color: #2c3e50;\n      margin-bottom: 12px;\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    .hsc-solution-header::before {\n      content: \"\uD83D\uDCA1\";\n      font-size: 16px;\n    }\n\n    .hsc-solution-content {\n      font-size: 14px;\n      color: #495057;\n      line-height: 1.6;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    /* \u30BB\u30AF\u30B7\u30E7\u30F3 */\n    .hsc-solution-section {\n      margin-bottom: 16px;\n    }\n\n    .hsc-solution-section:last-child {\n      margin-bottom: 0;\n    }\n\n    .hsc-solution-title {\n      font-size: 14px;\n      font-weight: 600;\n      color: #667eea;\n      margin: 0 0 8px 0;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    .hsc-solution-text {\n      color: #495057;\n      line-height: 1.6;\n      margin: 0;\n      white-space: pre-wrap;\n      word-wrap: break-word;\n      text-align: left !important;\n      direction: ltr !important;\n    }\n\n    /* \u30B3\u30FC\u30C9\u4F8B */\n    .hsc-code-example {\n      margin-top: 8px;\n      padding: 12px;\n      background: #2c3e50;\n      color: #f8f9fa;\n      border-radius: 4px;\n      font-family: 'Monaco', 'Menlo', monospace;\n      font-size: 13px;\n      overflow-x: auto;\n      white-space: pre-wrap;\n      word-wrap: break-word;\n      border: 2px solid;\n    }\n\n    .hsc-good-example {\n      border-color: #28a745;\n    }\n\n    .hsc-bad-example {\n      border-color: #dc3545;\n    }\n\n    .hsc-example-header {\n      padding: 12px 16px;\n      font-weight: 600;\n      font-size: 14px;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n\n\n    /* \u30EC\u30B9\u30DD\u30F3\u30B7\u30D6 */\n    @media (max-width: 480px) {\n      .hsc-drawer-panel {\n        width: 100%;\n        right: -100%;\n      }\n\n\n      .hsc-examples {\n        grid-template-columns: 1fr;\n      }\n    }\n\n    /* \u30B9\u30AF\u30ED\u30FC\u30EB\u30D0\u30FC */\n    .hsc-issues-list::-webkit-scrollbar {\n      width: 6px;\n    }\n\n    .hsc-issues-list::-webkit-scrollbar-track {\n      background: #f1f3f4;\n    }\n\n    .hsc-issues-list::-webkit-scrollbar-thumb {\n      background: #ced4da;\n      border-radius: 3px;\n    }\n\n    .hsc-issues-list::-webkit-scrollbar-thumb:hover {\n      background: #adb5bd;\n    }\n  ";
}

/**
 * ドロワーイベントのアタッチ
 */
function attachDrawerEvents() {
  // 閉じるボタン
  var closeBtn = drawerElement.querySelector('.hsc-close-btn');
  closeBtn.addEventListener('click', closeDrawer);

  // オーバーレイクリック
  var overlay = drawerElement.querySelector('.hsc-drawer-overlay');
  overlay.addEventListener('click', closeDrawer);

  // フィルター
  var categoryFilter = drawerElement.querySelector('#hsc-category-filter');
  var severityFilter = drawerElement.querySelector('#hsc-severity-filter');
  categoryFilter.addEventListener('change', filterIssues);
  severityFilter.addEventListener('change', filterIssues);
}

/**
 * ドロワーを開く
 */
function openDrawer() {
  if (!drawerElement) {
    initializeDrawer();
  }
  drawerElement.classList.add('open');
  drawerOpen = true;
  debug_debugLog('Drawer', 'Drawer opened');
}

/**
 * ドロワーを閉じる
 */
function closeDrawer() {
  if (drawerElement) {
    drawerElement.classList.remove('open');
  }
  drawerOpen = false;
  debug_debugLog('Drawer', 'Drawer closed');
}

/**
 * 結果をドロワーに表示
 * @param {Object} results - 分析結果
 */
function displayResultsInDrawer(results) {
  currentResults = results;
  if (!drawerElement) {
    initializeDrawer();
  }

  // ローディングを隠し、結果を表示
  var loading = drawerElement.querySelector('.hsc-loading');
  var resultsDiv = drawerElement.querySelector('.hsc-results');
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
  var issuesList = drawerElement.querySelector('.hsc-issues-list');
  if (issues.length === 0) {
    issuesList.innerHTML = '<p class="hsc-no-issues">問題は見つかりませんでした。</p>';
    return;
  }

  // 問題をグループ化
  var groupedIssues = groupIssuesByName(issues);
  issuesList.innerHTML = '';
  Object.entries(groupedIssues).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      issueGroup = _ref2[1];
    var issueElement = createIssueElement(name, issueGroup);
    issuesList.appendChild(issueElement);
  });
}

/**
 * 問題を名前でグループ化
 * @param {Array} issues - 問題リスト
 * @returns {Object} グループ化された問題
 */
function groupIssuesByName(issues) {
  var grouped = {};
  issues.forEach(function (issue) {
    if (!grouped[issue.name]) {
      grouped[issue.name] = _objectSpread(_objectSpread({}, issue), {}, {
        count: 0,
        allElements: []
      });
    }
    grouped[issue.name].count += issue.elements ? issue.elements.length : 1;
    if (issue.elements) {
      var _grouped$issue$name$a;
      (_grouped$issue$name$a = grouped[issue.name].allElements).push.apply(_grouped$issue$name$a, drawer_toConsumableArray(issue.elements));
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
  var div = document.createElement('div');
  div.className = 'hsc-issue-item';
  div.dataset.category = issue.category;
  div.dataset.severity = issue.severity;

  // 関連要素の詳細リストを作成（すべて表示）
  var elementsListHTML = '';
  if (issue.allElements && issue.allElements.length > 0) {
    elementsListHTML = "\n      <div class=\"hsc-issue-elements\">\n        <h4>\u95A2\u9023\u8981\u7D20 (".concat(issue.allElements.length, "\u500B):</h4>\n        <ul class=\"hsc-elements-list\">\n          ").concat(issue.allElements.map(function (element, index) {
      // 元の詳細な要素表示を使用
      var elementDetails = getElementDetails(element);
      var isNonVisible = isNonVisibleElement(element);
      return "\n              <li class=\"hsc-element-item ".concat(isNonVisible ? 'non-visible' : '', "\" data-element-index=\"").concat(index, "\" ").concat(isNonVisible ? 'data-non-visible="true"' : '', ">\n                <div class=\"hsc-element-tag\">").concat(escapeHtml(elementDetails), "</div>\n              </li>\n            ");
    }).join(''), "\n        </ul>\n      </div>\n    ");
  }

  // 解決策をHTMLとして適切にフォーマット
  var solutionHTML = '';
  if (issue.solution) {
    var formattedSolution = formatSolutionForUI(issue.solution);
    solutionHTML = "\n      <div class=\"hsc-issue-solution\">\n        <div class=\"hsc-solution-header\">\u89E3\u6C7A\u65B9\u6CD5</div>\n        ".concat(formattedSolution, "\n      </div>\n    ");
  }
  div.innerHTML = "\n    <div class=\"hsc-issue-header\">\n      <div class=\"hsc-issue-severity ".concat(issue.severity, "\"></div>\n      <div class=\"hsc-issue-title\">").concat(name, "</div>\n      <div class=\"hsc-issue-count\">").concat(issue.count, "\u500B</div>\n      <div class=\"hsc-expand-icon\">\u25BC</div>\n    </div>\n    <div class=\"hsc-issue-details\">\n      <div class=\"hsc-issue-message\">").concat(issue.message, "</div>\n      ").concat(issue.text ? "<div class=\"hsc-issue-html\"><strong>\u691C\u51FA\u3055\u308C\u305FHTML:</strong><br><code style=\"display: block; background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 8px 0; white-space: pre-wrap; font-size: 11px;\">".concat(escapeHtml(issue.text), "</code></div>") : '', "\n      ").concat(elementsListHTML, "\n      ").concat(solutionHTML, "\n    </div>\n  ");

  // 初期状態は閉じた状態

  // クリックで詳細を表示/非表示
  var header = div.querySelector('.hsc-issue-header');
  header.addEventListener('click', function () {
    var wasExpanded = div.classList.contains('expanded');
    div.classList.toggle('expanded');
    var expandIcon = div.querySelector('.hsc-expand-icon');
    expandIcon.textContent = div.classList.contains('expanded') ? '▲' : '▼';

    // 要素をハイライト（展開時のみ、既存のハイライトは維持）
    if (!wasExpanded && issue.allElements && issue.allElements.length > 0) {
      highlightElements(issue.allElements);
    }
    // 閉じる時はハイライトを維持（変更前の動作に合わせる）
  });

  // 個別要素のクリック処理（後でイベントリスナーを追加）
  setTimeout(function () {
    var elementItems = div.querySelectorAll('.hsc-element-item');
    elementItems.forEach(function (item, index) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();

        // 非表示要素はクリックを無効化
        if (item.dataset.nonVisible === 'true') {
          debug_debugLog('Drawer', "Non-visible element clicked, ignoring: ".concat(index));
          return;
        }
        debug_debugLog('Drawer', "Element item ".concat(index, " clicked"));
        if (issue.allElements && issue.allElements[index]) {
          debug_debugLog('Drawer', "Selecting element:", issue.allElements[index]);
          // 直接ハイライト関数を呼び出し
          selectElement(issue.allElements[index]);
        } else {
          debug_debugLog('Drawer', 'No element found at index:', index);
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
  var categoryFilter = drawerElement.querySelector('#hsc-category-filter').value;
  var severityFilter = drawerElement.querySelector('#hsc-severity-filter').value;
  var issueItems = drawerElement.querySelectorAll('.hsc-issue-item');
  issueItems.forEach(function (item) {
    var category = item.dataset.category;
    var severity = item.dataset.severity;
    var categoryMatch = categoryFilter === 'all' || category === categoryFilter;
    var severityMatch = severityFilter === 'all' || severity === severityFilter;
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
  var div = document.createElement('div');
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
  var sections = text.split(/\n\s*\n/).filter(function (s) {
    return s.trim();
  });
  var html = '<div class="hsc-solution-content">';
  sections.forEach(function (section) {
    var lines = section.trim().split('\n');

    // コードブロックの検出
    if (section.includes('<') && section.includes('>')) {
      html += "<div class=\"hsc-code-example\">".concat(escapeHtml(section), "</div>");
    }
    // 箇条書きの検出
    else if (section.includes('•') || /^\d+\./.test(section)) {
      html += '<div class="hsc-solution-section">';
      html += "<div class=\"hsc-solution-text\">".concat(escapeHtml(section), "</div>");
      html += '</div>';
    }
    // 通常テキスト
    else {
      html += '<div class="hsc-solution-section">';
      // 最初の行がタイトルの可能性
      if (lines.length > 1 && (lines[0].includes('：') || lines[0].includes('設定') || lines[0].includes('方法'))) {
        html += "<h4 class=\"hsc-solution-title\">".concat(escapeHtml(lines[0]), "</h4>");
        html += "<div class=\"hsc-solution-text\">".concat(escapeHtml(lines.slice(1).join('\n')), "</div>");
      } else {
        html += "<div class=\"hsc-solution-text\">".concat(escapeHtml(section), "</div>");
      }
      html += '</div>';
    }
  });
  html += '</div>';
  return html;
}
;// ./src/content-script/index.js
function content_script_typeof(o) { "@babel/helpers - typeof"; return content_script_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, content_script_typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, content_script_toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function content_script_toPropertyKey(t) { var i = content_script_toPrimitive(t, "string"); return "symbol" == content_script_typeof(i) ? i : i + ""; }
function content_script_toPrimitive(t, r) { if ("object" != content_script_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != content_script_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * HTML Semantic Checker - Content Script Entry Point
 * 全てのモジュールを統合するメインエントリーポイント
 */






/**
 * HTML Semantic Checker メインクラス
 */
var HTMLSemanticChecker = /*#__PURE__*/function () {
  function HTMLSemanticChecker() {
    _classCallCheck(this, HTMLSemanticChecker);
    this.isInitialized = false;
    this.checkResults = null;
  }

  /**
   * 初期化
   */
  return _createClass(HTMLSemanticChecker, [{
    key: "initialize",
    value: function initialize() {
      if (this.isInitialized) {
        debug_debugLog('Checker', 'Already initialized');
        return;
      }
      debug_debugLog('Checker', 'Initializing HTML Semantic Checker...');
      try {
        // UIコンポーネントの初期化
        initializeDrawer();
        initializeHighlight();

        // メッセージリスナーの設定
        this.setupMessageListeners();

        // キーボードショートカットの設定
        this.setupKeyboardShortcuts();
        this.isInitialized = true;
        debug_debugLog('Checker', 'Initialization complete');
      } catch (error) {
        errorLog('Checker', 'Initialization failed:', error);
      }
    }

    /**
     * メッセージリスナーの設定
     */
  }, {
    key: "setupMessageListeners",
    value: function setupMessageListeners() {
      var _this = this;
      window.addEventListener('message', function (event) {
        if (!event.data || !event.data.type) return;
        switch (event.data.type) {
          case 'HTML_CHECKER_START':
            _this.performFullCheck();
            break;
          case 'HTML_CHECKER_RECHECK':
            _this.performFullCheck(false); // 再チェックなので isInitialRun = false
            break;
          case 'HTML_CHECKER_CLOSE':
            _this.cleanup();
            break;
        }
      });

      // Background scriptからのメッセージ
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        debug_debugLog('Checker', 'Message received from background:', request);

        // PINGメッセージに応答
        if (request.type === 'PING') {
          debug_debugLog('Checker', 'Responding to PING');
          sendResponse({
            type: 'PONG',
            timestamp: Date.now()
          });
          return true;
        }

        // チェック開始メッセージ
        if (request.type === 'START_CHECK') {
          debug_debugLog('Checker', 'Starting check from background');
          try {
            // Background scriptから送信されたisInitialRunフラグを使用
            var isInitialRun = request.isInitialRun !== undefined ? request.isInitialRun : true;
            debug_debugLog('Checker', 'Is initial run from background:', isInitialRun);
            _this.performFullCheck(isInitialRun);
            sendResponse({
              success: true,
              timestamp: Date.now()
            });
          } catch (error) {
            errorLog('Checker', 'Check failed:', error);
            sendResponse({
              success: false,
              error: error.message
            });
          }
          return true;
        }

        // レガシーメッセージハンドリング
        switch (request.action) {
          case 'startCheck':
            _this.performFullCheck(false); // レガシーアクションは再実行として扱う
            sendResponse({
              success: true
            });
            return true;
          case 'getResults':
            sendResponse({
              results: _this.checkResults
            });
            return true;
        }
        return false;
      });
    }

    /**
     * キーボードショートカットの設定
     */
  }, {
    key: "setupKeyboardShortcuts",
    value: function setupKeyboardShortcuts() {
      var _this2 = this;
      document.addEventListener('keydown', function (event) {
        // Escape キーでドロワーを閉じる
        if (event.key === 'Escape') {
          closeDrawer();
        }

        // Ctrl+Shift+H でチェッカーを起動
        if (event.ctrlKey && event.shiftKey && event.key === 'H') {
          event.preventDefault();
          _this2.performFullCheck(false); // キーボードショートカットは再実行として扱う
        }
      });
    }

    /**
     * 完全なページ分析を実行
     * @param {boolean} isInitialRun - 初回実行かどうか
     */
  }, {
    key: "performFullCheck",
    value: (function () {
      var _performFullCheck2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var isInitialRun,
          results,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              isInitialRun = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
              debug_debugLog('Checker', 'Starting full semantic analysis...');
              _context.p = 1;
              if (!(!isInitialRun && this.checkResults !== null)) {
                _context.n = 2;
                break;
              }
              debug_debugLog('Checker', 'Reloading page for re-check...');
              window.location.reload();
              return _context.a(2);
            case 2:
              // 前回の結果をクリア
              clearAllHighlights();

              // 分析を実行
              results = main_engine_performFullCheck();
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
              debug_debugLog('Checker', 'Analysis completed successfully');
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              errorLog('Checker', 'Analysis failed:', _t);

              // エラーをBackground scriptに送信
              chrome.runtime.sendMessage({
                action: 'checkError',
                error: _t.message
              });
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function performFullCheck() {
        return _performFullCheck2.apply(this, arguments);
      }
      return performFullCheck;
    }()
    /**
     * クリーンアップ
     */
    )
  }, {
    key: "cleanup",
    value: function cleanup() {
      debug_debugLog('Checker', 'Cleaning up...');
      try {
        clearAllHighlights();
        closeDrawer();

        // イベントリスナーの削除は各モジュールで実行

        this.isInitialized = false;
        this.checkResults = null;
        debug_debugLog('Checker', 'Cleanup complete');
      } catch (error) {
        errorLog('Checker', 'Cleanup failed:', error);
      }
    }

    /**
     * 結果を取得
     * @returns {Object|null} 分析結果
     */
  }, {
    key: "getResults",
    value: function getResults() {
      return this.checkResults;
    }
  }]);
}(); // 重複注入防止
if (window.__htmlSemanticCheckerLoaded) {
  debug_debugLog('Content Script', 'Already loaded, skipping...');
} else {
  window.__htmlSemanticCheckerLoaded = true;
  debug_debugLog('Content Script', 'Loading HTML Semantic Checker...');

  // メインインスタンスを作成
  var checker = new HTMLSemanticChecker();

  // DOM準備完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      checker.initialize();
    });
  } else {
    checker.initialize();
  }

  // グローバルからアクセス可能にする（開発・デバッグ用）
  window.__htmlSemanticChecker = checker;
  debug_debugLog('Content Script', 'HTML Semantic Checker loaded successfully');
}

// 手動起動用の関数をエクスポート
function startCheck() {
  if (window.__htmlSemanticChecker) {
    window.__htmlSemanticChecker.performFullCheck(false); // 手動起動は再実行として扱う
  }
}
function getChecker() {
  return window.__htmlSemanticChecker;
}
/******/ })()
;
//# sourceMappingURL=content-script.js.map