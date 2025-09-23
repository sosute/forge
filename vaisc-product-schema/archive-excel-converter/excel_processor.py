#!/usr/bin/env python3
"""
Universal Excel Processor with Claude Integration
Claudeの文脈理解能力を活用した汎用的なExcel処理システム
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
import subprocess
import re
from datetime import datetime


class UniversalProcessor:
    """汎用的なExcel処理エンジン"""
    
    def __init__(self):
        self.claude_system_prompt = """
あなたはExcelデータをAI読みやすい形式に変換する専門家です。
入力されたMarkdownテーブルを分析し、以下の手順で処理してください：

1. データの種類を自動判定（API仕様、スキーマ定義、マスタデータ、レポート等）
2. データ構造の特徴を理解（階層、繰り返し、参照関係等）
3. 最適な出力形式を選択
4. 実用的なドキュメントとして再構成

重要な原則：
- 元データの意味と関係性を正確に理解する
- 空データやノイズは適切に除去する
- 開発者/分析者が実際に使える形式にする
- 日本語の項目名も適切に処理する
"""

    def analyze_with_claude_prompt(self, markdown_content: str) -> str:
        """Claudeに分析と変換を依頼するためのプロンプトを生成"""
        
        # データのサンプリング（最初の50行と特徴的な部分）
        lines = markdown_content.split('\n')
        sample_lines = []
        
        # 最初の部分
        sample_lines.extend(lines[:30])
        
        # JSONやネストが含まれる部分を探す
        for i, line in enumerate(lines[30:200]):
            if any(pattern in line for pattern in ['":', '↳', 'attributes', 'No.', '説明']):
                sample_lines.append(line)
                if len(sample_lines) > 50:
                    break
        
        sample_content = '\n'.join(sample_lines)
        
        prompt = f"""
以下のExcelデータ（Markdown形式）を分析し、AI読みやすい構造化ドキュメントに変換してください。

## 入力データ
```markdown
{sample_content}
```
{f"（全体で{len(lines)}行、サンプルのみ表示）" if len(lines) > 50 else ""}

## 処理指示

### 1. データ種別の判定
まず、このデータが何であるか判定してください：
- API仕様書（JSONサンプル、フィールド定義を含む）
- データスキーマ（データ型、必須/任意、階層構造を含む）
- マスタデータ（コード値と名称の対応表）
- 分析レポート（集計結果、KPI等）
- その他

### 2. 構造分析
- 主要なカラムとその役割
- データの階層構造や繰り返しパターン
- 重要な関連性

### 3. 変換方針
検出したデータ種別に応じて最適な形式で出力してください：

#### API仕様書の場合
- API概要とエンドポイント
- フィールド一覧（型、必須/任意、説明）
- 各フィールドの詳細仕様
- リクエスト/レスポンスのJSON例

#### スキーマ定義の場合
- スキーマ概要（対象システム、用途）
- 基本フィールドとカスタム属性の分類
- データ型別の整理
- 必須項目の強調
- 実装時の注意点

#### マスタデータの場合
- マスタの目的と用途
- コード体系の説明
- 主要な分類とグループ
- 参照時の注意事項

#### その他の場合
- データの目的と概要
- 重要な情報の構造化
- 実用的な形式での整理

### 4. 出力要件
- 開発者や分析者が実務で使える形式
- 目次や索引で検索しやすい構造
- 具体例やサンプルを含める
- 日本語項目は適切に処理し、意味を保持

実際のデータに基づいて、最も適切な形式で変換してください。
"""
        
        return prompt

    def create_full_processing_prompt(self, markdown_content: str) -> str:
        """完全なデータに対する処理プロンプト"""
        
        # ファイルサイズが大きい場合の処理
        max_chars = 50000  # Claude APIの制限を考慮
        if len(markdown_content) > max_chars:
            # 重要な部分を抽出
            lines = markdown_content.split('\n')
            
            # ヘッダーと最初の部分
            important_content = '\n'.join(lines[:100])
            
            # 中間のサンプル
            middle = len(lines) // 2
            important_content += '\n\n... [中間部省略] ...\n\n'
            important_content += '\n'.join(lines[middle-20:middle+20])
            
            # 最後の部分
            important_content += '\n\n... [後半部省略] ...\n\n'
            important_content += '\n'.join(lines[-50:])
            
            content_to_process = important_content
            truncated = True
        else:
            content_to_process = markdown_content
            truncated = False
        
        prompt = f"""
{self.claude_system_prompt}

## 処理対象データ
```markdown
{content_to_process}
```
{f"注意: データが大きいため一部を抜粋しています（元データ: {len(markdown_content)}文字）" if truncated else ""}

このデータを分析し、実用的なドキュメントとして再構成してください。
出力は開発者が実装時に参照できる、完全で正確な仕様書形式にしてください。
"""
        
        return prompt

    def process(self, input_file: str, output_dir: str = None) -> Dict[str, Any]:
        """汎用的な処理メイン"""
        
        input_path = Path(input_file)
        if not input_path.exists():
            raise FileNotFoundError(f"入力ファイルが見つかりません: {input_path}")
        
        # 出力ディレクトリの設定
        if output_dir:
            output_base = Path(output_dir)
        else:
            output_base = Path("output")
        output_base.mkdir(exist_ok=True)
        
        # MarkItDown変換
        print(f"📄 Excelファイルを読み込み中: {input_path}")
        try:
            result = subprocess.run(
                ['python3', '-m', 'markitdown', str(input_path)],
                capture_output=True,
                text=True,
                check=True
            )
            markdown_content = result.stdout
        except subprocess.CalledProcessError as e:
            print(f"❌ MarkItDown変換エラー: {e}")
            return {"status": "error", "message": str(e)}
        
        # 基本情報の取得
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        base_name = input_path.stem
        
        # 出力ファイルパス
        analysis_prompt_path = output_base / f"{base_name}_analysis_prompt.md"
        full_prompt_path = output_base / f"{base_name}_full_prompt.md"
        raw_markdown_path = output_base / f"{base_name}_raw.md"
        
        # 生のMarkdownを保存
        with open(raw_markdown_path, 'w', encoding='utf-8') as f:
            f.write(f"<!-- 変換日時: {timestamp} -->\n")
            f.write(f"<!-- 元ファイル: {input_path} -->\n\n")
            f.write(markdown_content)
        
        # 分析用プロンプトの生成
        print("🔍 データ構造を分析中...")
        analysis_prompt = self.analyze_with_claude_prompt(markdown_content)
        with open(analysis_prompt_path, 'w', encoding='utf-8') as f:
            f.write(analysis_prompt)
        
        # フル処理用プロンプトの生成
        print("📝 Claude用処理プロンプトを生成中...")
        full_prompt = self.create_full_processing_prompt(markdown_content)
        with open(full_prompt_path, 'w', encoding='utf-8') as f:
            f.write(full_prompt)
        
        # 結果サマリ
        result = {
            "status": "success",
            "input_file": str(input_path),
            "timestamp": timestamp,
            "outputs": {
                "raw_markdown": str(raw_markdown_path),
                "analysis_prompt": str(analysis_prompt_path),
                "full_prompt": str(full_prompt_path)
            },
            "stats": {
                "total_lines": len(markdown_content.split('\n')),
                "total_chars": len(markdown_content)
            },
            "next_steps": [
                f"1. 分析プロンプトをClaudeに送信: {analysis_prompt_path}",
                f"2. データ種別を確認後、フル処理プロンプトを送信: {full_prompt_path}",
                "3. Claudeの出力を最終成果物として保存"
            ]
        }
        
        return result


def main():
    parser = argparse.ArgumentParser(
        description='Universal Excel to AI-Readable Processor',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # 基本的な処理
  %(prog)s input.xlsx
  
  # 出力ディレクトリを指定
  %(prog)s input.xlsx -o custom_output
  
  # バッチ処理
  %(prog)s *.xlsx -o results
"""
    )
    
    parser.add_argument('input_files', nargs='+', help='処理するExcelファイル（複数指定可）')
    parser.add_argument('-o', '--output', help='出力ディレクトリ（デフォルト: output）')
    parser.add_argument('-v', '--verbose', action='store_true', help='詳細情報を表示')
    
    args = parser.parse_args()
    
    processor = UniversalProcessor()
    
    # 複数ファイルの処理
    all_results = []
    for input_file in args.input_files:
        print(f"\n{'='*60}")
        print(f"処理中: {input_file}")
        print('='*60)
        
        try:
            result = processor.process(input_file, args.output)
            all_results.append(result)
            
            if result['status'] == 'success':
                print(f"\n✅ 処理完了")
                print(f"📊 統計情報:")
                print(f"   - 総行数: {result['stats']['total_lines']:,}")
                print(f"   - 総文字数: {result['stats']['total_chars']:,}")
                print(f"\n📁 出力ファイル:")
                for key, path in result['outputs'].items():
                    print(f"   - {key}: {path}")
                print(f"\n📝 次のステップ:")
                for step in result['next_steps']:
                    print(f"   {step}")
            else:
                print(f"\n❌ エラー: {result['message']}")
                
        except Exception as e:
            print(f"\n❌ 予期しないエラー: {e}")
            if args.verbose:
                import traceback
                traceback.print_exc()
    
    # サマリ表示
    if len(all_results) > 1:
        print(f"\n{'='*60}")
        print(f"処理サマリ: {len(all_results)}ファイル")
        print('='*60)
        success_count = sum(1 for r in all_results if r['status'] == 'success')
        print(f"✅ 成功: {success_count}")
        print(f"❌ 失敗: {len(all_results) - success_count}")


if __name__ == "__main__":
    main()