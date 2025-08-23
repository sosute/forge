/**
 * アクセシビリティ分析モジュール
 */

import { SEVERITY, TRACKING_PIXEL_PATTERNS } from '../config.js';
import { isExcludedElement } from '../utils/dom.js';
import { debugLog } from '../utils/debug.js';

/**
 * アクセシビリティ全体の分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Object} アクセシビリティ分析結果
 */
export function analyzeAccessibility(targetElements = null) {
  // プリプロセス済み要素がある場合はそれを使用
  if (targetElements) {
    return {
      images: {
        total: targetElements.accessibility.images.length,
        withoutAlt: targetElements.accessibility.imagesWithoutAlt.length,
        withEmptyAlt: targetElements.accessibility.images.filter(img => img.getAttribute('alt') === '').length
      },
      links: {
        total: targetElements.accessibility.links.length,
        withoutText: targetElements.accessibility.links.filter(link => !link.textContent.trim()).length,
        withoutAriaLabel: targetElements.accessibility.links.filter(link => 
          !link.hasAttribute('aria-label') && !link.hasAttribute('title')).length
      },
      forms: {
        inputs: targetElements.accessibility.formElements.filter(el => el.tagName === 'INPUT').length,
        inputsWithoutLabels: targetElements.accessibility.formElements.filter(el => 
          !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')).length,
        textareas: targetElements.accessibility.formElements.filter(el => el.tagName === 'TEXTAREA').length
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
export function detectAccessibilityIssues(targetElements = null) {
  const issues = [];

  // alt属性チェック
  const altIssues = checkImageAltAttributes(targetElements);
  issues.push(...altIssues);

  // フォームラベルチェック
  const formLabelIssues = checkFormLabels(targetElements);
  issues.push(...formLabelIssues);

  // ARIA属性チェック
  const ariaIssues = checkAriaAttributes(targetElements);
  issues.push(...ariaIssues);

  // 必須ARIA属性チェック
  const ariaRequiredIssues = checkAriaRequired(targetElements);
  issues.push(...ariaRequiredIssues);

  // リンクのアクセシビリティチェック
  const linkIssues = checkLinkAccessibility(targetElements);
  issues.push(...linkIssues);

  // レイアウトテーブルチェック
  const tableIssues = checkLayoutTables(targetElements);
  issues.push(...tableIssues);

  return issues;
}

/**
 * 画像のalt属性をチェック（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} alt属性に関する問題リスト
 */
function checkImageAltAttributes(targetElements = null) {
  const issues = [];
  
  // プリプロセス済み要素がある場合はそれを使用
  const imagesWithoutAlt = targetElements ? 
    targetElements.accessibility.imagesWithoutAlt : 
    Array.from(document.querySelectorAll('img:not([alt])')).filter(img => !isExcludedElement(img));
  
  debugLog('Checker', 'Images without alt found:', imagesWithoutAlt.length);
  
  // トラッキングピクセルを除外（プリプロセス済みの場合は既に除外済み）
  const filteredImages = targetElements ? 
    imagesWithoutAlt.filter(img => {
      // プリプロセス済みの場合は除外チェックは不要、トラッキングピクセルのみチェック
      const src = img.src || img.getAttribute('src') || '';
      const isTrackingUrl = TRACKING_PIXEL_PATTERNS.some(pattern => pattern.test(src));
      
      // サイズチェック（1x1ピクセル）
      const is1x1Pixel = (img.width === 1 && img.height === 1) || 
                        (img.naturalWidth === 1 && img.naturalHeight === 1) ||
                        (img.getAttribute('width') === '1' && img.getAttribute('height') === '1');
      
      // 隠し要素チェック
      const computedStyle = window.getComputedStyle(img);
      const isHidden = computedStyle.display === 'none' || 
                      computedStyle.visibility === 'hidden' ||
                      img.style.display === 'none' ||
                      img.style.visibility === 'hidden';
      
      return !isTrackingUrl && !is1x1Pixel && !isHidden;
    }) :
    imagesWithoutAlt.filter(img => {
      // 従来の方式：すべてのチェックを実行
    // URLチェック
      const src = img.src || img.getAttribute('src') || '';
      const isTrackingUrl = TRACKING_PIXEL_PATTERNS.some(pattern => pattern.test(src));
    
      // サイズチェック（1x1ピクセル）
      const is1x1Pixel = (img.width === 1 && img.height === 1) || 
                      (img.naturalWidth === 1 && img.naturalHeight === 1) ||
                      (img.getAttribute('width') === '1' && img.getAttribute('height') === '1');
    
      // 隠し要素チェック
      const computedStyle = window.getComputedStyle(img);
      const isHidden = computedStyle.display === 'none' || 
                    computedStyle.visibility === 'hidden' ||
                    img.style.display === 'none' ||
                    img.style.visibility === 'hidden';
    
      // トラッキングピクセルでない場合のみ含める
      return !isTrackingUrl && !is1x1Pixel && !isHidden;
    });

  debugLog('Checker', 'After filtering tracking pixels:', filteredImages.length);

  if (filteredImages.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'missing_alt',
      name: '画像のalt属性欠落',
      message: `${filteredImages.length}個の画像にalt属性がありません。視覚障害のあるユーザーがスクリーンリーダーで画像の内容を理解できません。SEO的にも検索エンジンが画像を認識できません。`,
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
  const issues = [];
  const formElements = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
  
  const missingLabels = Array.from(formElements).filter(el => {
    // 除外対象要素を除外
    if (isExcludedElement(el)) {
      return false;
    }
    const hasLabel = el.id && document.querySelector(`label[for="${el.id}"]`) !== null;
    const hasAriaLabel = el.hasAttribute('aria-label');
    const hasAriaLabelledby = el.hasAttribute('aria-labelledby');
    const hasPlaceholder = el.hasAttribute('placeholder');
    const hasTitle = el.hasAttribute('title');
    
    // 検索フィールドなど、コンテキストが明確な要素を除外
    const isSearchField = el.name === 'q' || 
                         el.name === 'search' || 
                         el.id?.includes('search') || 
                         el.className?.includes('search');
    
    return !hasLabel && !hasAriaLabel && !hasAriaLabelledby && 
           !hasPlaceholder && !hasTitle && !isSearchField;
  });
  
  if (missingLabels.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'missing_form_labels',
      name: 'フォーム要素のラベル不足',
      message: `${missingLabels.length}個のフォーム要素にアクセシブルなラベルがありません。`,
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
  const issues = [];

  // aria-expandedチェック
  const expandableSelectors = [
    'button[data-toggle]',
    '[role="button"][data-toggle]',
    'details summary',
    '.dropdown-toggle',
    '.accordion-toggle',
    '[aria-controls]'
  ];
  
  const expandableElements = document.querySelectorAll(expandableSelectors.join(', '));
  const missingAriaExpanded = Array.from(expandableElements).filter(el => {
    if (el.tagName === 'SUMMARY') return false; // details要素は除外
    return !el.hasAttribute('aria-expanded');
  });
  
  if (missingAriaExpanded.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.WARNING,
      rule: 'missing_aria_expanded',
      name: 'インタラクティブ要素のARIA展開状態不足',
      message: `${missingAriaExpanded.length}個のインタラクティブ要素にaria-expanded属性が不足しています`,
      elements: missingAriaExpanded,
      solution: getAriaExpandedSolution()
    });
  }

  // aria-currentチェック
  const navigationLinks = document.querySelectorAll('nav a, .breadcrumb a, .pagination a');
  const missingAriaCurrent = Array.from(navigationLinks).filter(link => {
    const hasActiveClass = link.classList.contains('active') || 
                          link.classList.contains('current');
    const isSameUrl = link.href === window.location.href;
    
    return (hasActiveClass || isSameUrl) && !link.hasAttribute('aria-current');
  });
  
  if (missingAriaCurrent.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.WARNING,
      rule: 'missing_aria_current',
      name: '現在位置のARIA属性不足',
      message: `${missingAriaCurrent.length}個のアクティブなナビゲーションリンクにaria-current属性が不足しています`,
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
  const issues = [];

  // role属性に基づく必須ARIA属性チェック
  const elementsWithRole = document.querySelectorAll('[role]');
  const missingRequired = [];

  Array.from(elementsWithRole).forEach(element => {
    // 除外対象要素を除外
    if (isExcludedElement(element)) {
      return;
    }
    
    const role = element.getAttribute('role');
    
    // roleに応じた必須属性をチェック
    switch (role) {
    case 'button':
      if (!element.hasAttribute('aria-label') && 
            !element.hasAttribute('aria-labelledby') && 
            !element.textContent.trim()) {
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
      if (!element.hasAttribute('aria-valuenow') || 
            !element.hasAttribute('aria-valuemin') || 
            !element.hasAttribute('aria-valuemax')) {
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
      message: `${missingRequired.length}個の要素に必須のARIA属性が不足しています。roleに応じた適切なARIA属性を設定してください。`,
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
  return `必須ARIA属性の設定方法:

roleに応じた必須属性:

1. role="button"の場合:
<div role="button" aria-label="送信">送信</div>
または
<div role="button" aria-labelledby="btn-label">
  <span id="btn-label">送信</span>
</div>

2. role="tab"の場合:
<div role="tab" aria-selected="true">タブ1</div>
<div role="tab" aria-selected="false">タブ2</div>

3. role="tabpanel"の場合:
<div role="tabpanel" aria-labelledby="tab1">
  タブパネルの内容
</div>

4. role="slider"の場合:
<div role="slider" 
     aria-valuenow="50" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="音量">
</div>

5. role="progressbar"の場合:
<div role="progressbar" 
     aria-valuenow="70" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="進捗">
</div>

重要なポイント:
• roleを設定したら対応する必須属性も設定
• 視覚的な情報をARIA属性で補完
• 動的な値の変更時はJavaScriptで属性も更新
• スクリーンリーダーでの読み上げを考慮

❌ 悪い例:
<div role="button">ボタン</div>  ← aria-labelなし

✅ 良い例:
<div role="button" aria-label="メニューを開く">☰</div>`;
}

/**
 * リンクのアクセシビリティをチェック（元の実装を復元）
 * @returns {Array} リンクに関する問題リスト
 */
function checkLinkAccessibility() {
  const issues = [];
  
  // リンクのボタン化チェック（改善版）
  const problematicLinksSet = new Set();
  const links = document.querySelectorAll('a');
  
  Array.from(links).forEach(link => {
    // 除外対象要素を除外
    if (isExcludedElement(link)) {
      return;
    }
    
    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');
    const hasJSAction = onclick !== null || link.onclick !== null;
    
    // 以下の場合は問題として検出
    // 1. href が空/# + JavaScriptアクションあり
    // 2. javascript:void(0) を使用（JavaScriptアクションの有無に関わらず）
    const isButtonMisuse = (!href || href === '#') && hasJSAction;
    const hasJSVoid = href === 'javascript:void(0)';
    
    if (isButtonMisuse || hasJSVoid) {
      problematicLinksSet.add(link);
    }
  });
  
  const problematicLinks = Array.from(problematicLinksSet);
  
  if (problematicLinks.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'link_button_misuse',
      name: 'リンクのボタン化',
      message: `${problematicLinks.length}個のリンクがボタンとして誤用されています。href="#"やjavascript:void(0)を使用せず、適切な<button>タグまたは有効なURLを使用してください。`,
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
  return `リンクのボタン化の修正方法:

❌ 現在（リンクのボタン化）:
<a href="#" onclick="doSomething()">ボタン</a>
<a href="javascript:void(0)" onclick="action()">アクション</a>

✅ 修正後（適切なボタン）:
<button type="button" onclick="doSomething()">ボタン</button>
<button type="button" onclick="action()">アクション</button>

正しい使い分け:
• ページ移動・外部リンク → <a href="url">リンク</a>
• JavaScript実行・フォーム操作 → <button>ボタン</button>

具体的な修正例:
❌ <a href="#" onclick="toggleMenu()">メニュー</a>
✅ <button type="button" onclick="toggleMenu()">メニュー</button>

❌ <a href="javascript:void(0)" onclick="submitForm()">送信</a>
✅ <button type="submit" onclick="submitForm()">送信</button>

重要なポイント:
• スクリーンリーダーでリンクとボタンは異なる読み上げ
• キーボードナビゲーションでの挙動が違う
• セマンティックHTMLの観点から適切な要素を使用
• アクセシビリティとユーザビリティの向上

SEO・アクセシビリティへの影響:
• 検索エンジンがページ構造を正しく理解
• 支援技術での適切なナビゲーション
• ユーザーエクスペリエンスの向上`;
}

/**
 * ARIA展開状態の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAriaExpandedSolution() {
  return `ARIA展開状態の設定方法:

基本的な設定:
<button aria-expanded="false" aria-controls="menu">メニュー</button>
<ul id="menu" style="display: none;">...</ul>

ドロップダウンメニューの例:
<button aria-expanded="false" onclick="toggleMenu()">
  ドロップダウン
</button>

アコーディオンの例:
<button aria-expanded="false" aria-controls="content1">
  セクション1
</button>
<div id="content1" style="display: none;">内容</div>

JavaScript設定例:
function toggleMenu() {
  const button = document.querySelector('[aria-controls="menu"]');
  const menu = document.getElementById('menu');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
  button.setAttribute('aria-expanded', !isExpanded);
  menu.style.display = isExpanded ? 'none' : 'block';
}

重要なポイント:
• true/falseの文字列で設定
• 展開・収縮時に動的に更新
• aria-controlsと組み合わせて使用

❌ 悪い例:
<button onclick="toggleMenu()">メニュー</button>  ← aria-expanded なし

✅ 良い例:
<button aria-expanded="false" aria-controls="menu">メニュー</button>`;
}

/**
 * ARIA現在位置の解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getAriaCurrentSolution() {
  return `ARIA現在位置の設定方法:

基本的な設定:
<nav>
  <a href="/home">ホーム</a>
  <a href="/about" aria-current="page">会社概要</a>
  <a href="/contact">お問い合わせ</a>
</nav>

パンくずリストの例:
<nav aria-label="パンくずリスト">
  <a href="/">ホーム</a> &gt;
  <a href="/category">カテゴリ</a> &gt;
  <span aria-current="page">商品詳細</span>
</nav>

ページネーションの例:
<nav aria-label="ページネーション">
  <a href="?page=1">1</a>
  <span aria-current="page">2</span>
  <a href="?page=3">3</a>
</nav>

aria-current の値:
• page: 現在のページ
• step: 多段階プロセスの現在のステップ
• location: 現在の場所
• date: 現在の日付
• time: 現在の時刻
• true: その他の現在項目

重要なポイント:
• 現在位置を明確に示す
• スクリーンリーダーで「現在のページ」と読み上げ
• CSSでの視覚的なスタイリングと組み合わせ

❌ 悪い例:
<a href="/current" class="active">現在のページ</a>  ← aria-current なし

✅ 良い例:
<a href="/current" class="active" aria-current="page">現在のページ</a>`;
}

/**
 * レイアウトテーブルの解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getLayoutTableSolution() {
  return `レイアウト目的のtable使用の修正方法:

❌ 現在（レイアウト目的）:
<table border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>左カラム</td>
    <td>右カラム</td>
  </tr>
</table>

✅ 修正後（CSSレイアウト）:
<div class="layout-container">
  <div class="left-column">左カラム</div>
  <div class="right-column">右カラム</div>
</div>

CSS例:
.layout-container {
  display: flex;
  gap: 20px;
}
.left-column, .right-column {
  flex: 1;
}

またはCSS Grid:
.layout-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

データテーブルの正しい使用例:
<table>
  <caption>売上データ</caption>
  <thead>
    <tr>
      <th>月</th>
      <th>売上</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1月</td>
      <td>100万円</td>
    </tr>
  </tbody>
</table>

重要なポイント:
• tableは表形式データにのみ使用
• レイアウトはCSS（flexbox, grid）を使用
• スクリーンリーダーがテーブルとして誤認識される問題を解決

❌ レイアウト用table
✅ CSS flexbox/grid + セマンティックHTML`;
}

/**
 * レイアウト目的のテーブルをチェック
 * @returns {Array} テーブルに関する問題リスト
 */
function checkLayoutTables() {
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  const layoutTables = Array.from(tables).filter(table => {
    const hasLayoutIndicators = table.hasAttribute('cellpadding') || 
                               table.hasAttribute('cellspacing') || 
                               (table.hasAttribute('border') && table.getAttribute('border') === '0');
    
    const hasTableHeaders = table.querySelectorAll('th').length > 0;
    const hasCaption = table.querySelector('caption') !== null;
    const hasDataIndicators = hasTableHeaders || hasCaption;
    
    return hasLayoutIndicators && !hasDataIndicators;
  });
  
  if (layoutTables.length > 0) {
    issues.push({
      category: 'accessibility',
      severity: SEVERITY.ERROR,
      rule: 'layout_table_usage',
      name: 'レイアウト目的のtable使用',
      message: `${layoutTables.length}個のテーブルがレイアウト目的で使用されています`,
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
  return `alt属性の正しい設定方法:

基本的な設定:
<img src="image.jpg" alt="画像の説明">

画像の種類別の例:
• 商品画像: <img src="shoes.jpg" alt="黒いランニングシューズ">
• 人物写真: <img src="person.jpg" alt="スーツを着た男性が笑顔で立っている">
• 図表・グラフ: <img src="chart.jpg" alt="2024年売上推移グラフ、前年比120%増加">
• ロゴ: <img src="logo.jpg" alt="ABC会社ロゴ">
• 装飾画像: <img src="decoration.jpg" alt="">（空文字でOK）

重要なルール:
• 画像が見えない状況でも内容が伝わる説明
• 単に「画像」「写真」と書かない
• 装飾目的の場合は alt="" を使用
• 長い説明が必要な場合は別途説明文を用意

❌ 悪い例:
<img src="product.jpg" alt="画像">  ← 何の画像か不明
<img src="chart.jpg" alt="グラフ">  ← 内容が不明

✅ 良い例:
<img src="product.jpg" alt="青いデニムジャケット Mサイズ">
<img src="chart.jpg" alt="月別売上グラフ：1月100万円から12月500万円まで右肩上がり">`;
}

/**
 * フォームラベルの解決策テキスト
 * @returns {string} 解決策のテキスト
 */
function getFormLabelSolution() {
  return `フォーム要素のラベル設定方法:

基本的な設定:
<label for="username">ユーザー名</label>
<input type="text" id="username" name="username">

代替方法:
1. aria-label属性を使用:
<input type="email" aria-label="メールアドレス">

2. aria-labelledby属性を使用:
<h3 id="billing">請求先情報</h3>
<input type="text" aria-labelledby="billing">

3. placeholder + title の組み合わせ:
<input type="text" placeholder="例: yamada@example.com" title="メールアドレスを入力">

重要なポイント:
• 全てのフォーム要素に適切なラベルが必要
• ラベルはフォーム要素の目的を明確に示す
• placeholderだけでは不十分（消えてしまうため）

❌ 悪い例:
<input type="text">  ← ラベルが全くない
<input type="email" placeholder="メール">  ← placeholderのみ

✅ 良い例:
<label for="email">メールアドレス</label>
<input type="email" id="email" placeholder="例: user@example.com">`;
}