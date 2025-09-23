# Excel to Markdown Reformatter - Architecture Design

## プロジェクト概要

Python + Claude Code ハイブリッド版のExcel-Markdown変換ツール
- **コアエンジン**: Python（データ処理特化）
- **AI支援**: Claude Code連携（オプション）
- **汎用性**: スタンドアロン実行可能

## アーキテクチャ構成

```
excel-markdown-reformatter/
├── core/                           # コアエンジン（Python）
│   ├── __init__.py
│   ├── converter.py               # MarkItDown統合
│   ├── cleaner.py                 # データクリーニング
│   ├── analyzer.py                # ファイル分析
│   ├── merger.py                  # シート統合
│   └── config.py                  # 設定管理
├── claude_integration/             # Claude Code連携
│   ├── __init__.py
│   ├── commands.py                # スラッシュコマンド風インターフェース
│   └── prompts.py                 # プロンプトテンプレート
├── cli/                           # コマンドライン界面
│   ├── __init__.py
│   ├── main.py                    # メインCLI
│   └── interactive.py             # 対話モード
├── config/                        # 設定ファイル
│   ├── default.yaml               # デフォルト設定
│   └── custom.yaml.example        # カスタム設定例
├── tests/                         # テスト
│   ├── test_converter.py
│   ├── test_cleaner.py
│   └── sample_data/
│       ├── sample.xlsx
│       └── expected_output.md
├── docs/                          # ドキュメント
│   ├── README.md
│   ├── API.md
│   └── EXAMPLES.md
├── requirements.txt               # Python依存関係
├── setup.py                      # インストール設定
└── excel_reformatter.py          # 単一ファイル版（簡易実行用）
```

## 機能設計

### 1. コアエンジン（Python）

#### converter.py - MarkItDown統合
```python
class ExcelConverter:
    def convert_excel_to_markdown(self, excel_path: str) -> str
    def get_sheet_info(self, excel_path: str) -> List[SheetInfo]
    def validate_excel_file(self, path: str) -> bool
```

#### cleaner.py - データクリーニング
```python
class MarkdownCleaner:
    def clean_table(self, markdown: str) -> str
    def remove_nan_values(self, content: str) -> str
    def remove_unnamed_columns(self, content: str) -> str
    def format_numbers(self, content: str) -> str
    def enhance_readability(self, content: str) -> str
```

#### analyzer.py - ファイル分析
```python
class FileAnalyzer:
    def analyze_structure(self, markdown: str) -> AnalysisResult
    def detect_issues(self, content: str) -> List[Issue]
    def generate_report(self, analysis: AnalysisResult) -> str
    def estimate_complexity(self, content: str) -> float
```

#### merger.py - シート統合
```python
class SheetMerger:
    def merge_sheets(self, sheet_files: List[str]) -> str
    def create_toc(self, sheets: List[Sheet]) -> str
    def add_metadata(self, content: str, metadata: dict) -> str
```

### 2. Claude Code連携（オプション）

#### commands.py - スラッシュコマンド風
```python
def excel_prepare(file_path: str) -> str:
    """既存の /excel-md:prepare 相当"""

def excel_transform(transform_prompt: str) -> List[str]:
    """既存の /excel-md:transform 相当"""

def excel_merge(basename: str) -> str:
    """既存の /excel-md:merge 相当"""
```

### 3. コマンドライン界面

#### 基本コマンド
```bash
# 基本変換
python excel_reformatter.py convert sample.xlsx

# 詳細分析付き
python excel_reformatter.py analyze sample.xlsx --verbose

# 対話モード
python excel_reformatter.py interactive sample.xlsx

# Claude統合モード
python excel_reformatter.py claude-mode sample.xlsx
```

#### 設定オプション
```bash
# カスタム設定使用
python excel_reformatter.py convert sample.xlsx --config custom.yaml

# 出力ディレクトリ指定
python excel_reformatter.py convert sample.xlsx --output ./output/

# 特定シートのみ処理
python excel_reformatter.py convert sample.xlsx --sheets "Sheet1,Sheet3"
```

## 設定システム

### default.yaml
```yaml
# クリーニング設定
cleaning:
  remove_nan: true
  remove_unnamed_columns: true
  format_numbers: true
  empty_cell_threshold: 0.8

# 出力設定
output:
  add_metadata: true
  create_toc: true
  sheet_separator: "\n\n---\n\n"

# AI支援設定
ai_enhancement:
  enabled: false
  auto_descriptions: false
  data_insights: false
```

## 実行フロー

### 1. 基本フロー
```
Excel → MarkItDown → Analyzer → Cleaner → Merger → Output
```

### 2. Claude統合フロー
```
Excel → MarkItDown → Analyzer → Claude Analysis → 
Enhanced Cleaner → AI Insights → Merger → Enhanced Output
```

## 改良ポイント

### 既存システムからの改良
1. **設定可能性**: YAML設定でカスタマイズ可能
2. **段階実行**: 各段階を個別実行可能
3. **詳細分析**: ファイル構造とデータ品質の詳細レポート
4. **エラーハンドリング**: 堅牢なエラー処理と復旧機能
5. **バッチ処理**: 複数ファイル一括処理
6. **拡張性**: プラグインシステム（将来）

### AI読みやすさ向上
1. **構造化**: 明確な見出し階層
2. **メタデータ**: データ概要と統計情報
3. **品質指標**: データ品質スコア
4. **コンテキスト**: データの背景情報（オプション）

## 次のステップ

1. コアエンジンの実装
2. 基本CLIの作成
3. テストデータでの検証
4. Claude統合機能の追加
5. ドキュメント整備