# Input Directory

ここにExcelファイル（.xlsx, .xls）を配置してください。

## 使用方法

### 1. Excelファイルの配置
```bash
# このディレクトリにExcelファイルをコピー
cp /path/to/your/file.xlsx input/

# または直接移動
mv /path/to/your/file.xlsx input/
```

### 2. 変換実行
```bash
# 基本変換
python excel_reformatter.py input/your_file.xlsx

# 詳細モード
python excel_reformatter.py input/your_file.xlsx -v

# 出力先指定
python excel_reformatter.py input/your_file.xlsx -o output/result.md
```

## ディレクトリ構造
```
markltdown/
├── input/           ← ここにExcelファイルを配置
│   ├── file1.xlsx
│   ├── file2.xls
│   └── ...
├── output/          ← 変換結果がここに出力
│   ├── file1_reformed.md
│   ├── file2_reformed.md
│   └── ...
└── excel_reformatter.py  ← 変換ツール
```

## 対応ファイル形式
- `.xlsx` (Excel 2007以降)
- `.xls` (Excel 97-2003)

## ファイルサイズ制限
- 推奨: 10MB以下
- 最大: 50MB（設定で変更可能）