/**
 * HTML Semantic Checker - Configuration
 */

export const CONFIG = {
  debug: true,
  enabledRules: ['all'] // すべてのルールを有効
};

export const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const CATEGORIES = {
  HEADING: 'heading',
  ACCESSIBILITY: 'accessibility',
  SEO: 'seo',
  STRUCTURE: 'structure',
  CLEANUP: 'cleanup'
};

// 非表示要素のタグリスト
export const NON_VISIBLE_TAGS = ['META', 'SCRIPT', 'STYLE', 'LINK', 'TITLE', 'BASE', 'NOSCRIPT'];

// ハイライトから除外するタグ
export const EXCLUDE_HIGHLIGHT_TAGS = ['BODY', 'HTML', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'SECTION', 'ARTICLE', 'ASIDE'];

// 見出し構造チェックで許可される単純なタグ
export const ALLOWED_SIMPLE_TAGS = ['BR', 'A', 'STRONG', 'EM', 'SPAN', 'I', 'B', 'SMALL'];

// 装飾目的のHTMLタグ（非推奨）
export const PRESENTATIONAL_TAGS = ['FONT', 'CENTER', 'U', 'S', 'STRIKE', 'BIG', 'SMALL', 'TT'];

// インラインセマンティックタグ
export const INLINE_SEMANTIC_TAGS = ['STRONG', 'EM', 'MARK', 'CODE', 'KBD', 'SAMP', 'VAR'];

// トラッキングピクセルのパターン
export const TRACKING_PIXEL_PATTERNS = [
  /adsct/i,           // Twitter/X tracking
  /doubleclick/i,     // Google DoubleClick
  /googletagmanager/i,// Google Tag Manager
  /facebook/i,        // Facebook tracking
  /analytics/i,       // General analytics
  /pixel/i,           // General pixel tracking
  /tr\?/i,            // Common tracking parameter
  /1x1/i              // 1x1 pixel indicator
];

// 古いGoogle Analyticsのパターン
export const LEGACY_GA_PATTERNS = [
  /UA-\d+-\d+/,
  /_gat\._getTracker/,
  /pageTracker/,
  /google-analytics\.com\/ga\.js/
];

// Adobe関連のパターン
export const ADOBE_PATTERNS = [
  /s_code\.js/,
  /omniture\.js/,
  /sitecatalyst/i,
  /adobe\.com\/dtm/,
  /s\.t\(\)/,
  /s\.tl\(/
];

// スタイル設定
export const DRAWER_STYLES = {
  width: '450px',
  zIndex: 2147483647 // 最大値に近い値
};