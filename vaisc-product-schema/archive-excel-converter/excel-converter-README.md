# Excel to AI-Readable Converter

ExcelファイルをAI読みやすい構造化Markdownに変換するツールセット

## 📁 ディレクトリ構成

```
markltdown/
├── README.md                    # このファイル
├── requirements.txt             # Python依存関係
├── project_architecture.md     # プロジェクト設計書
│
├── input/                       # 入力Excelファイル
│   ├── VAISC：フロントAPI対応.xlsx
│   └── 丸井商品データ_VAISCスキーマ加工案.xlsx
│
├── output/                      # 変換結果
│   ├── VAISC_search_API_仕様書.md
│   └── 丸井商品データ_VAISCスキーマ仕様書.md
│
├── config/                      # 変換設定
│   ├── default.yaml
│   ├── gentle.yaml
│   └── smart.yaml
│
├── core/                        # コアライブラリ
│   ├── converter.py
│   ├── cleaner.py
│   └── config.py
│
├── processors/                  # 専用プロセッサー
│   └── simple_processor.py
│
├── reference/                   # 参考資料
│   └── CLAUDE.md
│
├── excel_reformatter.py        # メイン変換ツール
└── excel_processor.py          # 汎用プロセッサー
```

## 🚀 使用方法

### 基本的な変換

```bash
# 仮想環境のアクティベート
source .venv/bin/activate

# 基本的なExcel変換
python3 excel_reformatter.py input/your_file.xlsx --output output/result.md

# 特定のシート指定
python3 excel_reformatter.py input/your_file.xlsx --sheets "シート名"

# 汎用プロセッサーでClaude用プロンプト生成
python3 excel_processor.py input/your_file.xlsx
```

### 設定ファイルの使用

```bash
# 穏やかなクリーニング（データ保持優先）
python3 excel_reformatter.py input/file.xlsx --config config/gentle.yaml

# スマートクリーニング（バランス型）
python3 excel_reformatter.py input/file.xlsx --config config/smart.yaml
```

## 📊 実績

### 変換成功事例

1. **VAISC API仕様書**
   - 入力: 125列×89行のスパーステーブル
   - 出力: 45個のAPIフィールドを整理した仕様書
   - 特徴: JSON例、型情報、説明を含む開発者向け仕様

2. **丸井VAISCスキーマ設計書**
   - 入力: Google Cloud Vertex AI Searchスキーマ定義
   - 出力: 基本フィールド51個+商品属性64個の構造化仕様
   - 特徴: データ型別分類、必須項目強調、実装ガイド

## 🛠️ 技術仕様

- **変換エンジン**: MarkItDown (Microsoft製)
- **クリーニング**: カスタムPythonロジック
- **構造化**: Claude AI連携
- **出力形式**: GitHub flavored Markdown

## 📝 設定例

### config/gentle.yaml
```yaml
cleaning:
  remove_unnamed_columns: false
  empty_cell_threshold: 0.95
  preserve_formulas: true
```

### config/smart.yaml
```yaml
cleaning:
  remove_unnamed_columns: true
  empty_cell_threshold: 0.7
  format_numbers: true
```

## 🔄 開発履歴

1. MarkItDownによる基本変換機能
2. データクリーニング・最適化
3. シート選択機能
4. AI読みやすさ向上
5. 汎用プロセッサーによるClaude連携

## 📚 参考

- [MarkItDown Documentation](https://github.com/microsoft/markitdown)
- [プロジェクト設計書](project_architecture.md)
- [Claude連携ガイド](reference/CLAUDE.md)