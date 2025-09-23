# VAISC BigQuery経由インポート用 JSON形式仕様書

## 📋 プロジェクト概要

**目的**: 既存DB → JSON生成 → BigQuery Import → VAISC Import のフローで利用するJSON形式仕様書

**技術制約**:
- BigQuery: NDJSON (Newline Delimited JSON) 形式推奨
- VAISC: Retail API Product schema準拠必須
- UTF-8エンコーディング必須

## 🎯 VAISC準拠JSON仕様

### 📦 基本構造（Product Schema）

**⚠️ 要確認: VAISC Product Schema準拠の完全性要検証**

```json
{
  "id": "string (required)",
  "title": "string (required, max 1250 chars)",
  "description": "string (optional)",
  "categories": ["string (required, at least 1)"],
  "brands": ["string (optional, repeatable)"],
  "priceInfo": {
    "currencyCode": "string (optional, default: JPY)",
    "price": number,
    "originalPrice": number,
    "cost": number
  },
  "availability": "string (enum)",  // ⚠️ 要確認: VAISC許可値リスト要確認
  "uri": "string (optional)",
  "images": [
    {
      "uri": "string",
      "height": number,
      "width": number
    }
  ],
  "audience": {
    "genders": ["string"],
    "ageGroups": ["string"]
  },
  "colorInfo": {
    "colorFamilies": ["string"],
    "colors": ["string"]
  },
  "sizes": ["string"],
  "materials": ["string"],
  "attributes": [
    {
      "key": "string",
      "value": {
        "text": ["string"],
        "numbers": [number]
      }
    }
  ]
}
```

## 🗂️ 詳細フィールドマッピング（DB → JSON → API互換性）

> **📋 マッピング表の見方**  
> - **既存APIフィールド**: 現行search/menu APIで使用されているフィールド名  
> - **DBフィールド**: データベース内での実際のカラム名  
> - **VAISCフィールド**: Google VAISC Product Schemaでの標準フィールド名  
> - **❌**: 既存APIには存在しないが、VAISCで新規追加される項目

### 🔴 必須フィールド（Required Fields）

> **⚠️ 重要**: これらのフィールドはVAISCへのインポートに**絶対必要**です

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| `productId` | `s_product_id` | `"CF0212351201"` | `id` | `"CF0212351201"` | string | 商品一意識別子（主キー） |
| `productName1` | `n_product_name_1` | `"ニットTシャツ"` | `title` | `"ニットTシャツ"` | string | 商品名（検索・表示用） |
| `scdName` | `t_item_code_text` | `"ニット・セーター"` | `categories[]` | `["ファッション", "レディース", "ニット・セーター"]` | string[] | ⚠️ 要確認: カテゴリ階層構築ルール要検証 |

### 💰 価格情報（Price Information）

> **📝 注意**: VAISCスキーマ上はオプションですが、Eコマースでは**実質必須**項目です

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| ❌ (新規) | 固定値 | `"JPY"` | `priceInfo.currencyCode` | `"JPY"` | string | ⚠️ 要確認: 通貨コード固定値の妥当性要検証 |
| `taxInclusivePrice` | `i_tax_inclusive_price` | `4990` | `priceInfo.price` | `4990` | number | 現在販売価格（税込） |
| `oldPrice` | `i_old_price` | `5490` | `priceInfo.originalPrice` | `5490` | number | 元価格（二重価格表示用） |

### 🏷️ ブランド・基本情報

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| `brandTextJP` | `s_web_brand_code_text_jp` | `"アイテムズ アーバンリサーチ"` | `brands[]` | `["アイテムズ アーバンリサーチ"]` | string[] | ⚠️ 要確認: DBフィールド名要検証 |
| ❌ (商品説明なし) | `n_caption` | `"なめらかで肌触りのいいニット素材..."` | `description` | `"なめらかで肌触りのいい..."` | string | ⚠️ 要確認: DBフィールド名・内容要検証 |
| `detailUrl` | `url` | `"https://voi.0101.co.jp/..."` | `uri` | `"https://voi.0101.co.jp/..."` | string | ⚠️ 要確認: DBフィールド名要検証 |

### 📸 画像情報

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| `imageURL` | `s_thumb_img` | `"https://image.0101.co.jp/img/goods/CF0212351201/thumb.jpg"` | `images[].uri` | `[{"uri": "https://image.0101.co.jp/..."}]` | object[] | ⚠️ 要確認: DBフィールド名・URL形式要検証 |

### 👥 対象者情報（Audience）

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| ❌ (性別フィルタ用) | `i_figure_main` | `1` | `audience.genders` | `["female"]` | string[] | ⚠️ 要確認: 数値コードマッピング要検証 |

### 🎨 カラー情報（Color Information）

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| `colorProducts[].colorName` | `sm_color_search` | `"ブラウン,ホワイト,ブラック"` | `colorInfo.colors` | `["ブラウン", "ホワイト", "ブラック"]` | string[] | ⚠️ 要確認: DBフィールド名・形式要検証 |
| `colorProducts[].colorId` | `sm_color_id` | `"brown,white,black"` | `attributes.color_id` | `{"key":"color_id","value":{"text":["brown","white","black"]}}` | attribute | ⚠️ 要確認: DBフィールド名・VAISC属性キー要検証 |

### 📏 サイズ情報

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCフィールド | JSON構造 | データ型 | 説明 |
|------------------|-------------|----------------|----------------|---------|----------|------|
| ❌ (サイズフィルタ用) | `sm_size_search` | `"フリー,M,L"` | `sizes` | `["フリー", "M", "L"]` | string[] | ⚠️ 要確認: DBフィールド名・形式要検証 |
| ❌ (サイズID用) | `sm_size_id` | `"90001,90002,90003"` | `attributes.size_id` | `{"key":"size_id","value":{"text":["90001","90002","90003"]}}` | attribute | ⚠️ 要確認: DBフィールド名・VAISC属性キー要検証 |

## 🏷️ カスタム属性詳細マッピング（Custom Attributes）

> **🔧 機能説明**: VAISCの`attributes`配列を使用してDB固有の情報を格納  
> **📋 構造**: `{"key": "属性名", "value": {"text": ["文字列値"], "numbers": [数値]}}` 形式  
> **⚠️ 要確認**: 全カスタム属性キーのVAISC対応可否要検証

### 🔍 フィルタリング用属性

> **用途**: 検索・絞り込み機能で使用される属性

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `store` (パラメータ) | `i_store` | `6` | `store_id` | `{"key":"store_id","value":{"numbers":[6]}}` | ストアフィルタ |
| `bcd` (パラメータ) | `s_web_brand_code` | `"30095"` | `brand_code` | `{"key":"brand_code","value":{"text":["30095"]}}` | ブランドフィルタ |
| `fcd` (パラメータ) | `sm_primary_item` | `30001` | `primary_item_code` | `{"key":"primary_item_code","value":{"numbers":[30001]}}` | 第1カテゴリフィルタ |
| `scd` (パラメータ) | `sm_secondary_item` | `30162` | `secondary_item_code` | `{"key":"secondary_item_code","value":{"numbers":[30162]}}` | 第2カテゴリフィルタ |
| `discountRate` | `i_discount_rate` | `9` | `discount_rate` | `{"key":"discount_rate","value":{"numbers":[9]}}` | 割引率表示・ソート |

### 🚩 商品フラグ属性

> **用途**: 商品の状態・特性を示すフラグ情報

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `flags.newarrival` | `i_icon_flag_newarrival` | `1` (true) | `flag_newarrival` | `{"key":"flag_newarrival","value":{"text":["true"]}}` | 新着フラグ表示・フィルタ |
| `flags.sale` | `i_icon_flag_sale` | `0` (false) | `flag_sale` | `{"key":"flag_sale","value":{"text":["false"]}}` | セールフラグ表示・フィルタ |
| `flags.giftwrap` | `i_icon_flag_giftwrap` | `0` (false) | `flag_giftwrap` | `{"key":"flag_giftwrap","value":{"text":["false"]}}` | ギフトラッピング可能表示 |
| `flags.bulkdiscount` | `i_icon_flag_bulk_discount` | `1` (true) | `flag_bulkdiscount` | `{"key":"flag_bulkdiscount","value":{"text":["true"]}}` | まとめ割表示・フィルタ |
| `flags.pricereduced` | `i_icon_flag_pricereduced` | `1` (true) | `flag_pricereduced` | `{"key":"flag_pricereduced","value":{"text":["true"]}}` | 値下げフラグ表示 |
| `flags.coupon` | `i_icon_flag_coupon` | `0` (false) | `flag_coupon` | `{"key":"flag_coupon","value":{"text":["false"]}}` | クーポン対象表示・フィルタ |

### ⭐ 評価・メタデータ属性

> **用途**: ユーザー評価・ソーシャル情報の表示・ソート

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `commentCount` | `i_comment_count` | `2` | `comment_count` | `{"key":"comment_count","value":{"numbers":[2]}}` | ユーザーコメント数表示 |
| `evaluationAverage` | `f_evaluation_average` | `4.5` | `evaluation_average` | `{"key":"evaluation_average","value":{"numbers":[4.5]}}` | ユーザー評価平均値表示・ソート |
| `favoriteCount` | `i_favorite_count` | `2` | `favorite_count` | `{"key":"favorite_count","value":{"numbers":[2]}}` | お気に入り登録数表示・ソート |

### 🔎 検索・表示制御属性

> **用途**: 検索機能の拡張・検索結果の制御

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `q` (検索補助) | `sm_freewords` | `"25秋冬新作,ドレス,オフィス,カジュアル"` | `freeword_tags` | `{"key":"freeword_tags","value":{"text":["25秋冬新作","ドレス","オフィス","カジュアル"]}}` | フリーワード検索拡張 |
| `kwd` (パラメータ) | `sm_keywords_id` | `"G0008_A1460,G0001_A0166"` | `keywords_id` | `{"key":"keywords_id","value":{"text":["G0008_A1460","G0001_A0166"]}}` | 特徴キーワードフィルタ |
| `display_dreni` (パラメータ) | `i_use_search_flag` | `1` (true) | `search_display_flag` | `{"key":"search_display_flag","value":{"text":["true"]}}` | 検索結果表示制御 |
| - (除外制御) | `i_prohibit_freewordsearch` | `0` (false) | `freeword_exclude_flag` | `{"key":"freeword_exclude_flag","value":{"text":["false"]}}` | フリーワード検索除外制御 |

### 📅 日付・期間属性

> **用途**: 期間フィルタ・時系列ソート機能

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `new_date` (パラメータ) | `s_rearrival_date` | `"2025-08-25"` | `arrival_date` | `{"key":"arrival_date","value":{"text":["2025-08-25"]}}` | 新着日フィルタ |
| `sale_date` (パラメータ) | `s_sale_start_date` | `"2025-08-25"` | `sale_start_date` | `{"key":"sale_start_date","value":{"text":["2025-08-25"]}}` | セール開始日フィルタ |

### 💸 まとめ割・特別価格属性

> **用途**: 特別価格・割引情報の表示・計算

| 既存APIフィールド | DBフィールド | サンプルDBデータ | VAISCカスタム属性 | JSON構造 | 用途 |
|------------------|-------------|----------------|------------------|---------|------|
| `bulkDiscountMessage` | `i_bulk_discount_apply_low_lm_goods_qty` | `2` | `bulk_discount_min_qty` | `{"key":"bulk_discount_min_qty","value":{"numbers":[2]}}` | まとめ割メッセージ生成 |
| `bulkDiscountMessage` | `i_bulk_discount_rate` | `10` | `bulk_discount_rate` | `{"key":"bulk_discount_rate","value":{"numbers":[10]}}` | まとめ割メッセージ生成 |

## 📄 完全JSONサンプル

> **📋 サンプルの見方**:  
> - 実際の商品データに基づく具体例  
> - 全てのフィールドが正しく構造化されていることを確認可能  
> - コピー&ペーストして実装テストに使用可能

### 🛍️ サンプル1: レディース・新着・まとめ割商品

> **特徴**: 新着フラグ、まとめ割、高評価商品の例

```json
{
  "id": "CF0212351201",
  "title": "ニットTシャツ",
  "description": "なめらかで肌触りのいいニット素材を使用したTシャツ。オフィスからカジュアルまで幅広いシーンで活躍します。",
  "categories": ["ファッション", "レディース", "ニット・セーター"],
  "brands": ["アイテムズ アーバンリサーチ"],
  "priceInfo": {
    "currencyCode": "JPY",
    "price": 4990,
    "originalPrice": 5490
  },
  "uri": "https://voi.0101.co.jp/voi/goods/detail/CF0212351201",
  "images": [
    {
      "uri": "https://image.0101.co.jp/img/goods/CF0212351201/thumb.jpg"
    }
  ],
  "audience": {
    "genders": ["female"]
  },
  "colorInfo": {
    "colors": ["ブラウン", "ホワイト", "ブラック"]
  },
  "sizes": ["フリー", "M", "L"],
  "attributes": [
    {
      "key": "store_id",
      "value": {"numbers": [6]}
    },
    {
      "key": "brand_code",
      "value": {"text": ["30095"]}
    },
    {
      "key": "primary_item_code", 
      "value": {"numbers": [30001]}
    },
    {
      "key": "secondary_item_code",
      "value": {"numbers": [30162]}
    },
    {
      "key": "discount_rate",
      "value": {"numbers": [9]}
    },
    {
      "key": "flag_newarrival",
      "value": {"text": ["true"]}
    },
    {
      "key": "flag_sale",
      "value": {"text": ["false"]}
    },
    {
      "key": "flag_bulkdiscount",
      "value": {"text": ["true"]}
    },
    {
      "key": "comment_count",
      "value": {"numbers": [2]}
    },
    {
      "key": "evaluation_average", 
      "value": {"numbers": [4.5]}
    },
    {
      "key": "favorite_count",
      "value": {"numbers": [2]}
    },
    {
      "key": "freeword_tags",
      "value": {"text": ["25秋冬新作", "ドレス", "オフィス", "カジュアル"]}
    },
    {
      "key": "keywords_id",
      "value": {"text": ["G0008_A1460", "G0001_A0166"]}
    },
    {
      "key": "bulk_discount_min_qty",
      "value": {"numbers": [2]}
    },
    {
      "key": "bulk_discount_rate",
      "value": {"numbers": [10]}
    }
  ]
}
```

### 👔 サンプル2: メンズ・セール・クーポン商品

> **特徴**: セール商品、クーポン対象、限定セールの例

```json
{
  "id": "MN0145672890",
  "title": "カジュアルシャツ", 
  "description": "コットン100%の爽やかなシャツ。春夏シーズンに最適なアイテムです。",
  "categories": ["ファッション", "メンズ", "シャツ・ブラウス"],
  "brands": ["ユナイテッドアローズ"],
  "priceInfo": {
    "currencyCode": "JPY",
    "price": 8800,
    "originalPrice": 11000
  },
  "uri": "https://voi.0101.co.jp/voi/goods/detail/MN0145672890",
  "images": [
    {
      "uri": "https://image.0101.co.jp/img/goods/MN0145672890/thumb.jpg"
    }
  ],
  "audience": {
    "genders": ["male"]
  },
  "colorInfo": {
    "colors": ["ネイビー", "ホワイト", "グレー"]
  },
  "sizes": ["S", "M", "L", "XL"],
  "materials": ["コットン"],
  "attributes": [
    {
      "key": "store_id",
      "value": {"numbers": [1]}
    },
    {
      "key": "brand_code",
      "value": {"text": ["20451"]}
    },
    {
      "key": "primary_item_code",
      "value": {"numbers": [20001]}
    },
    {
      "key": "secondary_item_code", 
      "value": {"numbers": [20045]}
    },
    {
      "key": "discount_rate",
      "value": {"numbers": [20]}
    },
    {
      "key": "flag_sale",
      "value": {"text": ["true"]}
    },
    {
      "key": "flag_limitedsale",
      "value": {"text": ["true"]}
    },
    {
      "key": "flag_coupon",
      "value": {"text": ["true"]}
    },
    {
      "key": "comment_count",
      "value": {"numbers": [5]}
    },
    {
      "key": "evaluation_average",
      "value": {"numbers": [4.2]}
    },
    {
      "key": "favorite_count",
      "value": {"numbers": [8]}
    },
    {
      "key": "freeword_tags",
      "value": {"text": ["春夏新作", "シャツ", "カジュアル", "ビジネス"]}
    }
  ]
}
```

## 🏗️ BigQuery NDJSON ファイル形式

> **📊 形式説明**: BigQueryでの効率的なデータ処理のためのNDJSON（改行区切りJSON）形式

### 📄 ファイル形式仕様

> **⚠️ 重要**: 以下の仕様を厳密に守る必要があります
- **ファイル形式**: NDJSON (Newline Delimited JSON)
- **文字コード**: UTF-8（BOM無し）
- **改行コード**: LF（\n）
- **1行1商品**: 各行が完全なJSONオブジェクト
- **⚠️ 要確認**: BigQueryファイルサイズ制約の公式仕様確認必要

### NDJSON形式サンプル
```json
{"id":"CF0212351201","title":"ニットTシャツ","categories":["ファッション","レディース","ニット・セーター"],"brands":["アイテムズ アーバンリサーチ"],"priceInfo":{"currencyCode":"JPY","price":4990,"originalPrice":5490},"uri":"https://voi.0101.co.jp/...","audience":{"genders":["female"]},"colorInfo":{"colors":["ブラウン","ホワイト","ブラック"]},"sizes":["フリー","M","L"],"attributes":[{"key":"store_id","value":{"numbers":[6]}},{"key":"brand_code","value":{"text":["30095"]}},{"key":"flag_newarrival","value":{"text":["true"]}}]}
{"id":"MN0145672890","title":"カジュアルシャツ","categories":["ファッション","メンズ","シャツ・ブラウス"],"brands":["ユナイテッドアローズ"],"priceInfo":{"currencyCode":"JPY","price":8800,"originalPrice":11000},"uri":"https://voi.0101.co.jp/...","audience":{"genders":["male"]},"colorInfo":{"colors":["ネイビー","ホワイト","グレー"]},"sizes":["S","M","L","XL"],"attributes":[{"key":"store_id","value":{"numbers":[1]}},{"key":"brand_code","value":{"text":["20451"]}},{"key":"flag_sale","value":{"text":["true"]}}]}
```

## 🔄 データ変換ルール・ビジネスロジック

> **🎯 目的**: DBの生データをVAISC準拠JSONに変換するための実装ガイド  
> **📋 内容**: 実際のJavaScript/TypeScriptコードで実装可能な変換関数群

### ⚙️ コードマスタ変換ルール

> **📋 説明**: DBの数値コードをVAISC形式の文字列配列に変換

#### 性別コード変換（i_figure_main）
```javascript
// ⚠️ 要確認: VAISC公式ドキュメントでの正確な許可値確認必要
// ⚠️ 特に"kids"値の可否、ageGroups使用の要否を確認必要
function convertGender(figureMain) {
  const genderMap = {
    1: ["female"],      // レディース（推定）
    2: ["male"],        // メンズ（推定）  
    3: ["unisex"],      // ユニセックス（推定）
    4: ["unisex"]       // キッズ→unisex変換（要確認）
  };
  return genderMap[figureMain] || ["unisex"];
}

// 代替案: ageGroupsフィールド併用パターン（要検証）
function convertAudienceComplete(figureMain) {
  const audienceMap = {
    1: { genders: ["female"], ageGroups: ["adult"] },
    2: { genders: ["male"], ageGroups: ["adult"] },
    3: { genders: ["unisex"], ageGroups: ["adult"] },
    4: { genders: ["unisex"], ageGroups: ["kids"] }  // 要確認
  };
  return audienceMap[figureMain] || { genders: ["unisex"], ageGroups: ["adult"] };
}
```

#### ストアコード変換（i_store）
```javascript
// ⚠️ 要確認: 以下の確認が必要
// 1. DB実際値に基づく完全マッピング
// 2. VAISCカテゴリ体系での推奨カテゴリ名
// 3. 検索エンジン最適化のためのカテゴリ命名規則
function convertStoreCategory(storeId) {
  const storeMap = {
    1: "ファッション",    // 推定値（要確認）
    2: "ファッション",    // 推定値（要確認）
    6: "ビューティ",      // 推定値（要確認）
    7: "ライフスタイル",   // 推定値（要確認）
    8: "フード",         // 推定値（要確認）
  };
  return storeMap[storeId] || "その他";
}
```

### 🔧 文字列処理・データクレンジング

> **📋 説明**: DB内の文字列データの正規化・配列変換処理

#### カンマ区切り値→配列変換
```javascript
function parseCommaSeparated(value) {
  if (!value || value.trim() === '') return [];
  return value.split(',')
    .map(item => item.trim())
    .filter(item => item && item !== '');
}

// 使用例
// DB: "brown,white,black" → JSON: ["brown", "white", "black"]
// DB: "フリー,M,L" → JSON: ["フリー", "M", "L"]
```

#### ブールフラグ変換（i_icon_flag_*）
```javascript
function convertBooleanFlag(dbValue) {
  // DB: 1/0 または true/false → VAISC Custom Attributes: ["true"]/["false"]
  // 注意: VAISCのCustom Attributesはboolean型未対応のため文字列変換必須
  return (dbValue === 1 || dbValue === true) ? ["true"] : ["false"];
}

// BigQuery用: boolean型で格納（BigQueryはboolean型サポート）
function convertForBigQuery(dbValue) {
  return (dbValue === 1 || dbValue === true);  // true/false (boolean型)
}
```

#### 日付フォーマット変換
```javascript
function convertDateFormat(dbDate) {
  // DB形式例: "20250825" → VAISC形式: "2025-08-25"
  if (!dbDate || dbDate.length !== 8) return null;
  const year = dbDate.substring(0, 4);
  const month = dbDate.substring(4, 6);
  const day = dbDate.substring(6, 8);
  return `${year}-${month}-${day}`;
}
```

### 🏗️ 構造化データ生成

> **📋 説明**: 複数のDBフィールドから複合オブジェクトを生成

#### カテゴリ階層生成
```javascript
// ⚠️ 要確認: 実際のDB値に基づくマッピング確認必要
function buildCategoryPath(storeId, figureMain, categoryName) {
  const storeMap = {
    1: "ファッション",    // 推定値
    6: "ビューティ",      // 推定値
    7: "ライフスタイル"   // 推定値
  };
  
  const genderMap = {
    1: "レディース",      // 推定値
    2: "メンズ",         // 推定値
    3: "ユニセックス",    // 推定値
    4: "キッズ"          // 推定値
  };
  
  return [
    storeMap[storeId] || "その他",
    genderMap[figureMain] || "ユニセックス", 
    categoryName
  ].filter(Boolean);
}

// 例（推定）: (6, 1, "ニット・セーター") → ["ビューティ", "レディース", "ニット・セーター"]
```

#### カラー情報オブジェクト生成
```javascript
function buildColorInfo(colorIds, colorNames) {
  const ids = parseCommaSeparated(colorIds);
  const names = parseCommaSeparated(colorNames);
  
  return {
    colors: names, // VAISC標準フィールド
    // カスタム属性として詳細情報も保持
    colorDetails: ids.map((id, index) => ({
      id: id,
      name: names[index] || id
    }))
  };
}
```

### 💰 価格・ビジネスロジック

> **📋 説明**: 価格計算・割引率・特別価格の処理ロジック

#### まとめ割メッセージ生成
```javascript
function generateBulkDiscountMessage(minQty, discountRate) {
  if (!minQty || !discountRate) return null;
  return `${minQty}個以上で${discountRate}%OFF`;
}

// 使用例: generateBulkDiscountMessage(2, 10) → "2個以上で10%OFF"
```

#### 割引率計算・検証
```javascript
function calculateDiscountRate(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// データ整合性チェック用
function validatePriceData(product) {
  const calculated = calculateDiscountRate(
    product.priceInfo.originalPrice, 
    product.priceInfo.price
  );
  const dbValue = product.attributes.find(a => a.key === 'discount_rate')?.value?.numbers?.[0];
  
  if (Math.abs(calculated - dbValue) > 1) {
    console.warn(`価格整合性エラー: ${product.id} 計算値:${calculated}% DB値:${dbValue}%`);
  }
}
```


## 📊 JSON Schema定義

> **🔧 用途**: JSONデータの自動バリデーション・型チェック  
> **📋 活用**: IDE補完、自動テスト、データ品質保証に使用可能

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "categories"],
  "properties": {
    "id": {
      "type": "string",
      "description": "商品一意識別子"
    },
    "title": {
      "type": "string", 
      "maxLength": 1250,
      "description": "商品名"
    },
    "description": {
      "type": "string",
      "description": "商品説明"
    },
    "categories": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1,
      "description": "カテゴリ階層"
    },
    "brands": {
      "type": "array", 
      "items": {"type": "string"},
      "description": "ブランド名配列"
    },
    "priceInfo": {
      "type": "object",
      "properties": {
        "currencyCode": {"type": "string", "default": "JPY"},
        "price": {"type": "number", "minimum": 0},
        "originalPrice": {"type": "number", "minimum": 0}
      }
    },
    "uri": {
      "type": "string",
      "format": "uri",
      "description": "商品詳細URL"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "object", 
        "properties": {
          "uri": {"type": "string", "format": "uri"}
        },
        "required": ["uri"]
      }
    },
    "audience": {
      "type": "object",
      "properties": {
        "genders": {
          "type": "array",
          "items": {"enum": ["female", "male", "unisex", "kids"]}
        }
      }
    },
    "colorInfo": {
      "type": "object",
      "properties": {
        "colors": {
          "type": "array",
          "items": {"type": "string"}
        }
      }
    },
    "sizes": {
      "type": "array",
      "items": {"type": "string"}
    },
    "attributes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "key": {"type": "string"},
          "value": {
            "type": "object",
            "properties": {
              "text": {
                "type": "array",
                "items": {"type": "string"}
              },
              "numbers": {
                "type": "array", 
                "items": {"type": "number"}
              }
            }
          }
        },
        "required": ["key", "value"]
      }
    }
  }
}
```

