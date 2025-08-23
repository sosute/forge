/**
 * デバッグ関連のユーティリティ
 */

import { CONFIG } from '../config.js';

/**
 * 条件付きログ出力
 * @param {string} prefix - ログのプレフィックス
 * @param {...any} args - ログ引数
 */
export function debugLog(prefix, ...args) {
  if (CONFIG.debug) {
    console.log(`[${prefix}]`, ...args);
  }
}

/**
 * エラーログ出力
 * @param {string} prefix - ログのプレフィックス
 * @param {...any} args - ログ引数
 */
export function errorLog(prefix, ...args) {
  console.error(`[${prefix}]`, ...args);
}

/**
 * 警告ログ出力
 * @param {string} prefix - ログのプレフィックス
 * @param {...any} args - ログ引数
 */
export function warnLog(prefix, ...args) {
  console.warn(`[${prefix}]`, ...args);
}
