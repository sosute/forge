# 実際のAPI分析結果

## 概要
実際のAPIエンドポイントから取得した情報を分析し、仕様書では確認できなかった詳細情報を整理。

## 1. Search API の実際のレスポンス分析

### 1.1 ソートメニューの詳細値
仕様書では不明だったsortbyの具体的な値が判明：

| ID | 名称 | 用途 |
|----|------|------|
| 0 | キーワードと関連度が高い順 | デフォルトソート |
| 1 | 新着順 | 新着商品優先 |
| 2 | 価格の安い順 | 価格昇順 |
| 3 | 価格の高い順 | 価格降順 |
| 4 | 割引率の高い順 | 割引率降順 |

### 1.2 追加のレスポンスフィールド
仕様書に記載されていなかった追加フィールド：

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `isBannerVisible` | boolean | バナー表示フラグ | true |
| `store` | object | ストア情報 | - |

### 1.3 実際のフラグ値
実際のレスポンスで確認されたフラグ：
- `pricereduced`: false
- `sale`: false  
- `newarrival`: true
- `limitedsale`: false
- `coupon`: false
- `bulkdiscount`: true

## 2. Menu API の実際のレスポンス分析

### 2.1 フィルタリング用メタデータ
Menu APIは商品リストではなく、フィルタリング用の豊富なメタデータを提供：

#### 2.1.1 人気キーワード
```json
"popularKeywords": [
  {
    "keyword": "スニーカー",
    "count": 1234
  }
]
```

#### 2.1.2 ブランド情報
```json
"brands": [
  {
    "brandCode": "10001",
    "brandName": "アディダス",
    "count": 456,
    "isSelected": false
  }
]
```

#### 2.1.3 カテゴリ階層
```json
"categories": {
  "store": [
    {
      "id": "1", 
      "name": "ファッション",
      "count": 2000
    }
  ],
  "firstCategory": [...],
  "secondCategory": [...]
}
```

#### 2.1.4 属性フィルタ
```json
"attributes": {
  "size": [...],
  "color": [...],
  "priceRange": [...],
  "discountRate": [...]
}
```

### 2.2 Search APIにない機能
Menu APIでのみ提供される機能：

1. **動的フィルタ件数**: 各フィルタ項目に該当商品数を表示
2. **人気キーワード**: 検索候補として利用可能
3. **お気に入りショップ**: ユーザー個別情報
4. **ハッシュタグ**: SNS連携用データ

## 3. 既存分析との差分

### 3.1 新たに判明した情報

#### 3.1.1 ソート機能
| 項目 | 仕様書 | 実際のAPI | 差分 |
|------|-------|----------|------|
| ソート種類 | 詳細値要確認 | 5種類特定 | ✅ 具体値判明 |
| 関連度順 | 想定のみ | 実装確認 | ✅ 実装確認 |
| 割引率順 | 記載なし | 実装確認 | 🆕 新機能発見 |

#### 3.1.2 レスポンス追加フィールド
| フィールド | 仕様書 | 実際のAPI | 用途 |
|-----------|-------|----------|------|
| `isBannerVisible` | 記載なし | boolean | バナー表示制御 |
| `store` | 記載なし | object | ストア情報 |

#### 3.1.3 Menu API専用機能
| 機能 | 説明 | VAISCでの活用 |
|------|------|-------------|
| 動的フィルタ件数 | フィルタ項目ごとの該当商品数 | ファセット検索として活用可能 |
| 人気キーワード | 検索トレンド情報 | 検索候補・レコメンデーション |
| ハッシュタグ | SNS連携用タグ | 新機能として検討可能 |

### 3.2 DB項目への影響

#### 3.2.1 新たに必要な項目
1. **`isBannerVisible`用データ** - バナー表示制御
2. **動的件数計算用インデックス** - ファセット検索対応
3. **人気度スコア** - 人気キーワード・関連度ソート用

#### 3.2.2 確認が取れた対応関係
1. **割引率ソート** - `i_discount_rate`で対応可能
2. **関連度ソート** - VAISC側で計算
3. **バナー制御** - 新規フィールド必要

## 4. VAISC CSVフォーマットへの影響

### 4.1 必須追加フィールド

#### 4.1.1 ソート対応
```csv
# 関連度ソート用（VAISC側で計算されるため、検索対象フィールドを充実）
product_name_searchable,
product_description_searchable,
keywords_searchable,

# 割引率ソート用
discount_rate
```

#### 4.1.2 ファセット検索対応
```csv
# 動的件数計算用のカテゴリ分類
store_id,
first_category_id,
second_category_id,
brand_id,
size_id,
color_id
```

#### 4.1.3 新機能対応
```csv
# バナー表示制御
banner_visible_flag,

# 人気度指標（将来の人気順ソート用）
popularity_score
```

### 4.2 フィールド用途分類の更新

#### 🔍 索引として利用
- 既存の検索対象フィールド
- ファセット検索用カテゴリフィールド
- ソート用数値フィールド

#### 📤 APIレスポンス取得データ  
- 商品基本情報
- フラグ情報
- 新規：バナー表示フラグ

#### ⚙️ 機能実装のために利用
- 検索制御フラグ
- 表示制御フラグ
- 新規：人気度スコア

## 6. パラメータ変更テストの結果

### 6.1 ソート機能の動作確認
**テスト**: `sortby=2&per=5` (価格高い順)

| 機能 | 動作確認 | 備考 |
|------|----------|------|
| 価格ソート | ✅ 正常動作 | 132,000円→61,600円の降順 |
| ページング | ✅ 正常動作 | per=5で5件表示、total=2,789件 |
| ソートメニュー | ✅ 状態管理 | isSelected=trueで現在のソート表示 |

### 6.2 フィルタリング機能の動作確認
**テスト**: `figure=1` (レディース)

| 項目 | 結果 | 詳細 |
|------|------|------|
| 商品件数変化 | ✅ 確認 | 2,789件 → 1,142件に絞り込み |
| サイズフィルタ | ✅ 適応 | 女性向けサイズ（SS-LL, 22.0-25.0cm）に変化 |
| カテゴリ更新 | ✅ 動的 | レディース向けカテゴリに自動調整 |

### 6.3 セールフラグの動作確認
**テスト**: `sale=1` (セール商品)

| 項目 | 確認内容 | 実際の値 |
|------|----------|----------|
| セールフラグ | sale=true | 該当商品で確認 |
| 価格情報 | 定価・セール価格 | 16,500円 → 9,900円 |
| 割引率 | discountRate | 40% |
| まとめ割 | bulkdiscount | 2点以上で10%OFF |

### 6.4 新たに判明した重要情報

#### 6.4.1 動的フィルタリングの詳細
1. **Menu API**: フィルタ適用時に件数がリアルタイム更新
2. **カテゴリ連動**: 性別フィルタ適用時にサイズ・カテゴリが自動調整
3. **ファセット機能**: 各フィルタ項目に該当商品数を表示

#### 6.4.2 価格・割引情報の扱い
1. **二重価格表示**: `taxInclusivePrice`（現在価格）と`oldPrice`（元価格）
2. **割引率計算**: 自動計算された`discountRate`
3. **まとめ割**: 別途`bulkdiscount`フラグとメッセージ

#### 6.4.3 ソート機能の詳細仕様
| sortby | 名称 | 実装確認 |
|--------|------|----------|
| 0 | 関連度順 | ✅ デフォルト |
| 1 | 新着順 | ✅ 確認 |
| 2 | 価格高い順 | ✅ テスト済み |
| 3 | 価格安い順 | ✅ 確認 |
| 4 | 割引率高い順 | ✅ 確認 |

## 7. CSVフォーマット設計への最終的な影響

### 7.1 必須フィールドの確定

#### 🔍 索引として利用 (検索・フィルタリング用)
```csv
# 基本検索
product_name_ngram,
product_description_ngram,
freeword_tags,

# カテゴリフィルタ
store_id,
figure_main,
primary_item_code,
secondary_item_code,
brand_code,

# 属性フィルタ  
price_current,
price_original,
discount_rate,
size_id,
color_id,
keywords_id,

# 日付フィルタ
sale_start_date,
arrival_date,

# フラグフィルタ (14種類)
flag_pricereduced,
flag_sale,
flag_giftwrap,
flag_rearrival,
flag_newarrival,
flag_limitedsale,
flag_salespromotion,
flag_deliveryfeeoff,
flag_secretsale,
flag_reservation,
flag_used,
flag_coupon,
flag_bulkdiscount,
flag_banner_visible
```

#### 📤 APIレスポンス用 (クライアント返却)
```csv
# 商品基本情報
product_id,
product_name_1,
product_name_2,
detail_url,
image_url,
brand_name_jp,
brand_name_en,
category_name,

# 価格情報
tax_inclusive_price,
old_price,
discount_rate,

# ユーザー評価
comment_count,
evaluation_average,
favorite_count,

# 特別情報
coupon_thumbnail,
bulk_discount_message
```

#### ⚙️ 機能実装用 (内部処理)
```csv
# 検索制御
search_display_flag,
freeword_search_exclude_flag,
recommend_display_flag,
ranking_display_flag,

# ソート用データ
popularity_score,
arrival_date_for_sort,

# 表示制御
color_representative_flag,
bulk_discount_min_qty,
bulk_discount_rate
```

## 8. 次のステップ: 最終CSVフォーマット策定

この実API分析結果を基に、完全なCSVデータフォーマットを策定します。