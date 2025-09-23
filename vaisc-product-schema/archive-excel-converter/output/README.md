# Output Directory

変換されたMarkdownファイルがここに出力されます。

## 出力ファイルの命名規則

### デフォルト命名
- 入力: `input/sample.xlsx`
- 出力: `sample_reformed.md`（カレントディレクトリ）

### 出力先指定
```bash
# output/ディレクトリに出力
python excel_reformatter.py input/sample.xlsx -o output/sample_clean.md
```

## 出力ファイルの内容

### メタデータヘッダー
```html
<!-- Excel Markdown Reformatter で生成 -->
<!-- 元ファイル: sample.xlsx -->
<!-- 処理日時: 2024-01-01 12:00:00 -->
<!-- NaN除去: 5, Unnamed列除去: 2 -->
```

### データ統計情報
```markdown
## Sheet1

**データ行数**: 10行
**データ列数**: 5列
**データ品質**: 85.2%

| 列1 | 列2 | ... |
| --- | --- | --- |
| データ1 | データ2 | ... |
```

## ファイル管理のヒント

### 整理方法
```bash
# 日付別フォルダ作成
mkdir -p output/$(date +%Y-%m-%d)
python excel_reformatter.py input/file.xlsx -o output/$(date +%Y-%m-%d)/file_reformed.md

# プロジェクト別整理
mkdir -p output/project_a
python excel_reformatter.py input/project_a_data.xlsx -o output/project_a/data_reformed.md
```