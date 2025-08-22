/**
 * メイン分析エンジン
 * 各分析モジュールを統合し、全体的な分析を実行
 */

import { debugLog, errorLog } from '../utils/debug.js';
import { isHtmlCheckerElement } from '../utils/dom.js';
import { getAnalysisTargetElements } from './element-preprocessor.js';
import { analyzeHeadingStructure, detectHeadingIssues } from '../analysis/heading.js';
import { analyzeAccessibility, detectAccessibilityIssues } from '../analysis/accessibility.js';
import { detectSemanticIssues } from '../analysis/semantic.js';
import { detectCleanupIssues } from '../analysis/cleanup.js';
// Removed non-original modules: seo.js and structure.js

/**
 * 完全なページ分析を実行
 * @returns {Object} 分析結果
 */
export function performFullCheck() {
  debugLog('Engine', 'Starting full semantic analysis...');
  
  try {
    // Phase 1: 要素の事前プリプロセス（一度だけ実行）
    const targetElements = getAnalysisTargetElements();
    
    const results = {
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
    
    debugLog('Engine', 'Full analysis completed:', results);
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
  const allDocumentElements = document.querySelectorAll('*').length;
  const processedElements = targetElements.headings.all.length + 
                           targetElements.accessibility.images.length + 
                           targetElements.accessibility.links.length;
  
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
  const performanceData = {
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
  let score = 100;
  
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
  const allIssues = [];
  
  try {
    // 各分析モジュールから問題を検出（プリプロセス済み要素を渡す）
    const headingIssues = detectHeadingIssues(targetElements);
    const accessibilityIssues = detectAccessibilityIssues(targetElements);
    const semanticIssues = detectSemanticIssues(targetElements);
    const cleanupIssues = detectCleanupIssues(targetElements);
    
    // 全問題をマージ
    allIssues.push(...headingIssues);
    allIssues.push(...accessibilityIssues);
    allIssues.push(...semanticIssues);
    allIssues.push(...cleanupIssues);
    
    debugLog('Engine', `Total issues detected: ${allIssues.length}`);
    
    // 重要度順にソート
    allIssues.sort((a, b) => {
      const severityOrder = { 'error': 3, 'warning': 2, 'info': 1 };
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
export function generateIssueSummary(issues) {
  const summary = {
    total: issues.length,
    byCategory: {},
    bySeverity: {
      error: 0,
      warning: 0,
      info: 0
    }
  };
  
  issues.forEach(issue => {
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
export function calculateOverallScore(results) {
  let score = 100;
  
  // 問題の重要度に基づくペナルティ
  results.issues.forEach(issue => {
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
  const semanticElements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  semanticElements.forEach(element => {
    if (results.semantic[element] > 0) {
      score += 2;
    }
  });
  
  // パフォーマンススコアを加味
  score = (score + results.performance.performanceScore) / 2;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}