javascript: (function () {
  "use strict";

  // 設定ファイルの読み込み
  const RULES = {
    rules: [
      {
        id: "missing_h1",
        name: "H1タグの欠落",
        description: "ページにH1タグが存在しません",
        category: "heading",
        severity: "error",
        selector: "h1",
        check: "missing",
        message: "H1タグが設定されていません",
      },
      {
        id: "heading_structure",
        name: "見出し構造の不適切",
        description: "見出しの階層構造が適切ではありません",
        category: "heading",
        severity: "warning",
        check: "structure",
        message: "見出しの階層構造に問題があります",
      },
      {
        id: "old_robots_meta",
        name: "古いROBOTSメタタグ",
        description: "古いROBOTSメタタグの記述が存在します",
        category: "meta",
        severity: "warning",
        selector: "meta[name='ROBOTS']",
        check: "content",
        patterns: ["NOODP", "NOYDIR", "NOARCHIVE"],
        message: "古いROBOTSメタタグの記述が検出されました",
      },
      {
        id: "missing_alt",
        name: "画像のalt属性欠落",
        description: "画像にalt属性が設定されていません",
        category: "accessibility",
        severity: "error",
        selector: "img",
        check: "attribute",
        attribute: "alt",
        message: "alt属性が設定されていません",
      },
      {
        id: "link_as_button",
        name: "リンクのボタン化",
        description: "a要素がボタンとして機能しています",
        category: "accessibility",
        severity: "warning",
        selector: "a",
        check: "button_behavior",
        message:
          "a要素をボタンとして使用しています。button要素の使用を検討してください",
      },
      {
        id: "missing_aria_required",
        name: "必須項目のARIA属性不足",
        description: "必須項目にaria-requiredが設定されていません",
        category: "accessibility",
        severity: "warning",
        selector: "input[required], select[required], textarea[required]",
        check: "aria_required",
        message: "必須項目にaria-required='true'の設定を検討してください",
      },
      {
        id: "missing_aria_expanded",
        name: "展開状態のARIA属性不足",
        description:
          "展開/折りたたみ可能な要素にaria-expandedが設定されていません",
        category: "accessibility",
        severity: "info",
        selector:
          "[data-toggle='collapse'], [data-bs-toggle='collapse'], .accordion, .collapsible",
        check: "aria_expanded",
        message: "展開状態を示すaria-expanded属性の設定を検討してください",
      },
      {
        id: "missing_aria_current",
        name: "現在位置のARIA属性不足",
        description: "ナビゲーションで現在位置が明示されていません",
        category: "accessibility",
        severity: "info",
        selector: "nav a, .breadcrumb a, .pagination a",
        check: "aria_current",
        message: "現在位置を示すaria-current属性の設定を検討してください",
      },
      {
        id: "layout_table_usage",
        name: "レイアウト目的のtable使用",
        description: "table要素がレイアウト目的で使用されています",
        category: "accessibility",
        severity: "error",
        selector: "table",
        check: "layout_usage",
        message:
          "table要素はデータ表用です。レイアウトには適切なHTML要素を使用してください",
      },
      {
        id: "date_in_div",
        name: "日付情報のdiv使用",
        description: "日付情報がdiv要素で記述されています",
        category: "semantic",
        severity: "warning",
        check: "semantic_date",
        message: "日付情報にはtime要素の使用を推奨します（SEO・アクセシビリティ向上）"
      },
      {
        id: "heading_in_div",
        name: "見出し的内容のdiv使用",
        description: "見出しらしき内容がdiv要素で記述されています",
        category: "semantic",
        severity: "warning",
        check: "semantic_heading",
        message: "見出しにはh1-h6要素の使用を推奨します（文書構造の明確化）"
      },
      {
        id: "list_in_div",
        name: "リスト構造のdiv使用",
        description: "リスト的な構造がdiv要素で記述されています",
        category: "semantic",
        severity: "warning",
        check: "semantic_list",
        message: "リスト構造にはul/ol+li要素の使用を推奨します"
      },
      {
        id: "article_in_div",
        name: "記事構造のdiv使用",
        description: "記事的な構造がdiv要素で記述されています",
        category: "semantic",
        severity: "warning",
        check: "semantic_article",
        message: "記事構造にはarticle要素とSchema.orgマークアップを推奨します"
      },
      {
        id: "deprecated_meta_tags",
        name: "廃止されたメタタグ",
        description: "古い・不要なメタタグが使用されています",
        category: "cleanup",
        severity: "warning",
        check: "deprecated_meta",
        message: "廃止されたメタタグを削除することを推奨します"
      },
      {
        id: "legacy_google_analytics",
        name: "古いGoogle Analyticsコード",
        description: "廃止されたUniversal Analytics(UA)コードが検出されました",
        category: "cleanup",
        severity: "error",
        check: "legacy_analytics",
        message: "UAは廃止されました。GA4に移行してください"
      },
      {
        id: "legacy_gtm_container",
        name: "古いGTMコンテナ",
        description: "古いGoogle Tag Managerコンテナが使用されています",
        category: "cleanup",
        severity: "warning",
        check: "legacy_gtm",
        message: "新しいGTMコンテナIDに更新することを推奨します"
      },
      {
        id: "unused_adobe_code",
        name: "不要なAdobe関連コード",
        description: "使用されていないAdobe/SiteCatalyst関連のコードが検出されました",
        category: "cleanup",
        severity: "warning",
        check: "unused_adobe",
        message: "使用されていないAdobe関連コードの削除を推奨します"
      },
      {
        id: "unnecessary_noscript",
        name: "不要なnoscriptタグ",
        description: "空または不要なnoscriptタグが検出されました",
        category: "cleanup",
        severity: "info",
        check: "unnecessary_noscript",
        message: "不要なnoscriptタグの削除を検討してください"
      },
    ],
  };

  let results = [];

  // 共通ユーティリティ関数
  const addResult = (ruleId, elements, customMessage) => {
    const rule = RULES.rules.find(r => r.id === ruleId);
    const message = customMessage || `${elements.length}個の${rule.name}が検出されました`;
    results.push({ rule, elements, message });
  };

  const matchPatterns = (text, patterns) => {
    return patterns.some(pattern => 
      pattern.test ? pattern.test(text) : text.includes(pattern)
    );
  };

  const calculateConfidence = (checks) => {
    return checks.reduce((sum, {condition, weight}) => 
      sum + (condition ? weight : 0), 0
    );
  };

  // パターン定義
  const PATTERNS = {
    date: [
      {pattern: /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日]?/, confidence: 0.9},
      {pattern: /(\d{1,2})[月\-\/](\d{1,2})[日]?[\-～〜](\d{1,2})[月\-\/](\d{1,2})[日]?/, confidence: 0.8},
      {pattern: /(令和|平成|昭和)\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/, confidence: 0.9},
      {pattern: /(\d{4})\/(\d{1,2})\/(\d{1,2})/, confidence: 0.7}
    ],
    heading: [
      {pattern: /^(お知らせ|ニュース|情報|案内|注意|重要|速報)/, confidence: 0.8},
      {pattern: /(について|のお知らせ|のご案内|のご連絡)$/, confidence: 0.7},
      {pattern: /^(営業時間|休業|定休日|時間変更|料金|価格)/, confidence: 0.6},
      {pattern: /^(Q[.\d]*|質問|回答|FAQ)/, confidence: 0.5}
    ],
    dateClasses: [/date/i, /time/i, /publish/i, /created/i, /updated/i, /when/i, /day/i, /month/i, /year/i],
    headingClasses: [/title/i, /heading/i, /header/i, /subject/i, /caption/i, /label/i, /name/i],
    listClasses: [/item/i, /entry/i, /product/i, /card/i, /tile/i, /list/i, /row/i, /cell/i, /block/i, /unit/i],
    articleClasses: [/news/i, /article/i, /post/i, /blog/i, /story/i, /content/i, /entry/i, /item/i]
  };

  // CSSスタイルシートを動的に追加
  function injectHighlightStyles() {
    const styleId = 'html-checker-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .html-checker-highlight-error {
        outline: 3px solid #ff0000 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(255, 0, 0, 0.3) !important;
        position: relative !important;
      }
      
      .html-checker-highlight-warning {
        outline: 3px solid #ffa500 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(255, 165, 0, 0.3) !important;
        position: relative !important;
      }
      
      .html-checker-highlight-error::after,
      .html-checker-highlight-warning::after {
        content: attr(data-checker-message);
        position: absolute;
        top: -35px;
        left: 0;
        background: var(--checker-bg-color);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        white-space: nowrap;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .html-checker-highlight-error::after {
        --checker-bg-color: #ff0000;
      }
      
      .html-checker-highlight-warning::after {
        --checker-bg-color: #ffa500;
      }
      
      .html-checker-highlight-error:hover::after,
      .html-checker-highlight-warning:hover::after {
        opacity: 1;
      }
      
      .html-checker-highlight-error:hover {
        box-shadow: 0 0 0 6px rgba(255, 0, 0, 0.5) !important;
      }
      
      .html-checker-highlight-warning:hover {
        box-shadow: 0 0 0 6px rgba(255, 165, 0, 0.5) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 既存のハイライトを削除
  function removeExistingHighlights() {
    // 既存のスタイルシートを削除
    const existingStyle = document.getElementById('html-checker-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // ハイライトクラスを削除
    const highlightedElements = document.querySelectorAll(
      '.html-checker-highlight-error, .html-checker-highlight-warning'
    );
    
    highlightedElements.forEach(element => {
      element.classList.remove('html-checker-highlight-error', 'html-checker-highlight-warning');
      element.removeAttribute('data-checker-message');
      element.removeAttribute('data-checker-rule-id');
    });
  }

  // 要素をハイライト表示
  function highlightElement(element, rule) {
    // CSSクラスを追加してハイライト
    const className = rule.severity === "error" 
      ? "html-checker-highlight-error" 
      : "html-checker-highlight-warning";
      
    element.classList.add(className);
    element.setAttribute('data-checker-message', rule.message);
    element.setAttribute('data-checker-rule-id', rule.id);
    
    // 要素にIDを付与（ジャンプ用）
    if (!element.id) {
      element.id = `html-checker-${rule.id}-${Date.now()}-${Math.random()}`;
    }
  }

  // H1タグの欠落チェック
  function checkMissingH1() {
    const h1Elements = document.querySelectorAll("h1");
    if (h1Elements.length === 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "missing_h1"),
        elements: [],
        message: "H1タグが設定されていません",
      });
    }
  }

  // 見出し構造のチェック
  function checkHeadingStructure() {
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
    const issues = [];

    if (headings.length === 0) return;

    const headingLevels = headings.map((h) => parseInt(h.tagName.charAt(1)));

    if (headingLevels[0] !== 1) {
      issues.push({
        element: headings[0],
        message: "最初の見出しがH1ではありません",
      });
    }

    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];

      if (current - previous > 1) {
        issues.push({
          element: headings[i],
          message: `見出しレベルが飛び越されています（H${previous} → H${current}）`,
        });
      }
    }

    if (issues.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "heading_structure"),
        elements: issues.map((issue) => issue.element),
        message: "見出しの階層構造に問題があります",
        details: issues,
      });
    }
  }

  // 古いROBOTSメタタグのチェック
  function checkOldRobotsMeta() {
    const robotsMeta = document.querySelector('meta[name="ROBOTS"]');
    if (robotsMeta) {
      const content = robotsMeta.getAttribute("content");
      if (content) {
        const patterns = RULES.rules.find(
          (r) => r.id === "old_robots_meta"
        ).patterns;
        const foundPatterns = patterns.filter((pattern) =>
          content.includes(pattern)
        );

        if (foundPatterns.length > 0) {
          results.push({
            rule: RULES.rules.find((r) => r.id === "old_robots_meta"),
            elements: [robotsMeta],
            message: `古いROBOTSメタタグの記述が検出されました: ${foundPatterns.join(
              ", "
            )}`,
          });
        }
      }
    }
  }

  // 画像のalt属性チェック
  function checkMissingAlt() {
    const images = document.querySelectorAll("img");
    const currentDomain = window.location.hostname;

    const imagesWithoutAlt = Array.from(images).filter((img) => {
      // 自ドメインの画像のみチェック
      const imgSrc = img.src || img.getAttribute("src");
      if (!imgSrc) return false;

      try {
        const imgUrl = new URL(imgSrc, window.location.href);
        const isSameDomain = imgUrl.hostname === currentDomain;

        // 自ドメインの画像でalt属性が設定されていない場合のみ対象
        if (isSameDomain) {
          const alt = img.getAttribute("alt");
          return !alt || alt.trim() === "";
        }
        return false;
      } catch (e) {
        // 相対パスの場合は自ドメインとみなす
        if (
          imgSrc.startsWith("/") ||
          imgSrc.startsWith("./") ||
          imgSrc.startsWith("../") ||
          !imgSrc.includes("://")
        ) {
          const alt = img.getAttribute("alt");
          return !alt || alt.trim() === "";
        }
        return false;
      }
    });

    if (imagesWithoutAlt.length > 0) {
      addResult("missing_alt", imagesWithoutAlt,
        `${imagesWithoutAlt.length}個の自ドメイン画像にalt属性が設定されていません`);
    }
  }

  // リンクのボタン化チェック
  function checkLinkAsButton() {
    const links = document.querySelectorAll("a");
    const buttonLikeLinks = Array.from(links).filter((link) => {
      const href = link.getAttribute("href");
      const onclick = link.getAttribute("onclick");
      const text = link.textContent.trim().toLowerCase();

      // ボタン的な動作を示すパターン
      const buttonPatterns = [
        "javascript:void(0)",
        "javascript:;",
        "#",
        "javascript:void(0);",
        "javascript:void(0);",
      ];

      // ボタン的なテキストパターン
      const buttonTextPatterns = [
        "カートに入れる",
        "購入する",
        "注文する",
        "追加する",
        "削除する",
        "編集する",
        "更新する",
        "送信する",
        "確認する",
        "実行する",
        "開始する",
        "停止する",
        "保存する",
        "キャンセル",
        "閉じる",
        "戻る",
        "進む",
        "検索",
        "ログイン",
        "ログアウト",
        "登録",
        "削除",
        "編集",
        "更新",
        "送信",
        "確認",
        "実行",
        "開始",
        "停止",
        "保存",
      ];

      // 除外すべきテキストパターン（説明文、手順など）
      const excludePatterns = [
        "step",
        "ステップ",
        "手順",
        "説明",
        "詳細",
        "概要",
        "紹介",
        "案内",
        "ガイド",
        "チュートリアル",
        "マイページ",
        "ページ",
        "商品",
        "返品",
        "登録",
        "から",
        "する",
        "の",
        "を",
        "に",
        "が",
        "は",
        "も",
        "や",
        "と",
        "で",
        "へ",
        "まで",
        "より",
        "だけ",
        "ばかり",
        "くらい",
        "ほど",
        "など",
        "なんか",
        "なんて",
        "こそ",
        "さえ",
        "でも",
        "しか",
        "だって",
        "って",
        "たら",
        "れば",
        "なら",
        "のに",
        "ので",
      ];

      // ボタン的な動作の判定
      const hasButtonBehavior = buttonPatterns.some(
        (pattern) => href === pattern || (href && href.includes(pattern))
      );

      // onclick属性の存在
      const hasOnclick = !!onclick;

      // ボタン的なテキスト
      const hasButtonText = buttonTextPatterns.some((pattern) =>
        text.includes(pattern)
      );

      // 除外パターンに該当する場合は除外
      const hasExcludePattern = excludePatterns.some((pattern) =>
        text.includes(pattern)
      );

      // ボタンとして機能していると判定される条件
      // 除外パターンに該当する場合はfalseを返す
      if (hasExcludePattern) {
        return false;
      }

      return (hasButtonBehavior || hasOnclick) && hasButtonText;
    });

    if (buttonLikeLinks.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "link_as_button"),
        elements: buttonLikeLinks,
        message: `${buttonLikeLinks.length}個のリンクがボタンとして機能しています`,
      });
    }
  }


  // 必須項目のARIA属性不足チェック
  function checkMissingAriaRequired() {
    const requiredElements = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    const elementsWithoutAriaRequired = Array.from(requiredElements).filter(
      (element) => {
        return !element.getAttribute("aria-required");
      }
    );

    if (elementsWithoutAriaRequired.length > 0) {
      addResult("missing_aria_required", elementsWithoutAriaRequired, 
        `${elementsWithoutAriaRequired.length}個の必須項目にaria-required属性の設定が推奨されます`);
    }
  }

  // 展開状態のARIA属性不足チェック
  function checkMissingAriaExpanded() {
    const collapsibleElements = document.querySelectorAll(
      "[data-toggle='collapse'], [data-bs-toggle='collapse'], .accordion, .collapsible"
    );
    const elementsWithoutAriaExpanded = Array.from(collapsibleElements).filter(
      (element) => {
        return !element.getAttribute("aria-expanded");
      }
    );

    if (elementsWithoutAriaExpanded.length > 0) {
      addResult("missing_aria_expanded", elementsWithoutAriaExpanded,
        `${elementsWithoutAriaExpanded.length}個の展開可能要素にaria-expanded属性の設定が推奨されます`);
    }
  }

  // 現在位置のARIA属性不足をチェック
  function checkMissingAriaCurrent() {
    const navigationLinks = document.querySelectorAll(
      "nav a, .breadcrumb a, .pagination a"
    );

    const linksWithoutAriaCurrent = Array.from(navigationLinks).filter(
      (link) => {
        const href = link.getAttribute("href");
        const currentPath = window.location.pathname;

        // 現在のページかどうかを判定
        const isCurrentPage =
          href === currentPath ||
          href === window.location.href ||
          (href && href !== "#" && currentPath.includes(href));

        return isCurrentPage && !link.getAttribute("aria-current");
      }
    );

    if (linksWithoutAriaCurrent.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "missing_aria_current"),
        elements: linksWithoutAriaCurrent,
        message: `${linksWithoutAriaCurrent.length}個のナビゲーション要素にaria-current属性の設定が推奨されます`,
      });
    }
  }

  // レイアウト目的のtable使用をチェック
  function checkLayoutTableUsage() {
    const tables = document.querySelectorAll("table");
    const layoutTables = Array.from(tables).filter((table) => {
      // データ表らしくない特徴をチェック
      const hasTh = table.querySelector("th");
      const hasWidthAttr = table.querySelector("[width]");
      const hasLayoutAttr = table.querySelector("[align], [valign], [bgcolor]");
      const hasBlockElements = table.querySelector(
        "td div, td section, td nav"
      );
      const hasHeadings = table.querySelector(
        "td h1, td h2, td h3, td h4, td h5, td h6"
      );
      const hasLayoutClasses = table.querySelector(
        ".layout, .grid, .container, .wrapper"
      );

      // レイアウト目的の可能性が高い場合
      return (
        !hasTh &&
        (hasWidthAttr ||
          hasLayoutAttr ||
          hasBlockElements ||
          hasHeadings ||
          hasLayoutClasses)
      );
    });

    if (layoutTables.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "layout_table_usage"),
        elements: layoutTables,
        message: `${layoutTables.length}個のtable要素がレイアウト目的で使用されている可能性があります`,
      });
    }
  }

  // セマンティックHTML検知関数群

  // 1. 日付情報のdiv使用検知
  function checkDateInDiv() {
    const datePatterns = [
      {
        pattern: /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日]?/,
        confidence: 0.9,
        type: "single_date"
      },
      {
        pattern: /(\d{1,2})[月\-\/](\d{1,2})[日]?[\-～〜](\d{1,2})[月\-\/](\d{1,2})[日]?/,
        confidence: 0.8,
        type: "date_range"
      },
      {
        pattern: /(令和|平成|昭和)\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/,
        confidence: 0.9,
        type: "japanese_era"
      },
      {
        pattern: /(\d{4})\/(\d{1,2})\/(\d{1,2})/,
        confidence: 0.7,
        type: "slash_format"
      }
    ];

    const dateClasses = [
      /date/i, /time/i, /publish/i, /created/i, /updated/i,
      /when/i, /day/i, /month/i, /year/i
    ];

    const divs = document.querySelectorAll('div');
    const problematicDivs = [];

    Array.from(divs).forEach(div => {
      const text = div.textContent.trim();
      const className = div.className.toLowerCase();
      
      const matchedPattern = datePatterns.find(dp => dp.pattern.test(text));
      const hasDateClass = dateClasses.some(dc => dc.test(className));
      const hasTimeElement = div.querySelector('time');
      const isShortText = text.length < 50;
      const digitRatio = (text.match(/\d/g) || []).length / text.length;
      
      const confidence = calculateConfidence([
        {condition: matchedPattern, weight: matchedPattern?.confidence || 0},
        {condition: hasDateClass, weight: 0.6},
        {condition: isShortText && digitRatio > 0.3, weight: 0.4}
      ]);
      
      if (!hasTimeElement && confidence >= 0.7) {
        problematicDivs.push(div);
      }
    });

    if (problematicDivs.length > 0) {
      addResult("date_in_div", problematicDivs);
    }
  }

  // 2. 見出し的内容のdiv使用検知
  function checkHeadingInDiv() {
    const headingPatterns = [
      {
        pattern: /^(お知らせ|ニュース|情報|案内|注意|重要|速報)/,
        confidence: 0.8
      },
      {
        pattern: /(について|のお知らせ|のご案内|のご連絡)$/,
        confidence: 0.7
      },
      {
        pattern: /^(営業時間|休業|定休日|時間変更|料金|価格)/,
        confidence: 0.6
      },
      {
        pattern: /^(Q[.\d]*|質問|回答|FAQ)/,
        confidence: 0.5
      }
    ];

    const headingClasses = [
      /title/i, /heading/i, /header/i, /subject/i,
      /caption/i, /label/i, /name/i
    ];

    const divs = document.querySelectorAll('div');
    const problematicDivs = [];

    Array.from(divs).forEach(div => {
      const text = div.textContent.trim();
      const className = div.className.toLowerCase();
      
      const isHeadingLength = text.length >= 5 && text.length <= 50;
      const isSingleLine = !text.includes('\n');
      const matchedPattern = headingPatterns.find(hp => hp.pattern.test(text));
      const hasHeadingClass = headingClasses.some(hc => hc.test(className));
      const isInArticleOrSection = div.closest('article, section, main');
      
      const computedStyle = window.getComputedStyle(div);
      const fontSize = parseFloat(computedStyle.fontSize);
      const isLargeFont = fontSize > 16;
      const isBold = computedStyle.fontWeight === 'bold' || 
                     parseInt(computedStyle.fontWeight) >= 600;
      
      const hasChildHeadings = div.querySelector('h1, h2, h3, h4, h5, h6');
      const isFormLabel = div.closest('label, fieldset');
      
      // 除外パターン（金額、数値表示など）
      const excludePatterns = [
        /￥[\d,]+/,  // 日本円表示
        /\$[\d,.]+/,   // ドル表示
        /€[\d,.]+/,   // ユーロ表示
        /[\d,]+円/,   // 数字+円
        /（税込）/,    // 税込み表示
        /（税抜）/,    // 税抜き表示
        /^[\d,]+$/,    // 数字のみ
        /ポイント/,    // ポイント関連
        /割引/        // 割引関連
      ];
      const hasExcludePattern = excludePatterns.some(pattern => pattern.test(text));
      
      let confidence = 0;

      if (matchedPattern) {
        confidence += matchedPattern.confidence;
      }

      if (hasHeadingClass) {
        confidence += 0.7;
      }

      if (isHeadingLength && isSingleLine) {
        confidence += 0.4;
      }

      if (isLargeFont) {
        confidence += 0.3;
      }

      if (isBold) {
        confidence += 0.2;
      }

      if (isInArticleOrSection) {
        confidence += 0.2;
      }

      // 除外条件
      if (hasChildHeadings || isFormLabel || hasExcludePattern) {
        confidence = 0;
      }

      if (confidence >= 0.8) {
        problematicDivs.push(div);
      }
    });

    if (problematicDivs.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "heading_in_div"),
        elements: problematicDivs,
        message: `${problematicDivs.length}個の見出し的内容でdiv要素が使用されています`,
      });
    }
  }

  // 3. リスト構造のdiv使用検知
  function checkListInDiv() {
    const containers = new Map();
    
    document.querySelectorAll('div').forEach(div => {
      const parent = div.parentElement;
      if (!containers.has(parent)) {
        containers.set(parent, []);
      }
      containers.get(parent).push(div);
    });

    const problematicContainers = [];

    containers.forEach((children, parent) => {
      if (children.length < 3) return;
      
      const classGroups = new Map();
      children.forEach(child => {
        const className = child.className.trim();
        if (className) {
          if (!classGroups.has(className)) {
            classGroups.set(className, []);
          }
          classGroups.get(className).push(child);
        }
      });

      classGroups.forEach((elements, className) => {
        if (elements.length < 3) return;
        
        const listClassPatterns = [
          /item/i, /entry/i, /product/i, /card/i, /tile/i,
          /list/i, /row/i, /cell/i, /block/i, /unit/i
        ];
        
        const hasListClass = listClassPatterns.some(pattern => 
          pattern.test(className)
        );

        const structures = elements.map(el => {
          return {
            childCount: el.children.length,
            textLength: el.textContent.trim().length
          };
        });

        const avgChildCount = structures.reduce((sum, s) => sum + s.childCount, 0) / structures.length;
        const uniformity = structures.every(s => 
          Math.abs(s.childCount - avgChildCount) <= 1
        );

        const parentClassName = parent.className.toLowerCase();
        const parentListPatterns = [
          /list/i, /items/i, /products/i, /menu/i, /nav/i,
          /grid/i, /collection/i, /group/i
        ];
        
        const parentHasListClass = parentListPatterns.some(pattern =>
          pattern.test(parentClassName)
        );

        const positions = elements.map(el => Array.from(parent.children).indexOf(el));
        const isConsecutive = positions.every((pos, index) => 
          index === 0 || pos === positions[index - 1] + 1
        );

        const hasExistingList = parent.querySelector('ul, ol, dl');

        let confidence = 0;

        if (hasListClass) {
          confidence += 0.6;
        }

        if (uniformity) {
          confidence += 0.4;
        }

        if (parentHasListClass) {
          confidence += 0.3;
        }

        if (isConsecutive) {
          confidence += 0.2;
        }

        if (elements.length >= 5) {
          confidence += 0.2;
        }

        if (hasExistingList) {
          confidence *= 0.3;
        }

        if (confidence >= 0.7) {
          problematicContainers.push(...elements);
        }
      });
    });

    if (problematicContainers.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "list_in_div"),
        elements: problematicContainers,
        message: `${problematicContainers.length}個の要素でリスト構造のdiv使用が検出されました`,
      });
    }
  }

  // 4. 記事構造のdiv使用検知
  function checkArticleInDiv() {
    const divs = document.querySelectorAll('div');
    const problematicDivs = [];

    Array.from(divs).forEach(div => {
      const articleClasses = [
        /news/i, /article/i, /post/i, /blog/i, /story/i,
        /content/i, /entry/i, /item/i
      ];
      
      const hasArticleClass = articleClasses.some(pattern =>
        pattern.test(div.className)
      );

      const dateSelectors = [
        '[class*="date"]', '[class*="time"]', '[class*="publish"]',
        '[class*="created"]', '[class*="updated"]'
      ];
      
      const hasDateElement = dateSelectors.some(selector => 
        div.querySelector(selector)
      );

      const titleSelectors = [
        '[class*="title"]', '[class*="heading"]', '[class*="subject"]',
        '[class*="headline"]', '[class*="caption"]'
      ];
      
      const hasTitleElement = titleSelectors.some(selector => 
        div.querySelector(selector)
      );

      const contentSelectors = [
        '[class*="content"]', '[class*="body"]', '[class*="text"]',
        '[class*="description"]', '[class*="summary"]'
      ];
      
      const hasContentElement = contentSelectors.some(selector => 
        div.querySelector(selector)
      );

      const fullText = div.textContent.trim();
      const textLength = fullText.length;
      const hasArticleLength = textLength >= 100;
      
      const datePatterns = [
        /\d{4}[年\-\/]\d{1,2}[月\-\/]\d{1,2}[日]?/,
        /\d{1,2}[月\-\/]\d{1,2}[日]?/
      ];
      
      const hasDateInText = datePatterns.some(pattern => pattern.test(fullText));

      const hasMultipleParagraphs = div.querySelectorAll('p, div').length >= 2;

      const hasExistingArticle = div.querySelector('article');
      const isInsideArticle = div.closest('article');
      
      // 除外条件を強化
      const excludeConditions = [
        hasExistingArticle,
        isInsideArticle,
        textLength < 50,  // 短すぎるテキスト
        div.closest('nav, aside, footer, header'),  // ナビやサイドバー
        div.closest('.sidebar, .widget, .banner'),  // サイドバーやウィジェット
        !hasDateElement && !hasTitleElement,  // 日付もタイトルもなし
        /￥[\d,]+|ポイント|割引/.test(fullText)  // 金額・ポイント情報
      ];
      
      // 除外条件に該当する場合はスキップ
      if (excludeConditions.some(condition => condition)) {
        return;
      }

      let confidence = 0;

      // 基本条件を厳しく調整
      if (hasArticleClass) {
        confidence += 0.5;  // 0.7 → 0.5
      }

      if (hasDateElement && hasTitleElement) {
        confidence += 0.6;  // 0.8 → 0.6
      }

      if (hasContentElement) {
        confidence += 0.3;  // 0.4 → 0.3
      }

      if (hasArticleLength) {
        confidence += 0.2;  // 0.3 → 0.2
      }

      if (hasDateInText) {
        confidence += 0.1;  // 0.2 → 0.1
      }

      if (hasMultipleParagraphs) {
        confidence += 0.2;  // 変更なし
      }
      
      // 追加的な証拠を要求
      const hasStrongEvidence = (
        (hasArticleClass && hasDateElement && hasContentElement) ||  // クラス+日付+コンテンツ
        (hasTitleElement && hasContentElement && hasDateInText && textLength >= 200)  // タイトル+コンテンツ+日付+長文
      );
      
      if (!hasStrongEvidence) {
        confidence *= 0.5;  // 強い証拠がない場合は半減
      }

      // 闾値を上げて厳格化
      if (confidence >= 1.0) {  // 0.8 → 1.0
        problematicDivs.push(div);
      }
    });

    if (problematicDivs.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "article_in_div"),
        elements: problematicDivs,
        message: `${problematicDivs.length}個の記事構造でdiv要素が使用されています`,
      });
    }
  }

  // クリーンアップチェック関数群

  // 1. 廃止されたメタタグの検知（既存のold_robots_metaを拡張）
  function checkDeprecatedMetaTags() {
    const deprecatedSelectors = [
      'meta[name="keywords"]',        // SEO効果なし
      'meta[http-equiv="Pragma"]',    // 古いキャッシュ制御
      'meta[http-equiv="expires"][content="0"]' // 古いexpires指定
    ];

    const problematicElements = [];
    
    deprecatedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      Array.from(elements).forEach(element => {
        // Cache-Controlの条件付きチェック
        if (element.getAttribute('http-equiv') === 'Cache-Control') {
          const parent = element.closest('sly[data-sly-test*="enableNoCacheTag"]');
          if (!parent) {
            problematicElements.push(element);
          }
        } else {
          problematicElements.push(element);
        }
      });
    });

    if (problematicElements.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "deprecated_meta_tags"),
        elements: problematicElements,
        message: `${problematicElements.length}個の廃止されたメタタグが検出されました`,
      });
    }
  }

  // 2. 古いGoogle Analytics(UA)の検知
  function checkLegacyGoogleAnalytics() {
    const scripts = document.querySelectorAll('script');
    const problematicElements = [];
    
    const uaPatterns = [
      /UA-\d+-\d+/,           // UAトラッキングID
      /_gat\._getTracker/,    // 古いAPI
      /pageTracker/,          // 古い変数名
      /google-analytics\.com\/ga\.js/ // 古いライブラリ
    ];

    Array.from(scripts).forEach(script => {
      const content = script.textContent || script.innerHTML;
      const src = script.src;
      
      const hasLegacyPattern = uaPatterns.some(pattern => {
        return pattern.test(content) || pattern.test(src);
      });
      
      if (hasLegacyPattern) {
        problematicElements.push(script);
      }
    });

    if (problematicElements.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "legacy_google_analytics"),
        elements: problematicElements,
        message: `${problematicElements.length}個の古いGoogle Analyticsコードが検出されました`,
      });
    }
  }

  // 3. 古いGTMコンテナの検知
  function checkLegacyGTMContainer() {
    const scripts = document.querySelectorAll('script');
    const problematicElements = [];
    
    const legacyGTMIds = [
      'GTM-MJ66RZD' // メモで指定された旧ID
    ];

    Array.from(scripts).forEach(script => {
      const content = script.textContent || script.innerHTML;
      const src = script.src;
      
      const hasLegacyGTM = legacyGTMIds.some(gtmId => {
        return content.includes(gtmId) || src.includes(gtmId);
      });
      
      if (hasLegacyGTM) {
        problematicElements.push(script);
      }
    });

    // GTM用のnoscriptタグもチェック
    const noscripts = document.querySelectorAll('noscript');
    Array.from(noscripts).forEach(noscript => {
      const content = noscript.innerHTML;
      const hasLegacyGTM = legacyGTMIds.some(gtmId => content.includes(gtmId));
      
      if (hasLegacyGTM) {
        problematicElements.push(noscript);
      }
    });

    if (problematicElements.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "legacy_gtm_container"),
        elements: problematicElements,
        message: `${problematicElements.length}個の古いGTMコンテナが検出されました`,
      });
    }
  }

  // 4. 不要なAdobe関連コードの検知
  function checkUnusedAdobeCode() {
    const scripts = document.querySelectorAll('script');
    const problematicElements = [];
    
    const adobePatterns = [
      /\/sitecatalyst\/s_code\.js/,
      /\/sitecatalyst\/s_code_signal\.js/,
      /s_gi\s*\(/,
      /sendSiteCatalyst/,
      /sendSiteCatalystTimer/
    ];

    Array.from(scripts).forEach(script => {
      const content = script.textContent || script.innerHTML;
      const src = script.src;
      
      const hasAdobePattern = adobePatterns.some(pattern => {
        return pattern.test(content) || pattern.test(src);
      });
      
      if (hasAdobePattern) {
        problematicElements.push(script);
      }
    });

    if (problematicElements.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "unused_adobe_code"),
        elements: problematicElements,
        message: `${problematicElements.length}個の不要なAdobe関連コードが検出されました`,
      });
    }
  }

  // 5. 不要なnoscriptタグの検知
  function checkUnnecessaryNoscript() {
    const noscripts = document.querySelectorAll('noscript');
    const problematicElements = [];
    
    Array.from(noscripts).forEach(noscript => {
      const content = noscript.innerHTML.trim();
      
      // 空のnoscriptタグ
      if (!content) {
        problematicElements.push(noscript);
        return;
      }
      
      // Google広告用の不要と思われるnoscript（メモの例）
      const unnecessaryPatterns = [
        /googleadservices\.com\/pagead\/conversion/,
        /height="1"\s+width="1"/,
        /style="border-style:none;"/
      ];
      
      const isUnnecessary = unnecessaryPatterns.every(pattern => 
        pattern.test(content)
      );
      
      if (isUnnecessary) {
        problematicElements.push(noscript);
      }
    });

    if (problematicElements.length > 0) {
      results.push({
        rule: RULES.rules.find((r) => r.id === "unnecessary_noscript"),
        elements: problematicElements,
        message: `${problematicElements.length}個の不要なnoscriptタグが検出されました`,
      });
    }
  }

  // 要素にジャンプする関数
  function jumpToElement(element) {
    // 要素が表示されるまでスクロール
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    // 一時的にハイライトを強調
    const originalOutline = element.style.outline;
    const originalOutlineOffset = element.style.outlineOffset;

    element.style.outline = "5px solid #ffff00";
    element.style.outlineOffset = "3px";

    setTimeout(() => {
      element.style.outline = originalOutline;
      element.style.outlineOffset = originalOutlineOffset;
    }, 2000);
  }

  // 結果の表示
  function displayResults() {
    const panel = document.createElement("div");
    panel.id = "html-checker-panel";
    panel.style.cssText =
      "position: fixed; top: 20px; right: 20px; width: 450px; max-height: 80vh; background: white; border: 2px solid #333; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10001; font-family: Arial, sans-serif; font-size: 14px; overflow-y: auto;";

    const header = document.createElement("div");
    header.style.cssText =
      "background: #333; color: white; padding: 10px 15px; font-weight: bold; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;";
    header.innerHTML =
      '<span>HTML Checker Results</span><button id="close-panel" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>';

    const content = document.createElement("div");
    content.style.padding = "15px";

    if (results.length === 0) {
      content.innerHTML =
        '<p style="color: green; text-align: center;">🎉 問題は検出されませんでした！</p>';
    } else {
      const summary = document.createElement("div");
      summary.style.cssText =
        "margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-weight: bold;";
      summary.textContent = `検出された問題: ${results.length}件`;
      content.appendChild(summary);

      results.forEach((result, index) => {
        const issueDiv = document.createElement("div");
        issueDiv.style.cssText = `margin-bottom: 15px; padding: 10px; border-left: 4px solid ${
          result.rule.severity === "error" ? "#ff0000" : "#ffa500"
        }; background: ${
          result.rule.severity === "error" ? "#fff5f5" : "#fffbf0"
        };`;

        const title = document.createElement("div");
        title.style.cssText =
          "font-weight: bold; margin-bottom: 5px; color: #333;";
        title.textContent = result.rule.name;

        const message = document.createElement("div");
        message.style.cssText = "margin-bottom: 5px; color: #666;";
        message.textContent = result.message;

        const count = document.createElement("div");
        count.style.cssText =
          "font-size: 12px; color: #999; margin-bottom: 10px;";
        count.textContent = `対象要素: ${result.elements.length}個`;

        issueDiv.appendChild(title);
        issueDiv.appendChild(message);
        issueDiv.appendChild(count);

        // 要素リストを表示（クリック可能）
        if (result.elements && result.elements.length > 0) {
          const elementsList = document.createElement("div");
          elementsList.style.cssText = "margin-top: 8px;";

          result.elements.forEach((element, elementIndex) => {
            const elementItem = document.createElement("div");
            elementItem.style.cssText = `
              padding: 5px 8px; 
              margin: 2px 0; 
              background: rgba(0,0,0,0.05); 
              border-radius: 3px; 
              cursor: pointer; 
              font-size: 12px;
              border-left: 3px solid ${
                result.rule.severity === "error" ? "#ff0000" : "#ffa500"
              };
              transition: background-color 0.2s ease;
            `;

            // 要素の内容を表示（画像の場合はsrc、テキストの場合は内容）
            let elementText = "";
            if (element.tagName === "IMG") {
              const src = element.src || element.getAttribute("src");
              elementText = `画像: ${src ? src.split("/").pop() : "src不明"}`;
            } else if (element.tagName === "META") {
              elementText = `メタタグ: ${
                element.getAttribute("name") || "name不明"
              }`;
            } else {
              elementText = element.textContent
                ? element.textContent.substring(0, 50) +
                  (element.textContent.length > 50 ? "..." : "")
                : element.tagName.toLowerCase();
            }

            elementItem.textContent = elementText;
            elementItem.title = "クリックして該当要素にジャンプ";


            // ホバー効果
            elementItem.addEventListener("mouseenter", () => {
              elementItem.style.backgroundColor = "rgba(0,0,0,0.1)";
            });

            elementItem.addEventListener("mouseleave", () => {
              elementItem.style.backgroundColor = "rgba(0,0,0,0.05)";
            });

            // クリックでジャンプ
            elementItem.addEventListener("click", () => {
              jumpToElement(element);
            });

            elementsList.appendChild(elementItem);
          });

          issueDiv.appendChild(elementsList);
        }

        content.appendChild(issueDiv);
      });
    }

    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);

    document.getElementById("close-panel").addEventListener("click", () => {
      panel.remove();
      removeExistingHighlights();
    });
  }

  // メイン実行関数
  function runChecks() {
    results = [];
    removeExistingHighlights();
    
    // CSSスタイルを注入
    injectHighlightStyles();

    checkMissingH1();
    checkHeadingStructure();
    checkOldRobotsMeta();
    checkMissingAlt();
    checkLinkAsButton();
    checkMissingAriaRequired();
    checkMissingAriaExpanded();
    checkMissingAriaCurrent();
    checkLayoutTableUsage();
    
    // セマンティックHTML検知
    checkDateInDiv();
    checkHeadingInDiv();
    checkListInDiv();
    checkArticleInDiv();
    
    // クリーンアップ検知
    checkDeprecatedMetaTags();
    checkLegacyGoogleAnalytics();
    checkLegacyGTMContainer();
    checkUnusedAdobeCode();
    checkUnnecessaryNoscript();

    displayResults();

    // 問題のある要素をハイライト
    results.forEach((result) => {
      if (result.elements && result.elements.length > 0) {
        result.elements.forEach((element) => {
          highlightElement(element, result.rule);
        });
      }
    });
  }

  runChecks();
})();
