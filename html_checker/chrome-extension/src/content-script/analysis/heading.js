/**
 * 見出し構造分析モジュール
 */

import { SEVERITY, ALLOWED_SIMPLE_TAGS } from '../config.js';
import { checkDeepNesting, isExcludedElement, getElementFullHTML } from '../utils/dom.js';
import { debugLog } from '../utils/debug.js';

/**
 * 見出し構造を分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Object} 見出し構造の分析結果
 */
export function analyzeHeadingStructure(targetElements = null) {
  // プリプロセス済み要素が提供されている場合はそれを使用
  const headings = targetElements ? targetElements.headings : {
    all: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(h => !isExcludedElement(h)),
    h1: Array.from(document.querySelectorAll('h1')).filter(h => !isExcludedElement(h)),
    h2: Array.from(document.querySelectorAll('h2')).filter(h => !isExcludedElement(h)),
    h3: Array.from(document.querySelectorAll('h3')).filter(h => !isExcludedElement(h)),
    h4: Array.from(document.querySelectorAll('h4')).filter(h => !isExcludedElement(h)),
    h5: Array.from(document.querySelectorAll('h5')).filter(h => !isExcludedElement(h)),
    h6: Array.from(document.querySelectorAll('h6')).filter(h => !isExcludedElement(h))
  };
  
  const structure = {
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
export function detectHeadingIssues(targetElements = null) {
  const issues = [];

  // H1タグチェック（プリプロセス済み要素を使用）
  const h1Elements = targetElements ? targetElements.headings.h1 : 
    Array.from(document.querySelectorAll('h1')).filter(h => !isExcludedElement(h));
  debugLog('Checker', 'H1 elements found (excluding excluded elements):', h1Elements.length);
  
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
  const headingStructureIssues = analyzeDetailedHeadingStructure(targetElements);
  issues.push(...headingStructureIssues);

  return issues;
}

/**
 * 詳細な見出し構造の分析（プリプロセス済み要素を使用）
 * @param {Object} targetElements - プリプロセス済み要素（オプション）
 * @returns {Array} 見出し構造の問題リスト
 */
function analyzeDetailedHeadingStructure(targetElements = null) {
  const issues = [];
  const headings = targetElements ? targetElements.headings.all : 
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(h => !isExcludedElement(h));
  const problematicHeadings = [];
  const headingStructureProblems = [];
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const rawText = heading.textContent.trim();
    const headingText = rawText.substring(0, 30) + (rawText.length > 30 ? '...' : '');
    
    debugLog('Checker', `Processing heading ${index + 1}: H${level} "${headingText}" (previous: H${previousLevel})`);
    debugLog('Checker', `- innerHTML: ${heading.innerHTML.substring(0, 100)}`);
    debugLog('Checker', `- textContent: "${heading.textContent}"`);
    debugLog('Checker', `- trimmed length: ${rawText.length}`);
    
    // 空の見出しチェック（より厳密な判定）
    const hasVisibleText = rawText.length > 0 && !/^\s*$/.test(rawText);
    
    // H1が画像のみの場合の特別処理
    const isImageOnlyH1 = level === 1 && !hasVisibleText && heading.children.length === 1 && 
                         heading.children[0].tagName === 'IMG' && 
                         heading.children[0].hasAttribute('alt') &&
                         heading.children[0].getAttribute('alt').trim().length > 0;
    
    if (!hasVisibleText && !isImageOnlyH1) {
      debugLog('Checker', `Empty heading detected: H${level}`);
      debugLog('Checker', `- Raw text: "${rawText}"`);
      debugLog('Checker', `- Has children: ${heading.children.length > 0}`);
      
      // 子要素がある場合は、本当にテキストがないか再確認
      if (heading.children.length > 0) {
        const childrenText = Array.from(heading.children).map(child => child.textContent.trim()).join('');
        debugLog('Checker', `- Children text: "${childrenText}"`);
        
        // 子要素にもテキストがない場合のみ空と判定
        if (childrenText.length === 0) {
          problematicHeadings.push(heading);
          headingStructureProblems.push({
            element: heading,
            problem: `H${level}が空です（テキスト内容がありません）`,
            text: `実際のHTML:\n${getElementFullHTML(heading)}`,
            suggestion: 'この見出し要素を削除するか、適切なテキストを追加してください'
          });
        }
      } else {
        // 子要素がなく、テキストもない場合
        problematicHeadings.push(heading);
        headingStructureProblems.push({
          element: heading,
          problem: `H${level}が空です（テキスト内容がありません）`,
          text: `実際のHTML:\n${getElementFullHTML(heading)}`,
          suggestion: 'この見出し要素を削除するか、適切なテキストを追加してください'
        });
      }
    }
    
    // 画像のみのH1に対する警告（エラーではなく警告として）
    if (isImageOnlyH1) {
      debugLog('Checker', 'Image-only H1 detected with alt text');
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: 'H1が画像のみです（SEOとアクセシビリティの観点から改善推奨）',
        text: `実際のHTML:\n${getElementFullHTML(heading)}`,
        suggestion: '画像のH1をテキストベースのH1に変更することを推奨します：<h1>阪急ビューティーオンライン</h1>\n画像は<img>タグとして別途配置してください。'
      });
    }
    
    // 不適切な複数タグ挿入のチェック
    const childElements = heading.children;
    const childTags = Array.from(childElements).map(el => el.tagName);
    
    // 複雑すぎる構造の検出条件を改善
    const hasDeepNesting = checkDeepNesting(heading);
    const hasTooManyChildren = childElements.length >= 5; // 5つ以上の子要素
    const hasMultipleSameTypeTags = childTags.filter(tag => tag === 'SPAN').length >= 5 || // 5つ以上のSPAN
                                    childTags.filter(tag => tag === 'DIV').length >= 3;   // 3つ以上のDIV
    
    // 単純なタグは除外
    const hasOnlySimpleTags = childTags.length > 0 && childTags.every(tag => ALLOWED_SIMPLE_TAGS.includes(tag));
    
    // 単純なタグのみの場合は複雑な構造として扱わない
    const isActuallyComplex = (hasDeepNesting || hasTooManyChildren || hasMultipleSameTypeTags) && !hasOnlySimpleTags;
    
    // デバッグ情報を追加
    debugLog('Checker', `Analyzing H${level} structure:`);
    debugLog('Checker', `- Children count: ${childElements.length}`);
    debugLog('Checker', `- Child tags: ${childTags}`);
    debugLog('Checker', `- SPAN count: ${childTags.filter(tag => tag === 'SPAN').length}`);
    debugLog('Checker', `- DIV count: ${childTags.filter(tag => tag === 'DIV').length}`);
    debugLog('Checker', `- Deep nesting check result: ${hasDeepNesting}`);
    debugLog('Checker', `- Too many children: ${hasTooManyChildren}`);
    debugLog('Checker', `- Multiple same type tags: ${hasMultipleSameTypeTags}`);
    debugLog('Checker', `- Has only simple tags: ${hasOnlySimpleTags}`);
    debugLog('Checker', `- Is actually complex: ${isActuallyComplex}`);
    
    if (isActuallyComplex) {
      debugLog('Checker', `Complex heading structure detected: H${level}`);
      debugLog('Checker', `- Deep nesting: ${hasDeepNesting}, Many children: ${hasTooManyChildren}, Multiple same tags: ${hasMultipleSameTypeTags}`);
      
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: `H${level}の構造が複雑すぎます（${childElements.length}個の子要素、または深いネスト構造）`,
        text: `実際のHTML:\n${getElementFullHTML(heading)}`,
        suggestion: `見出しタグ内の構造をシンプルにしてください。推奨: <h${level}>シンプルなテキスト</h${level}> または <h${level}><span>装飾テキスト</span></h${level}>`
      });
    }
    
    // 装飾目的のH1チェック（フッターロゴなど）
    if (level === 1 && (
      heading.closest('footer') !== null ||
      (heading.className.includes('footer') && heading.className.includes('logo'))
    )) {
      debugLog('Checker', 'Decorative H1 detected in footer');
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: 'H1がフッターに使用されています（装飾目的での不適切な使用）',
        text: `実際のHTML:\n${getElementFullHTML(heading)}`,
        suggestion: 'フッターのロゴはdivやspanに変更し、ページ本文のメインタイトルにH1を使用してください'
      });
    }
    
    // 最初の要素でない場合のレベルジャンプチェック
    if (index > 0 && level - previousLevel > 1) {
      debugLog('Checker', `Level skip detected: H${previousLevel} → H${level}`);
      problematicHeadings.push(heading);
      headingStructureProblems.push({
        element: heading,
        problem: `H${previousLevel}の次にH${level}が来ています（H${previousLevel + 1}をスキップ）`,
        text: `実際のHTML:\n${getElementFullHTML(heading)}`,
        suggestion: `H${level}をH${previousLevel + 1}に変更するか、不足している見出しレベルを追加してください`
      });
    }
    
    // H1が複数ある場合（装飾目的でない場合のみ）
    if (level === 1 && index > 0 && !heading.className.includes('logo') && !heading.className.includes('footer')) {
      const firstH1Index = Array.from(headings).findIndex(h => parseInt(h.tagName.charAt(1)) === 1);
      if (index > firstH1Index) {
        debugLog('Checker', `Multiple H1 detected at index ${index}`);
        problematicHeadings.push(heading);
        headingStructureProblems.push({
          element: heading,
          problem: 'H1が複数存在します（ページに1つのH1のみ推奨）',
          text: `実際のHTML:\n${getElementFullHTML(heading)}`,
          suggestion: 'H1をH2以下に変更するか、このH1を削除してください'
        });
      }
    }
    
    // 見出しレベルの記録
    // テキストがある見出しまたは画像のみのH1の場合はレベルを記録
    if (hasVisibleText || isImageOnlyH1) {
      previousLevel = level;
      if (isImageOnlyH1) {
        debugLog('Checker', `Image-only H1 detected, setting previousLevel to ${level} for proper hierarchy`);
      }
    }
  });

  debugLog('Checker', `Heading analysis complete. Problematic headings: ${problematicHeadings.length}`);
  debugLog('Checker', 'Problematic headings:', problematicHeadings.map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 20) })));

  if (problematicHeadings.length > 0) {
    // 具体的な問題説明と解決策を生成
    const detailedMessage = `${problematicHeadings.length}個の見出しで階層構造に問題があります。適切な見出し構造は、ページの内容を論理的に整理し、スクリーンリーダーユーザーのナビゲーションを改善します。`;
    
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
  return `H1タグの追加方法:

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
<h1>HTML セマンティックチェッカーの使い方</h1>  ← 具体的で有用`;
}

/**
 * 見出し構造の問題に対する解決策をフォーマット
 * @param {Array} problems - 見出しの問題リスト
 * @returns {string} フォーマットされた解決策テキスト
 */
function formatHeadingStructureSolution(problems) {
  const problemsByRule = {
    emptyHeading: problems.filter(p => p.problem.includes('空です')),
    logoH1: problems.filter(p => p.problem.includes('フッター')),
    levelSkip: problems.filter(p => p.problem.includes('スキップ')),
    multipleH1: problems.filter(p => p.problem.includes('複数存在')),
    complexStructure: problems.filter(p => p.problem.includes('複雑すぎます'))
  };

  let solutionText = '';

  // 各問題タイプごとに解決策を生成
  if (problemsByRule.emptyHeading.length > 0) {
    solutionText += formatProblemSection('空の見出しタグ', problemsByRule.emptyHeading, 
      '見出し要素を削除するか、適切なテキストを追加',
      '<h1>ページタイトル</h1> または <div class="logo">サイト名</div>',
      'SEO効果なし、スクリーンリーダーで認識不可');
  }

  if (problemsByRule.logoH1.length > 0) {
    solutionText += formatProblemSection('フッターでのH1使用', problemsByRule.logoH1,
      'フッターのテキストは div または span に変更',
      '<div class="footer__logo">サイト名</div>',
      'H1の意味が曖昧になり、SEOに悪影響');
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
  return `🚨 問題: ${title} (${problems.length}個)
${problems.map(p => `• ${p.text || '(空の要素)'}`).join('\n')}

🔧 修正方法: ${solution}
✅ 例: ${example}
📖 影響: ${impact}

`;
}