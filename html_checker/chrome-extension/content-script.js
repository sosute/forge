// 完全機能版 Content Script - Pure JavaScript (ES Modules不使用) + ドロワーUI
(function() {
  'use strict';
  
  console.log('[HTML Semantic Checker] Full Content Script loading...');

  // 重複注入防止
  if (window.__htmlSemanticCheckerLoaded) {
    console.log('[Content Script] Already loaded, skipping...');
    return;
  }
  window.__htmlSemanticCheckerLoaded = true;

  // 基本設定
  const config = {
    debug: true,
    enabledRules: ['all'] // すべてのルールを有効
  };

  // ドロワーUI用のグローバル変数
  let drawerElement = null;
  let selectedElement = null;
  let highlightedElements = [];
  let drawerOpen = false;
  let drawerContentCollapsed = false;

  // セマンティックチェッカー本体
  class HTMLSemanticChecker {
    constructor() {
      this.isInitialized = false;
      this.checkResults = null;
    }

    initialize() {
      if (this.isInitialized) return;
      
      console.log('[Checker] Initializing...');
      this.isInitialized = true;
    }

    // 完全なページ分析（bookmarkletと同等機能）
    performFullCheck() {
      console.log('[Checker] Starting full semantic analysis...');
      
      const results = {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        
        // 基本統計
        statistics: {
          totalElements: document.querySelectorAll('*').length,
          headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          images: document.querySelectorAll('img').length,
          links: document.querySelectorAll('a').length,
          forms: document.querySelectorAll('form').length,
          tables: document.querySelectorAll('table').length
        },
        
        // セマンティック要素分析
        semantic: {
          header: document.querySelectorAll('header').length,
          nav: document.querySelectorAll('nav').length,
          main: document.querySelectorAll('main').length,
          article: document.querySelectorAll('article').length,
          section: document.querySelectorAll('section').length,
          aside: document.querySelectorAll('aside').length,
          footer: document.querySelectorAll('footer').length
        },
        
        // 見出し構造分析
        headingStructure: this.analyzeHeadingStructure(),
        
        // アクセシビリティ分析
        accessibility: this.analyzeAccessibility(),
        
        // SEO要素分析
        seo: this.analyzeSEO(),
        
        // HTML構造品質
        structure: this.analyzeStructure(),
        
        // パフォーマンス指標
        performance: this.analyzePerformance(),

        // 詳細な問題検出（bookmarklet形式）
        issues: this.detectIssues()
      };
      
      this.checkResults = results;
      console.log('[Checker] Full analysis completed:', results);
      
      // ドロワーUIで結果を表示
      displayResultsInDrawer(results);
      
      // 全問題要素を軽くハイライト（bookmarklet準拠）
      highlightAllIssueElements(results);
      
      return results;
    }

    analyzeHeadingStructure() {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const structure = {
        total: headings.length,
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        h3Count: document.querySelectorAll('h3').length,
        h4Count: document.querySelectorAll('h4').length,
        h5Count: document.querySelectorAll('h5').length,
        h6Count: document.querySelectorAll('h6').length,
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

    analyzeAccessibility() {
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

    analyzeSEO() {
      const metaDescription = document.querySelector('meta[name="description"]');
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      
      return {
        title: {
          exists: !!document.title,
          length: document.title.length,
          isOptimal: document.title.length >= 30 && document.title.length <= 60
        },
        metaDescription: {
          exists: !!metaDescription,
          length: metaDescription ? metaDescription.getAttribute('content').length : 0,
          isOptimal: metaDescription ? 
            metaDescription.getAttribute('content').length >= 120 && 
            metaDescription.getAttribute('content').length <= 160 : false
        },
        hasKeywords: !!metaKeywords,
        hasCanonical: !!canonicalLink,
        openGraph: {
          hasOgTitle: !!document.querySelector('meta[property="og:title"]'),
          hasOgDescription: !!document.querySelector('meta[property="og:description"]'),
          hasOgImage: !!document.querySelector('meta[property="og:image"]')
        }
      };
    }

    analyzeStructure() {
      return {
        hasDoctype: document.doctype !== null,
        hasLang: document.documentElement.hasAttribute('lang'),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasCharset: !!document.querySelector('meta[charset]'),
        semanticElements: {
          total: document.querySelectorAll('header, nav, main, article, section, aside, footer').length,
          ratio: document.querySelectorAll('header, nav, main, article, section, aside, footer').length / 
                 document.querySelectorAll('div').length || 0
        }
      };
    }

    analyzePerformance() {
      return {
        totalElements: document.querySelectorAll('*').length,
        totalImages: document.querySelectorAll('img').length,
        totalScripts: document.querySelectorAll('script').length,
        totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        domDepth: this.calculateDOMDepth(),
        bodySize: document.body ? document.body.innerHTML.length : 0
      };
    }

    calculateDOMDepth() {
      let maxDepth = 0;
      
      function traverse(element, depth) {
        maxDepth = Math.max(maxDepth, depth);
        for (let child of element.children) {
          traverse(child, depth + 1);
        }
      }
      
      if (document.body) {
        traverse(document.body, 1);
      }
      
      return maxDepth;
    }

    // bookmarklet形式の詳細問題検出
    detectIssues() {
      console.log('[Checker] Starting issue detection for:', window.location.href);
      const issues = [];

      // H1タグチェック
      const h1Elements = document.querySelectorAll('h1');
      console.log('[Checker] H1 elements found:', h1Elements.length);
      if (h1Elements.length === 0) {
        issues.push({
          category: 'heading',
          severity: 'error',
          rule: 'missing_h1',
          name: 'H1タグの欠落',
          message: 'ページにH1タグがありません。H1はページのメインタイトルを表し、SEOとアクセシビリティの観点から必須です。検索エンジンとスクリーンリーダーがページの主題を理解できません。',
          elements: [document.body],
          solution: `H1タグの追加方法:

基本的な追加:
<h1>ページのメインタイトル</h1>

具体例:
• 商品ページ: <h1>商品名</h1>
• 記事ページ: <h1>記事タイトル</h1>  
• サービスページ: <h1>サービス名</h1>
• 会社情報: <h1>会社概要</h1>

重要な注意点:
• H1は1ページに1つだけ
• ページの最も重要な内容を表す
• ロゴやサイト名ではなく、そのページ固有の内容
• 他の見出し（H2, H3等）より前に配置

❌ 避けるべき例:
<h1>ようこそ</h1>  ← 汎用的すぎる
<h1>サイト名</h1>  ← サイト名はH1に不適切

✅ 良い例:
<h1>HTML セマンティックチェッカーの使い方</h1>  ← 具体的で有用`
        });
      }

      // 見出し構造チェック（詳細分析付き）
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log('[Checker] Total headings found:', headings.length);
      const problematicHeadings = [];
      const headingStructureProblems = [];
      let previousLevel = 0;

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const rawText = heading.textContent.trim();
        const headingText = rawText.substring(0, 30) + (rawText.length > 30 ? '...' : '');
        
        console.log(`[Checker] Processing heading ${index + 1}: H${level} "${headingText}" (previous: H${previousLevel})`);
        
        // 空の見出しチェック
        if (rawText.length === 0) {
          console.log(`[Checker] Empty heading detected: H${level}`);
          problematicHeadings.push(heading);
          headingStructureProblems.push({
            element: heading,
            problem: `H${level}が空です（テキスト内容がありません）`,
            text: `<h${level} class="${heading.className}"> (空の見出し)`,
            suggestion: `この見出し要素を削除するか、適切なテキストを追加してください`
          });
        }
        
        // 装飾目的のH1チェック（フッターロゴなど）
        if (level === 1 && (
          heading.className.includes('logo') || 
          heading.className.includes('footer') || 
          heading.closest('footer') !== null
        )) {
          console.log(`[Checker] Decorative H1 detected in footer/logo`);
          problematicHeadings.push(heading);
          headingStructureProblems.push({
            element: heading,
            problem: `H1がフッターやロゴに使用されています（装飾目的での不適切な使用）`,
            text: headingText || `<h1 class="${heading.className}">`,
            suggestion: `フッターのロゴはdivやspanに変更し、ページ本文のメインタイトルにH1を使用してください`
          });
        }
        
        // 最初の要素でない場合のレベルジャンプチェック
        if (index > 0 && level - previousLevel > 1) {
          console.log(`[Checker] Level skip detected: H${previousLevel} → H${level}`);
          problematicHeadings.push(heading);
          headingStructureProblems.push({
            element: heading,
            problem: `H${previousLevel}の次にH${level}が来ています（H${previousLevel + 1}をスキップ）`,
            text: headingText,
            suggestion: `H${level}をH${previousLevel + 1}に変更するか、不足している見出しレベルを追加してください`
          });
        }
        
        // H1が複数ある場合（装飾目的でない場合のみ）
        if (level === 1 && index > 0 && !heading.className.includes('logo') && !heading.className.includes('footer')) {
          const firstH1Index = Array.from(headings).findIndex(h => parseInt(h.tagName.charAt(1)) === 1);
          if (index > firstH1Index) {
            console.log(`[Checker] Multiple H1 detected at index ${index}`);
            problematicHeadings.push(heading);
            headingStructureProblems.push({
              element: heading,
              problem: `H1が複数存在します（ページに1つのH1のみ推奨）`,
              text: headingText,
              suggestion: `H1をH2以下に変更するか、このH1を削除してください`
            });
          }
        }
        
        // 空でない見出しのみを前レベルとして記録
        if (rawText.length > 0) {
          previousLevel = level;
        }
      });

      console.log(`[Checker] Heading analysis complete. Problematic headings: ${problematicHeadings.length}`);
      console.log('[Checker] Problematic headings:', problematicHeadings.map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 20) })));

      if (problematicHeadings.length > 0) {
        // 具体的な問題説明と解決策を生成
        const detailedMessage = `${problematicHeadings.length}個の見出しで階層構造に問題があります。適切な見出し構造は、ページの内容を論理的に整理し、スクリーンリーダーユーザーのナビゲーションを改善します。`;
        
        // 問題をルール別に整理（検出された問題のみ）
        const problemsByRule = {
          emptyHeading: headingStructureProblems.filter(p => p.problem.includes('空です')),
          logoH1: headingStructureProblems.filter(p => p.problem.includes('フッター')),
          levelSkip: headingStructureProblems.filter(p => p.problem.includes('スキップ')),
          multipleH1: headingStructureProblems.filter(p => p.problem.includes('複数存在'))
        };

        let solutionText = ``;

        // 問題1: 空の見出し（検出された場合のみ）
        if (problemsByRule.emptyHeading.length > 0) {
          solutionText += `🚨 問題: 空の見出しタグ (${problemsByRule.emptyHeading.length}個)
${problemsByRule.emptyHeading.map(p => `• ${p.text}`).join('\n')}

🔧 修正方法: 見出し要素を削除するか、適切なテキストを追加
✅ 例: <h1>ページタイトル</h1> または <div class="logo">サイト名</div>
📖 影響: SEO効果なし、スクリーンリーダーで認識不可

`;
        }

        // 問題2: フッター・ロゴでのH1使用（検出された場合のみ）
        if (problemsByRule.logoH1.length > 0) {
          solutionText += `🚨 問題: フッター・ロゴでのH1使用 (${problemsByRule.logoH1.length}個)
${problemsByRule.logoH1.map(p => `• ${p.text}`).join('\n')}

🔧 修正方法: フッターのロゴは div または span に変更
✅ 例: <div class="footer__logo">サイト名</div>
📖 影響: H1の意味が曖昧になり、SEOに悪影響

`;
        }

        // 問題3: レベルスキップ（検出された場合のみ）
        if (problemsByRule.levelSkip.length > 0) {
          solutionText += `🚨 問題: 見出し階層のスキップ (${problemsByRule.levelSkip.length}個)  
${problemsByRule.levelSkip.map(p => `• ${p.text} - ${p.problem}`).join('\n')}

🔧 修正方法: 見出しレベルを順序通りに調整
✅ 例: H1 → H2 → H3 の順序を守る
📖 影響: 文書構造が不明確、ナビゲーション困難

`;
        }

        // 問題4: 複数H1（検出された場合のみ）
        if (problemsByRule.multipleH1.length > 0) {
          solutionText += `🚨 問題: H1タグの重複 (${problemsByRule.multipleH1.length}個)
${problemsByRule.multipleH1.map(p => `• ${p.text}`).join('\n')}

🔧 修正方法: H1を1つだけ残し、他はH2以下に変更
✅ 例: メインタイトルのみH1、他は<h2>に変更
📖 影響: SEO順位低下、検索エンジンの混乱

`;
        }

        issues.push({
          category: 'heading',
          severity: 'warning',
          rule: 'heading_structure',
          name: '見出し構造の不適切',
          message: detailedMessage,
          elements: problematicHeadings,
          solution: solutionText
        });
      }

      // alt属性チェック（トラッキングピクセルを除外）
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      const trackingPixelPatterns = [
        /adsct/i,           // Twitter/X tracking
        /doubleclick/i,     // Google DoubleClick
        /googletagmanager/i,// Google Tag Manager
        /facebook/i,        // Facebook tracking
        /analytics/i,       // General analytics
        /pixel/i,           // General pixel tracking
        /tr\?/i,            // Common tracking parameter
        /1x1/i              // 1x1 pixel indicator
      ];
      
      // トラッキングピクセルを除外
      const filteredImages = Array.from(imagesWithoutAlt).filter(img => {
        // URLチェック
        const src = img.src || img.getAttribute('src') || '';
        const isTrackingUrl = trackingPixelPatterns.some(pattern => pattern.test(src));
        
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
      
      console.log('[Checker] Images without alt found:', imagesWithoutAlt.length);
      console.log('[Checker] After filtering tracking pixels:', filteredImages.length);
      
      if (filteredImages.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'error',
          rule: 'missing_alt',
          name: '画像のalt属性欠落',
          message: `${filteredImages.length}個の画像にalt属性がありません。視覚障害のあるユーザーがスクリーンリーダーで画像の内容を理解できません。SEO的にも検索エンジンが画像を認識できません。`,
          elements: filteredImages,
          solution: `alt属性の正しい設定方法:

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
<img src="chart.jpg" alt="月別売上グラフ：1月100万円から12月500万円まで右肩上がり">`
        });
      }

      // リンクのボタン化チェック
      const problematicLinks = [];
      const links = document.querySelectorAll('a');
      console.log('[Checker] Total links found:', links.length);
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        const onclick = link.getAttribute('onclick');
        const hasJSAction = onclick !== null;
        
        if ((!href || href === '#' || href === 'javascript:void(0)') && hasJSAction) {
          problematicLinks.push(link);
        }
      });

      if (problematicLinks.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'warning',
          rule: 'link_as_button',
          name: 'リンクのボタン化',
          message: `${problematicLinks.length}個の要素でaタグがボタンとして誤用されています。リンク（移動）とボタン（アクション）は異なる目的を持ち、スクリーンリーダーユーザーに混乱を与えます。`,
          elements: problematicLinks,
          solution: `aタグとbuttonタグの正しい使い分け:

【リンク（a タグ）の用途】
• 他のページへの移動
• 同ページ内の別セクションへの移動  
• ファイルのダウンロード
• メール・電話の起動

【ボタン（button タグ）の用途】
• フォームの送信
• モーダルの開閉
• データの更新・削除
• JavaScript の実行

❌ 悪い例（リンクをボタン化）:
<a href="#" onclick="submitForm()">送信</a>
<a href="javascript:void(0)" onclick="openModal()">詳細を見る</a>

✅ 良い例（適切な要素の使用）:
<button type="submit" onclick="submitForm()">送信</button>
<button type="button" onclick="openModal()">詳細を見る</button>

修正手順:
1. onclick属性を持つaタグを特定
2. 動作を確認（移動 or アクション）
3. アクションの場合はbuttonタグに変更
4. CSSスタイルを調整（必要に応じて）

追加推奨事項:
• buttonタグにtype属性を明記（type="button" または type="submit"）
• キーボードナビゲーション（EnterキーやSpaceキー）を確認
• role属性やaria-*属性でアクセシビリティを向上`
        });
      }

      // 日付情報のdiv使用チェック
      const problematicDateDivs = [];
      const divs = document.querySelectorAll('div');
      console.log('[Checker] Total divs found:', divs.length);
      
      const datePatterns = [
        /\d{4}年\d{1,2}月\d{1,2}日?/,  // 2024年1月15日
        /20\d{2}[\-\.\/]\d{1,2}[\-\.\/]\d{1,2}/,  // 2024-01-15, 2024.01.15
        /\d{1,2}月\d{1,2}日/  // 1月15日（年なし、明確に「月」「日」文字が必要）
      ];

      divs.forEach(div => {
        const text = div.textContent.trim();
        const hasDatePattern = datePatterns.some(pattern => pattern.test(text));
        const isShortText = text.length < 100;
        const hasTimeElement = div.querySelector('time');
        
        // 価格表示（￥記号やカンマを含む）を除外
        const isPriceDisplay = /[￥¥\$]\s*[\d,]+/.test(text) || /\d+,\d+/.test(text);
        
        if (hasDatePattern && isShortText && !hasTimeElement && !isPriceDisplay && text.length > 0) {
          problematicDateDivs.push(div);
        }
      });

      if (problematicDateDivs.length > 0) {
        issues.push({
          category: 'semantic',
          severity: 'warning',
          rule: 'date_in_div',
          name: '日付情報のdiv使用',
          message: `${problematicDateDivs.length}個の要素で日付情報にdivが使用されています`,
          elements: problematicDateDivs.slice(0, 10) // 最大10個まで
        });
      }


      // 古いROBOTSメタタグチェック（bookmarklet準拠）
      const oldRobotsMeta = document.querySelectorAll('meta[name="ROBOTS"]');
      const problematicRobotsMeta = [];
      
      oldRobotsMeta.forEach(meta => {
        const content = meta.getAttribute('content') || '';
        const hasOldPattern = ['NOODP', 'NOYDIR', 'NOARCHIVE'].some(pattern => 
          content.includes(pattern)
        );
        if (hasOldPattern) {
          problematicRobotsMeta.push(meta);
        }
      });

      console.log('[Checker] Old ROBOTS meta tags found:', problematicRobotsMeta.length);
      if (problematicRobotsMeta.length > 0) {
        issues.push({
          category: 'meta',
          severity: 'warning',
          rule: 'old_robots_meta',
          name: '古いROBOTSメタタグ',
          message: '古いROBOTSメタタグの記述が検出されました',
          elements: problematicRobotsMeta
        });
      }

      // 廃止されたメタタグチェック（keywords等）
      const deprecatedMeta = document.querySelectorAll('meta[name="keywords"]');
      console.log('[Checker] Deprecated meta tags found:', deprecatedMeta.length);
      if (deprecatedMeta.length > 0) {
        issues.push({
          category: 'meta',
          severity: 'warning',
          rule: 'deprecated_meta_tags',
          name: '廃止されたメタタグ',
          message: '廃止されたメタタグを削除することを推奨します',
          elements: Array.from(deprecatedMeta)
        });
      }

      // 実効性の高いARIA属性チェック
      
      // 1. カスタムフォーム要素の aria-required チェック
      // (HTML5のrequired属性がない場合のみ)
      const customRequiredElements = document.querySelectorAll('[data-required="true"], [class*="required"]:not([required])');
      const missingAriaRequired = Array.from(customRequiredElements).filter(el => {
        const isFormElement = ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
        return isFormElement && !el.hasAttribute('aria-required') && !el.hasAttribute('required');
      });
      
      if (missingAriaRequired.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'warning',
          rule: 'missing_aria_required',
          name: 'カスタム必須項目のARIA属性不足',
          message: `${missingAriaRequired.length}個のカスタム必須項目にaria-required属性が不足しています`,
          elements: missingAriaRequired
        });
      }

      // 2. インタラクティブな展開要素の aria-expanded チェック
      const expandableSelectors = [
        'button[data-toggle]', 'button[data-bs-toggle]',  // Bootstrap等
        '[role="button"][data-toggle]',                   // カスタムボタン
        'details summary',                                // HTML5詳細要素
        '.dropdown-toggle', '.accordion-toggle',          // 一般的なクラス
        '[aria-controls]'                                 // 他の要素を制御する要素
      ];
      
      const expandableElements = document.querySelectorAll(expandableSelectors.join(', '));
      const missingAriaExpanded = Array.from(expandableElements).filter(el => {
        // details要素のsummaryは除外（ブラウザが自動処理）
        if (el.tagName === 'SUMMARY') return false;
        
        return !el.hasAttribute('aria-expanded');
      });
      
      if (missingAriaExpanded.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'warning',
          rule: 'missing_aria_expanded',
          name: 'インタラクティブ要素のARIA展開状態不足',
          message: `${missingAriaExpanded.length}個のインタラクティブ要素にaria-expanded属性が不足しています`,
          elements: missingAriaExpanded
        });
      }

      // 3. 現在位置を示すナビゲーション要素の aria-current チェック
      const navigationLinks = document.querySelectorAll('nav a, .breadcrumb a, .pagination a, [role="navigation"] a');
      const missingAriaCurrent = Array.from(navigationLinks).filter(link => {
        // 現在ページまたはアクティブ状態を示すインジケーターがある
        const hasActiveClass = link.classList.contains('active') || 
                               link.classList.contains('current') ||
                               link.classList.contains('selected');
        
        const hasActiveParent = link.closest('.active, .current, .selected') !== null;
        
        // 現在URLと一致する
        const isSameUrl = link.href && 
                         (link.href === window.location.href || 
                          link.href === window.location.origin + window.location.pathname);
        
        return (hasActiveClass || hasActiveParent || isSameUrl) && !link.hasAttribute('aria-current');
      });
      
      if (missingAriaCurrent.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'warning',
          rule: 'missing_aria_current',
          name: '現在位置のARIA属性不足',
          message: `${missingAriaCurrent.length}個のアクティブなナビゲーションリンクにaria-current属性が不足しています`,
          elements: missingAriaCurrent
        });
      }
      
      // 4. フォーム要素のラベル不足チェック
      const formElements = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
      const missingLabels = Array.from(formElements).filter(el => {
        const hasLabel = el.id && document.querySelector(`label[for="${el.id}"]`) !== null;
        const hasAriaLabel = el.hasAttribute('aria-label');
        const hasAriaLabelledby = el.hasAttribute('aria-labelledby');
        const hasPlaceholder = el.hasAttribute('placeholder');
        const hasTitle = el.hasAttribute('title');
        
        // 検索フィールドの除外条件
        const isSearchField = el.name === 'q' || 
                             el.name === 'search' || 
                             el.name === 'query' || 
                             el.id.includes('search') || 
                             el.className.includes('search') ||
                             el.closest('form')?.action?.includes('search') ||
                             el.closest('[role="search"]') !== null;
        
        // 店舗選択など一般的なselect要素の除外
        const isCommonSelect = el.tagName === 'SELECT' && (
          el.name === 'store' ||
          el.name === 'category' ||
          el.name === 'sort' ||
          el.name === 'filter' ||
          el.id.includes('store') ||
          el.id.includes('category')
        );
        
        // コンテキストが明確な要素（検索フォーム内のフィールド）
        const isInSearchContext = el.closest('form')?.querySelector('input[name="q"], input[name="search"]') !== null;
        
        // ラベリングが全くない場合のみ問題とする（検索関連は除外）
        return !hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasPlaceholder && !hasTitle && 
               !isSearchField && !isCommonSelect && !isInSearchContext;
      });
      
      if (missingLabels.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'error',
          rule: 'missing_form_labels',
          name: 'フォーム要素のラベル不足',
          message: `${missingLabels.length}個のフォーム要素にアクセシブルなラベルがありません。スクリーンリーダーユーザーが入力フィールドの目的を理解できません。`,
          elements: missingLabels,
          solution: `以下のいずれかの方法でラベルを追加してください:
1. <label for="fieldId">ラベル名</label> + <input id="fieldId">
2. <input aria-label="ラベル名">
3. <input aria-labelledby="labelElementId">
4. <input placeholder="入力例" title="詳細説明">`
        });
      }

      // レイアウト目的のtable使用チェック
      const tables = document.querySelectorAll('table');
      const layoutTables = Array.from(tables).filter(table => {
        const hasCellpadding = table.hasAttribute('cellpadding');
        const hasCellspacing = table.hasAttribute('cellspacing');
        const hasBorder = table.hasAttribute('border') && table.getAttribute('border') === '0';
        const hasWidth = table.hasAttribute('width');
        const hasLayoutIndicators = hasCellpadding || hasCellspacing || hasBorder || hasWidth;
        
        // データ表の特徴がない場合
        const hasTableHeaders = table.querySelectorAll('th').length > 0;
        const hasCaption = table.querySelector('caption') !== null;
        const hasDataIndicators = hasTableHeaders || hasCaption;
        
        return hasLayoutIndicators && !hasDataIndicators;
      });
      
      if (layoutTables.length > 0) {
        issues.push({
          category: 'accessibility',
          severity: 'error',
          rule: 'layout_table_usage',
          name: 'レイアウト目的のtable使用',
          message: `${layoutTables.length}個のテーブルがレイアウト目的で使用されています`,
          elements: layoutTables
        });
      }

      // 古いGoogle Analyticsチェック
      const scripts = document.querySelectorAll('script');
      const legacyGAScripts = [];
      const uaPatterns = [
        /UA-\d+-\d+/,
        /_gat\._getTracker/,
        /pageTracker/,
        /google-analytics\.com\/ga\.js/
      ];

      scripts.forEach(script => {
        const content = script.textContent || script.innerHTML;
        const src = script.src;
        
        const hasLegacyPattern = uaPatterns.some(pattern => {
          return pattern.test(content) || pattern.test(src);
        });
        
        if (hasLegacyPattern) {
          legacyGAScripts.push(script);
        }
      });

      if (legacyGAScripts.length > 0) {
        issues.push({
          category: 'cleanup',
          severity: 'error',
          rule: 'legacy_google_analytics',
          name: '古いGoogle Analyticsコード',
          message: `${legacyGAScripts.length}個の古いGoogle Analyticsコードが検出されました`,
          elements: legacyGAScripts
        });
      }

      // 古いGTMコンテナチェック
      const legacyGTMElements = [];
      const legacyGTMIds = ['GTM-MJ66RZD']; // 特定の古いIDをチェック
      
      scripts.forEach(script => {
        const content = script.textContent || script.innerHTML;
        const src = script.src;
        const hasLegacyGTM = legacyGTMIds.some(gtmId => {
          return content.includes(gtmId) || src.includes(gtmId);
        });
        if (hasLegacyGTM) {
          legacyGTMElements.push(script);
        }
      });
      
      // noscriptタグもチェック
      const noscripts = document.querySelectorAll('noscript');
      noscripts.forEach(noscript => {
        const content = noscript.innerHTML;
        const hasLegacyGTM = legacyGTMIds.some(gtmId => content.includes(gtmId));
        if (hasLegacyGTM) {
          legacyGTMElements.push(noscript);
        }
      });
      
      if (legacyGTMElements.length > 0) {
        issues.push({
          category: 'cleanup',
          severity: 'warning',
          rule: 'legacy_gtm_container',
          name: '古いGTMコンテナ',
          message: `${legacyGTMElements.length}個の古いGTMコンテナが検出されました`,
          elements: legacyGTMElements
        });
      }

      // 不要なAdobe関連コードチェック
      const adobeElements = [];
      const adobePatterns = [
        /s_code\.js/,
        /omniture\.js/,
        /sitecatalyst/i,
        /adobe\.com\/dtm/,
        /s\.t\(\)/,
        /s\.tl\(/
      ];
      
      scripts.forEach(script => {
        const content = script.textContent || script.innerHTML;
        const src = script.src;
        const hasAdobePattern = adobePatterns.some(pattern => {
          return pattern.test(content) || pattern.test(src);
        });
        if (hasAdobePattern) {
          adobeElements.push(script);
        }
      });
      
      if (adobeElements.length > 0) {
        issues.push({
          category: 'cleanup',
          severity: 'warning',
          rule: 'unused_adobe_code',
          name: '不要なAdobe関連コード',
          message: `${adobeElements.length}個のAdobe関連コードが検出されました`,
          elements: adobeElements
        });
      }

      // 不要なnoscriptタグチェック
      const unnecessaryNoscripts = Array.from(noscripts).filter(noscript => {
        const content = noscript.innerHTML.trim();
        const isEmpty = content.length === 0;
        const isOnlyWhitespace = /^\s*$/.test(content);
        const isCommentOnly = /^<!--.*-->$/s.test(content.trim());
        
        return isEmpty || isOnlyWhitespace || isCommentOnly;
      });
      
      if (unnecessaryNoscripts.length > 0) {
        issues.push({
          category: 'cleanup',
          severity: 'info',
          rule: 'unnecessary_noscript',
          name: '不要なnoscriptタグ',
          message: `${unnecessaryNoscripts.length}個の不要なnoscriptタグが検出されました`,
          elements: unnecessaryNoscripts
        });
      }

      console.log('[Checker] Total issues detected:', issues.length);
      return issues;
    }
  }

  // ドロワーUI実装
  function createDrawerUI() {
    if (drawerElement) return drawerElement;

    const drawer = document.createElement('div');
    drawer.id = 'html-checker-drawer';
    drawer.style.cssText = `
      position: fixed;
      top: 0;
      right: -450px;
      width: 450px;
      height: 100vh;
      background: white;
      border-left: 2px solid #333;
      box-shadow: -4px 0 20px rgba(0,0,0,0.3);
      z-index: 10001;
      font-family: Arial, sans-serif;
      font-size: 14px;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
      overflow-y: auto;
      opacity: 0.7;
    `;

    document.body.appendChild(drawer);
    drawerElement = drawer;
    
    // マウスオーバーで透明度変更
    setupDrawerTransparency(drawer);
    
    return drawer;
  }

  // ドロワーの透明度制御
  function setupDrawerTransparency(drawer) {
    console.log('[Drawer] Setting up transparency controls');
    
    // マウスオーバーで不透明に
    drawer.addEventListener('mouseenter', () => {
      console.log('[Drawer] Mouse entered, making opaque');
      drawer.style.opacity = '1';
    });
    
    // マウスアウトで半透明に
    drawer.addEventListener('mouseleave', () => {
      console.log('[Drawer] Mouse left, making semi-transparent');
      drawer.style.opacity = '0.7';
    });
    
    // フォーカス時も不透明に（キーボードナビゲーション対応）
    drawer.addEventListener('focusin', () => {
      console.log('[Drawer] Focus entered, making opaque');
      drawer.style.opacity = '1';
    });
    
    drawer.addEventListener('focusout', (event) => {
      // フォーカスがドロワー外に移った場合のみ半透明に
      if (!drawer.contains(event.relatedTarget)) {
        console.log('[Drawer] Focus left drawer, making semi-transparent');
        drawer.style.opacity = '0.7';
      }
    });
  }

  function displayResultsInDrawer(results) {
    // ドロワーが既に開いている場合は、トグル動作
    if (drawerOpen) {
      closeDrawer();
      return;
    }
    
    const drawer = createDrawerUI();
    
    // ヘッダー作成
    const header = document.createElement('div');
    header.style.cssText = `
      background: #333;
      color: white;
      padding: 15px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <span>HTML Checker Results</span>
      <div style="display: flex; gap: 10px;">
        <button id="toggle-drawer" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; padding: 0 8px;" title="ドロワーを折りたたみ/展開">⇄</button>
        <button id="close-drawer" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;" title="ドロワーを閉じる">×</button>
      </div>
    `;

    // コンテンツエリア作成
    const content = document.createElement('div');
    content.id = 'drawer-content';
    content.style.padding = '15px';

    // サマリー表示
    const totalIssues = results.issues ? results.issues.length : 0;
    const summary = document.createElement('div');
    summary.style.cssText = `
      margin-bottom: 15px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      font-weight: bold;
    `;
    summary.textContent = `検出された問題: ${totalIssues}件`;

    content.appendChild(summary);

    if (results.issues && results.issues.length > 0) {
      // カテゴリ別にグループ化
      const categorizedIssues = groupIssuesByCategory(results.issues);
      
      // カテゴリ順序（UI要件準拠）
      const categoryOrder = ['accessibility', 'heading', 'semantic', 'meta', 'cleanup'];
      const categoryLabels = {
        accessibility: '♿ アクセシビリティ',
        heading: '📝 見出し構造',
        semantic: '🏗️ セマンティック構造',
        meta: '🏷️ メタタグ',
        cleanup: '🧹 クリーンアップ'
      };

      categoryOrder.forEach(category => {
        if (categorizedIssues[category]) {
          const categorySection = createCategorySection(category, categoryLabels[category], categorizedIssues[category]);
          content.appendChild(categorySection);
        }
      });
    }

    // ドロワーを組み立て（常に内容を更新）
    drawer.innerHTML = '';
    drawer.appendChild(header);
    drawer.appendChild(content);

    // DOM要素が追加された後でボタン要素を取得してイベントリスナーを設定
    const closeBtn = drawer.querySelector('#close-drawer');
    const toggleBtn = drawer.querySelector('#toggle-drawer');

    console.log('[Drawer] Setting up button event listeners:', { closeBtn, toggleBtn });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
      console.log('[Drawer] Close button listener added');
    } else {
      console.error('[Drawer] Close button not found');
    }
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleDrawerContent);
      console.log('[Drawer] Toggle button listener added');
      
      // 折りたたみ状態を復元
      if (drawerContentCollapsed) {
        content.style.display = 'none';
        toggleBtn.innerHTML = '⇅';
        toggleBtn.title = 'ドロワーを展開';
        console.log('[Drawer] Restored collapsed state');
      }
    } else {
      console.error('[Drawer] Toggle button not found');
    }

    // ドロワーを開く
    openDrawer();
  }

  function groupIssuesByCategory(issues) {
    const grouped = {};
    issues.forEach(issue => {
      if (!grouped[issue.category]) {
        grouped[issue.category] = [];
      }
      grouped[issue.category].push(issue);
    });
    return grouped;
  }

  function createCategorySection(category, label, issues) {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';

    // カテゴリヘッダー
    const header = document.createElement('div');
    header.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #6366F1;
    `;
    header.textContent = `${label} (${issues.length}件)`;

    section.appendChild(header);

    // 各問題を表示
    issues.forEach(issue => {
      const issueDiv = createIssueElement(issue);
      section.appendChild(issueDiv);
    });

    return section;
  }

  function createIssueElement(issue) {
    const issueDiv = document.createElement('div');
    const severityColor = issue.severity === 'error' ? '#ff0000' : '#ffa500';
    const severityBg = issue.severity === 'error' ? '#fff5f5' : '#fffbf0';

    issueDiv.style.cssText = `
      margin-bottom: 12px;
      padding: 12px;
      border-left: 4px solid ${severityColor};
      background: ${severityBg};
      border-radius: 4px;
      transition: background-color 0.2s ease;
    `;

    // 問題タイトル
    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; margin-bottom: 5px; color: #333;';
    title.textContent = issue.name;

    // 問題メッセージ
    const message = document.createElement('div');
    message.style.cssText = 'margin-bottom: 5px; color: #666;';
    message.textContent = issue.message;

    // 要素数
    const count = document.createElement('div');
    count.style.cssText = 'font-size: 12px; color: #999; margin-bottom: 10px;';
    count.textContent = `対象要素: ${issue.elements.length}個`;

    issueDiv.appendChild(title);
    issueDiv.appendChild(message);
    issueDiv.appendChild(count);

    // 要素リストを表示（bookmarklet準拠）
    if (issue.elements && issue.elements.length > 0) {
      const elementsList = document.createElement('div');
      elementsList.style.cssText = 'margin-top: 8px;';

      issue.elements.forEach((element, elementIndex) => {
        const elementItem = document.createElement('div');
        elementItem.style.cssText = `
          padding: 5px 8px; 
          margin: 2px 0; 
          background: rgba(0,0,0,0.05); 
          border-radius: 3px; 
          cursor: pointer; 
          font-size: 12px;
          border-left: 3px solid ${severityColor};
          transition: background-color 0.2s ease;
        `;

        // 要素の内容を具体的に表示
        let elementText = "";
        if (element.tagName === "IMG") {
          const src = element.src || element.getAttribute("src");
          const alt = element.getAttribute("alt");
          elementText = `<img src="${src ? src.split("/").pop() : "src不明"}" alt="${alt || "(alt属性なし)"}">`;
        } else if (element.tagName === "META") {
          const name = element.getAttribute("name");
          const content = element.getAttribute("content");
          elementText = `<meta name="${name || "name不明"}" content="${content || "content不明"}">`;
        } else if (element.tagName === "SCRIPT") {
          const src = element.getAttribute("src");
          if (src) {
            elementText = `<script src="${src}">`;
          } else {
            const scriptContent = element.textContent || element.innerHTML;
            elementText = `<script>${scriptContent.substring(0, 100)}${scriptContent.length > 100 ? "..." : ""}</script>`;
          }
        } else if (element.tagName === "LINK") {
          const rel = element.getAttribute("rel");
          const href = element.getAttribute("href");
          elementText = `<link rel="${rel}" href="${href ? href.split("/").pop() : "href不明"}">`;
        } else if (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") {
          // フォーム要素の詳細表示
          const type = element.getAttribute("type") || "";
          const name = element.getAttribute("name") || "";
          const id = element.getAttribute("id") || "";
          const placeholder = element.getAttribute("placeholder") || "";
          
          let formInfo = `<${element.tagName.toLowerCase()}`;
          if (type) formInfo += ` type="${type}"`;
          if (id) formInfo += ` id="${id}"`;
          if (name) formInfo += ` name="${name}"`;
          if (placeholder) formInfo += ` placeholder="${placeholder}"`;
          formInfo += `>`;
          
          elementText = formInfo;
        } else if (element.tagName.match(/^H[1-6]$/)) {
          // 見出し要素の詳細表示
          const headingLevel = element.tagName.charAt(1);
          const headingContent = element.textContent.trim();
          const id = element.getAttribute("id") || "";
          const className = element.getAttribute("class") || "";
          
          elementText = `<h${headingLevel}`;
          if (id) elementText += ` id="${id}"`;
          if (className) elementText += ` class="${className}"`;
          elementText += `>${headingContent.substring(0, 50)}${headingContent.length > 50 ? "..." : ""}</h${headingLevel}>`;
        } else {
          elementText = element.textContent
            ? element.textContent.substring(0, 50) +
              (element.textContent.length > 50 ? "..." : "")
            : `<${element.tagName.toLowerCase()}>`;
        }

        elementItem.textContent = elementText;
        elementItem.title = "クリックして該当要素にジャンプ";

        // ホバー効果
        elementItem.addEventListener('mouseenter', () => {
          elementItem.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        elementItem.addEventListener('mouseleave', () => {
          elementItem.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });

        // クリックでジャンプ
        elementItem.addEventListener('click', (e) => {
          e.stopPropagation(); // 親要素のクリックイベントを防止
          jumpToElement(element);
        });

        elementsList.appendChild(elementItem);
      });

      issueDiv.appendChild(elementsList);
    }

    // 解決策がある場合は表示
    if (issue.solution) {
      const solutionDiv = document.createElement('div');
      solutionDiv.style.cssText = `
        margin-top: 12px;
        padding: 8px;
        background: rgba(5, 150, 105, 0.1);
        border-radius: 4px;
        border-left: 3px solid #059669;
        font-size: 12px;
        color: #065f46;
      `;
      
      const solutionTitle = document.createElement('div');
      solutionTitle.style.cssText = 'font-weight: bold; margin-bottom: 4px;';
      solutionTitle.textContent = '💡 解決方法：';
      
      const solutionText = document.createElement('pre');
      solutionText.style.cssText = `
        margin: 0;
        font-family: monospace;
        font-size: 11px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-wrap: break-word;
      `;
      solutionText.textContent = issue.solution;
      
      solutionDiv.appendChild(solutionTitle);
      solutionDiv.appendChild(solutionText);
      issueDiv.appendChild(solutionDiv);
    }

    return issueDiv;
  }

  function jumpToElement(element) {
    console.log('[Drawer] Jumping to element:', element, element.tagName, element.src || element.textContent?.substring(0, 50));
    
    // 要素の存在と表示状態を確認
    if (!element || !document.contains(element)) {
      console.error('[Drawer] Element not found in document');
      return;
    }
    
    // head内の要素や隠し要素の場合は特別な処理
    const isInHead = element.closest('head') !== null;
    const computedStyle = window.getComputedStyle(element);
    const isHidden = computedStyle.display === 'none' || 
                     computedStyle.visibility === 'hidden' || 
                     element.offsetParent === null;
    
    if (isInHead) {
      console.log('[Drawer] Element is in <head>, cannot scroll. Showing info instead.');
      alert(`<head>内の要素です:\n${element.outerHTML}`);
      return;
    }
    
    if (isHidden) {
      console.log('[Drawer] Element is hidden, trying to make visible temporarily');
      // 隠し要素の場合は親要素にスクロール
      let visibleParent = element.parentElement;
      while (visibleParent && window.getComputedStyle(visibleParent).display === 'none') {
        visibleParent = visibleParent.parentElement;
      }
      
      if (visibleParent) {
        visibleParent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log('[Drawer] Scrolled to visible parent element');
        // 隠し要素でも親要素をハイライト
        highlightSelectedElement(visibleParent);
        setupFocusOutListener(visibleParent);
      }
    } else {
      // 既存のハイライトをクリア
      clearElementHighlights();
      clearSelectedElementHighlight();
      
      // 要素にスクロール
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log('[Drawer] Scroll completed for visible element');
        
        // 選択要素として強調表示
        highlightSelectedElement(element);
        setupFocusOutListener(element);
      } catch (error) {
        console.error('[Drawer] Scroll failed:', error);
      }
    }
  }

  function highlightSelectedElement(element) {
    console.log('[Drawer] Highlighting selected element:', element);
    
    // 前の選択要素のハイライトをクリア
    if (selectedElement && selectedElement !== element) {
      clearSelectedElementHighlight();
    }
    
    selectedElement = element;
    
    // 元のスタイルを保存
    element._originalOutline = element.style.outline || '';
    element._originalOutlineOffset = element.style.outlineOffset || '';
    element._originalBackground = element.style.backgroundColor || '';
    element._originalBoxShadow = element.style.boxShadow || '';
    element._originalTransition = element.style.transition || '';
    element._originalPosition = element.style.position || '';
    element._originalZIndex = element.style.zIndex || '';

    // 永続的な選択要素の強調表示
    element.style.outline = '3px solid #059669';
    element.style.outlineOffset = '2px';
    element.style.backgroundColor = 'rgba(5, 150, 105, 0.15)';
    element.style.boxShadow = '0 0 15px rgba(5, 150, 105, 0.6), inset 0 0 10px rgba(5, 150, 105, 0.2)';
    element.style.transition = 'outline-color 0.8s ease-in-out, box-shadow 0.8s ease-in-out';
    element.style.position = element.style.position || 'relative';
    element.style.zIndex = '9999';
    
    // CSS点滅アニメーションを追加
    const animationName = 'htmlCheckerPulse_' + Date.now();
    const keyframes = `
      @keyframes ${animationName} {
        0% { 
          outline-color: #059669; 
          box-shadow: 0 0 15px rgba(5, 150, 105, 0.6), inset 0 0 10px rgba(5, 150, 105, 0.2);
        }
        50% { 
          outline-color: #10b981; 
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.3);
        }
        100% { 
          outline-color: #059669; 
          box-shadow: 0 0 15px rgba(5, 150, 105, 0.6), inset 0 0 10px rgba(5, 150, 105, 0.2);
        }
      }
    `;
    
    // スタイルシートに追加
    if (!document.getElementById('htmlChecker-animations')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'htmlChecker-animations';
      styleSheet.type = 'text/css';
      document.head.appendChild(styleSheet);
    }
    
    const styleSheet = document.getElementById('htmlChecker-animations');
    styleSheet.textContent += keyframes;
    
    // アニメーションを適用
    element.style.animation = `${animationName} 1.5s ease-in-out infinite`;
    element._animationName = animationName;
    
    console.log('[Drawer] Applied persistent highlight with pulse animation');

    // 永続表示用のフラグを設定
    element._isPersistentHighlight = true;
  }

  // 選択要素のハイライトをクリア
  function clearSelectedElementHighlight() {
    if (selectedElement && selectedElement._isPersistentHighlight) {
      console.log('[Drawer] Clearing persistent highlight from element:', selectedElement);
      
      // イベントリスナーをクリア
      removeFocusOutListener();
      
      // 元のスタイルに戻す
      selectedElement.style.outline = selectedElement._originalOutline || '';
      selectedElement.style.outlineOffset = selectedElement._originalOutlineOffset || '';
      selectedElement.style.backgroundColor = selectedElement._originalBackground || '';
      selectedElement.style.boxShadow = selectedElement._originalBoxShadow || '';
      selectedElement.style.transition = selectedElement._originalTransition || '';
      selectedElement.style.position = selectedElement._originalPosition || '';
      selectedElement.style.zIndex = selectedElement._originalZIndex || '';
      selectedElement.style.animation = '';
      
      // アニメーション用のスタイルシートから該当キーフレームを削除
      if (selectedElement._animationName) {
        const styleSheet = document.getElementById('htmlChecker-animations');
        if (styleSheet) {
          styleSheet.textContent = styleSheet.textContent.replace(
            new RegExp(`@keyframes ${selectedElement._animationName}[^}]+}[^}]*}`, 'g'), 
            ''
          );
        }
      }
      
      // 問題要素の赤枠ハイライトを復元
      const wasHighlightedElement = selectedElement;
      
      // フラグとデータをクリア
      delete selectedElement._isPersistentHighlight;
      delete selectedElement._originalOutline;
      delete selectedElement._originalOutlineOffset;
      delete selectedElement._originalBackground;
      delete selectedElement._originalBoxShadow;
      delete selectedElement._originalTransition;
      delete selectedElement._originalPosition;
      delete selectedElement._originalZIndex;
      delete selectedElement._animationName;
      
      selectedElement = null;
      
      // この要素が問題要素だった場合、赤枠ハイライトを復元
      restoreProblemElementHighlight(wasHighlightedElement);
    }
  }

  // 問題要素の赤枠ハイライトを復元
  function restoreProblemElementHighlight(element) {
    // highlightedElementsから該当要素を見つけて復元
    const highlightedData = highlightedElements.find(hd => 
      (hd.element && hd.element === element) || hd === element
    );
    
    if (highlightedData) {
      console.log('[Drawer] Restoring problem element highlight for:', element);
      
      // 問題要素としてのハイライトを再適用
      element.style.outline = '2px solid #ff0000';
      element.style.outlineOffset = '2px';
      element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      element.style.transition = 'outline 0.3s ease, background-color 0.3s ease';
      element.style.position = element.style.position || 'relative';
      element.style.zIndex = '9998'; // 選択要素より低い
      
      console.log('[Drawer] Problem element highlight restored');
    } else {
      console.log('[Drawer] Element not found in highlighted elements list');
    }
  }

  // フォーカスアウト検出機能
  let focusOutListeners = [];

  function setupFocusOutListener(element) {
    console.log('[Drawer] Setting up focus out listeners for element:', element);
    
    // 既存のリスナーをクリア
    removeFocusOutListener();
    
    // クリック外し検出
    const clickOutsideHandler = (event) => {
      if (!element.contains(event.target) && 
          !drawerElement.contains(event.target)) {
        console.log('[Drawer] Clicked outside selected element, clearing highlight');
        clearSelectedElementHighlight();
      }
    };
    
    // スクロール検出
    const scrollHandler = () => {
      // スクロール時は一定時間後にクリア
      clearTimeout(element._scrollTimeout);
      element._scrollTimeout = setTimeout(() => {
        if (selectedElement === element) {
          console.log('[Drawer] Scroll detected, clearing highlight after delay');
          clearSelectedElementHighlight();
        }
      }, 3000); // 3秒後にクリア
    };
    
    // キーボード操作検出（Escapeキー）
    const keyHandler = (event) => {
      if (event.key === 'Escape') {
        console.log('[Drawer] Escape key pressed, clearing highlight');
        clearSelectedElementHighlight();
      }
    };
    
    // フォーカス移動検出
    const focusHandler = (event) => {
      if (!element.contains(event.target) && 
          !drawerElement.contains(event.target)) {
        console.log('[Drawer] Focus moved away from selected element');
        clearSelectedElementHighlight();
      }
    };
    
    // イベントリスナーを追加
    document.addEventListener('click', clickOutsideHandler);
    document.addEventListener('scroll', scrollHandler, { passive: true });
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('focusin', focusHandler);
    
    // リスナーを記録（後でクリアするため）
    focusOutListeners = [
      { type: 'click', handler: clickOutsideHandler },
      { type: 'scroll', handler: scrollHandler },
      { type: 'keydown', handler: keyHandler },
      { type: 'focusin', handler: focusHandler }
    ];
    
    console.log('[Drawer] Focus out listeners configured');
  }

  function removeFocusOutListener() {
    console.log('[Drawer] Removing focus out listeners');
    
    focusOutListeners.forEach(({ type, handler }) => {
      document.removeEventListener(type, handler);
    });
    
    focusOutListeners = [];
    
    // スクロールタイムアウトもクリア
    if (selectedElement && selectedElement._scrollTimeout) {
      clearTimeout(selectedElement._scrollTimeout);
      delete selectedElement._scrollTimeout;
    }
  }

  // 全問題要素をハイライト（bookmarklet準拠）
  function highlightAllIssueElements(results) {
    clearAllHighlights(); // 既存のハイライトをクリア
    
    console.log('[Drawer] Starting to highlight all issue elements:', results.issues);
    
    if (results.issues) {
      results.issues.forEach(issue => {
        if (issue.elements && issue.elements.length > 0) {
          console.log(`[Drawer] Highlighting ${issue.elements.length} elements for issue: ${issue.name}`);
          issue.elements.forEach(element => {
            highlightProblemElement(element, issue);
          });
        }
      });
    }
    
    console.log(`[Drawer] Total highlighted elements: ${highlightedElements.length}`);
  }

  // 問題要素の軽いハイライト（bookmarklet準拠）
  function highlightProblemElement(element, issue) {
    console.log(`[Drawer] Highlighting problem element for ${issue.name}:`, element);
    
    // 元のスタイルを保存
    if (!element._originalProblemStyles) {
      element._originalProblemStyles = {
        outline: element.style.outline,
        outlineOffset: element.style.outlineOffset,
        backgroundColor: element.style.backgroundColor,
        transition: element.style.transition,
        position: element.style.position,
        zIndex: element.style.zIndex
      };
    }

    // 問題要素ハイライト（選択要素より低いz-index）
    element.style.outline = '2px solid #ff0000';
    element.style.outlineOffset = '2px';
    element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    element.style.transition = 'outline 0.3s ease, background-color 0.3s ease';
    element.style.position = element.style.position || 'relative';
    element.style.zIndex = '9998'; // 選択要素(9999)より低い
    
    // 問題要素リストに追加
    highlightedElements.push({ 
      element: element, 
      issue: issue,
      isProblemHighlight: true 
    });
    console.log(`[Drawer] Applied red problem highlight to element`);
  }

  function clearElementHighlights() {
    if (selectedElement) {
      selectedElement.style.outline = '';
      selectedElement.style.outlineOffset = '';
      selectedElement.style.backgroundColor = '';
      selectedElement.style.boxShadow = '';
      selectedElement = null;
    }
  }

  function clearAllHighlights() {
    console.log('[Drawer] Clearing all highlights, total elements:', highlightedElements.length);
    
    // 選択要素のハイライトをクリア
    clearElementHighlights();
    
    // 全ての問題要素のハイライトをクリア
    highlightedElements.forEach(highlightedData => {
      const element = highlightedData.element || highlightedData; // 後方互換性
      
      if (element && element._originalProblemStyles) {
        console.log('[Drawer] Restoring original styles for element:', element);
        element.style.outline = element._originalProblemStyles.outline || '';
        element.style.outlineOffset = element._originalProblemStyles.outlineOffset || '';
        element.style.backgroundColor = element._originalProblemStyles.backgroundColor || '';
        element.style.transition = element._originalProblemStyles.transition || '';
        element.style.position = element._originalProblemStyles.position || '';
        element.style.zIndex = element._originalProblemStyles.zIndex || '';
        delete element._originalProblemStyles;
      }
    });
    highlightedElements = [];
    console.log('[Drawer] All highlights cleared');
  }

  function openDrawer() {
    if (drawerElement) {
      drawerElement.style.right = '0px';
      drawerOpen = true;
    }
  }

  function closeDrawer() {
    console.log('[Drawer] Closing drawer');
    if (drawerElement) {
      drawerElement.style.right = '-450px';
      drawerOpen = false;
      drawerContentCollapsed = false; // 折りたたみ状態もリセット
      removeFocusOutListener(); // フォーカスアウトリスナーをクリア
      clearSelectedElementHighlight(); // 選択要素のハイライトをクリア
      clearAllHighlights(); // 全てのハイライトをクリア
      console.log('[Drawer] Drawer closed, drawerOpen =', drawerOpen);
    }
  }

  function toggleDrawer() {
    console.log('[Drawer] Toggle drawer, current state:', drawerOpen);
    if (drawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function toggleDrawerContent() {
    console.log('[Drawer] Toggle drawer content, current collapsed state:', drawerContentCollapsed);
    
    if (!drawerElement) {
      console.error('[Drawer] Drawer element not found');
      return;
    }
    
    const content = drawerElement.querySelector('#drawer-content');
    const toggleBtn = drawerElement.querySelector('#toggle-drawer');
    
    console.log('[Drawer] Found elements:', { content, toggleBtn });
    
    if (!content || !toggleBtn) {
      console.error('[Drawer] Could not find content or toggle button');
      return;
    }
    
    if (drawerContentCollapsed) {
      // 展開
      content.style.display = 'block';
      toggleBtn.innerHTML = '⇄';
      toggleBtn.title = 'ドロワーを展開';
      drawerContentCollapsed = false;
      console.log('[Drawer] Content expanded');
    } else {
      // 折りたたみ
      content.style.display = 'none';
      toggleBtn.innerHTML = '⇅';
      toggleBtn.title = 'ドロワーを折りたたみ';
      drawerContentCollapsed = true;
      console.log('[Drawer] Content collapsed');
    }
  }

  // グローバルインスタンス
  const checker = new HTMLSemanticChecker();
  let isInitialized = false;

  // 初期化関数
  function initialize() {
    if (isInitialized) return;
    
    try {
      checker.initialize();
      isInitialized = true;
      console.log('[Content Script] Initialization successful');
    } catch (error) {
      console.error('[Content Script] Initialization failed:', error);
    }
  }

  // メッセージハンドラー
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('[Content Script] Message received:', message);
    
    switch (message.type) {
      case 'PING':
        console.log('[Content Script] PING received');
        sendResponse({ type: 'PONG', timestamp: Date.now() });
        return true;
        
      case 'START_CHECK':
        console.log('[Content Script] START_CHECK received');
        try {
          if (!isInitialized) {
            initialize();
          }
          
          const result = checker.performFullCheck();
          sendResponse({ 
            success: true, 
            data: result,
            message: '完全なセマンティック分析が完了しました'
          });
          return true;
        } catch (error) {
          console.error('[Content Script] Check failed:', error);
          sendResponse({ 
            success: false, 
            error: error.message || 'Analysis failed',
            message: '分析中にエラーが発生しました'
          });
          return true;
        }
        
      case 'STOP_CHECK':
        console.log('[Content Script] STOP_CHECK received');
        closeDrawer();
        sendResponse({ success: true, data: null });
        return true;
        
      default:
        console.log('[Content Script] Unknown message type:', message.type);
        return false;
    }
  });

  // 初期化実行
  initialize();
  
  console.log('[Content Script] Full semantic checker ready');
})();