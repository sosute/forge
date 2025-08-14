#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 圧縮処理
function compressCode(sourceCode) {
  // 文字列を一時的に保護
  const strings = [];
  let stringIndex = 0;

  // 文字列を保存してプレースホルダーに置換
  sourceCode = sourceCode.replace(
    /(['"`])((?:\\.|[^\\])*?)\1/g,
    (match, quote, content) => {
      const placeholder = `__STRING_${stringIndex}__`;
      strings[stringIndex] = match;
      stringIndex++;
      return placeholder;
    }
  );

  // コメントを削除
  sourceCode = sourceCode
    .replace(/\/\*[\s\S]*?\*\//g, "") // ブロックコメント
    .replace(/\/\/.*$/gm, ""); // 行コメント

  // 不要な空白と改行を削除
  sourceCode = sourceCode
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*\[\s*/g, "[")
    .replace(/\s*\]\s*/g, "]")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*=\s*/g, "=")
    .replace(/\s*\+\s*/g, "+")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*\*\s*/g, "*")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*%\s*/g, "%")
    .replace(/\s*&&\s*/g, "&&")
    .replace(/\s*\|\|\s*/g, "||")
    .replace(/\s*===\s*/g, "===")
    .replace(/\s*!==\s*/g, "!==")
    .replace(/\s*==\s*/g, "==")
    .replace(/\s*!=\s*/g, "!=")
    .replace(/\s*>\s*/g, ">")
    .replace(/\s*<\s*/g, "<")
    .replace(/\s*>=\s*/g, ">=")
    .replace(/\s*<=\s*/g, "<=")
    .trim()
    .replace(/\s+/g, " ");

  // 文字列を復元
  strings.forEach((str, index) => {
    sourceCode = sourceCode.replace(`__STRING_${index}__`, str);
  });

  // 最終的な改行と空白の削除
  sourceCode = sourceCode
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\t/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return sourceCode;
}

// メイン処理
function main() {
  const sourceFile = path.join(__dirname, "html-checker-source.js");
  const outputFile = path.join(__dirname, "html-checker-compressed.js");

  try {
    // ソースファイルを読み込み
    const sourceCode = fs.readFileSync(sourceFile, "utf8");

    // 圧縮処理
    const compressedCode = compressCode(sourceCode);

    // 圧縮結果をファイルに出力
    fs.writeFileSync(outputFile, compressedCode, "utf8");

    console.log("✅ 圧縮完了！");
    console.log(`📁 出力ファイル: ${outputFile}`);
    console.log(`📊 圧縮前: ${sourceCode.length} 文字`);
    console.log(`📊 圧縮後: ${compressedCode.length} 文字`);
    console.log(
      `📈 圧縮率: ${(
        (1 - compressedCode.length / sourceCode.length) *
        100
      ).toFixed(1)}%`
    );

    // 改行チェック
    const hasNewlines =
      compressedCode.includes("\n") || compressedCode.includes("\r");
    if (hasNewlines) {
      console.log("⚠️  圧縮されたコードに改行が含まれています");
    } else {
      console.log("✅ 改行なしで圧縮完了");
    }

    // 構文チェック
    try {
      // 構文エラーのチェック（evalは使用しない）
      const testCode = compressedCode.replace(/^javascript:/, "");
      new Function(testCode);
      console.log("✅ 構文チェック完了");
    } catch (syntaxError) {
      console.error("❌ 構文エラーが検出されました:", syntaxError.message);
      console.log("⚠️  圧縮されたコードに問題があります");
    }

    // ブックマークレット用の使用方法を表示
    console.log("\n📖 使用方法:");
    console.log("1. 圧縮されたコードをコピー");
    console.log("2. ブラウザで新しいブックマークを作成");
    console.log("3. URLにコピーしたコードを貼り付け");
    console.log("4. チェックしたいページでブックマークレットを実行");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  main();
}

module.exports = { compressCode };
