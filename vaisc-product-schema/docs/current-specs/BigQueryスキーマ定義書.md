# BigQuery NDJSON スキーマ定義書

## 📋 概要

**目的**: ⚠️ 要確認: VAISC準拠JSON形式データをBigQueryで効率的に処理するためのテーブルスキーマ定義（VAISC準拠性要検証）

**前提条件**: 
- NDJSON (Newline Delimited JSON) ファイル形式
- Cloud Storage経由でのデータ投入
- ⚠️ 要確認: VAISC Product Schema準拠性要検証

## 🏗️ BigQuery テーブル定義

### メインテーブル: vaisc_products

```sql
CREATE TABLE `project.dataset.vaisc_products` (
  -- 必須フィールド (Required Fields)
  id STRING NOT NULL OPTIONS(description="商品一意識別子"),
  title STRING NOT NULL OPTIONS(description="商品名（⚠️ 要確認: VAISC文字数制限要公式確認）"),
  categories ARRAY<STRING> NOT NULL OPTIONS(description="カテゴリ階層配列"),
  
  -- 基本情報 (Basic Information)
  description STRING OPTIONS(description="商品説明"),
  uri STRING OPTIONS(description="商品詳細ページURL"),
  brands ARRAY<STRING> OPTIONS(description="ブランド名配列"),
  
  -- 価格情報 (Price Information)
  priceInfo STRUCT<
    currencyCode STRING OPTIONS(description="通貨コード（JPY固定）"),
    price FLOAT64 OPTIONS(description="現在価格"),
    originalPrice FLOAT64 OPTIONS(description="元価格")
  > OPTIONS(description="価格情報"),
  
  -- 画像情報 (Image Information)
  images ARRAY<STRUCT<
    uri STRING OPTIONS(description="画像URL"),
    height INT64 OPTIONS(description="画像高さ"),
    width INT64 OPTIONS(description="画像幅")
  >> OPTIONS(description="商品画像配列"),
  
  -- 対象者情報 (Audience Information)
  audience STRUCT<
    genders ARRAY<STRING> OPTIONS(description="対象性別配列")
  > OPTIONS(description="対象者情報"),
  
  -- カラー情報 (Color Information)
  colorInfo STRUCT<
    colorFamilies ARRAY<STRING> OPTIONS(description="カラーファミリー"),
    colors ARRAY<STRING> OPTIONS(description="カラー名配列")
  > OPTIONS(description="カラー情報"),
  
  -- サイズ・素材 (Size & Materials)
  sizes ARRAY<STRING> OPTIONS(description="サイズ配列"),
  materials ARRAY<STRING> OPTIONS(description="素材配列"),
  
  -- カスタム属性 (Custom Attributes)
  attributes ARRAY<STRUCT<
    key STRING OPTIONS(description="属性キー"),
    value STRUCT<
      text ARRAY<STRING> OPTIONS(description="文字列値配列"),
      numbers ARRAY<FLOAT64> OPTIONS(description="数値配列")
    > OPTIONS(description="属性値")
  >> OPTIONS(description="カスタム属性配列"),
  
  -- メタデータ (Metadata)
  _import_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description="データ投入日時"),
  _source_file STRING OPTIONS(description="ソースファイル名")
)
PARTITION BY DATE(_import_timestamp)
CLUSTER BY brands[OFFSET(0)], categories[OFFSET(0)], audience.genders[OFFSET(0)]
OPTIONS(
  description="VAISC商品データメインテーブル",
  labels=[("environment", "production"), ("team", "retail")]
);
```

## 📊 外部テーブル定義（Cloud Storage連携）

### NDJSON ファイル用外部テーブル

```sql
-- ⚠️ 要確認: 外部テーブル設定値の公式仕様確認必要
CREATE OR REPLACE EXTERNAL TABLE `project.dataset.vaisc_products_external`
OPTIONS (
  format = 'NEWLINE_DELIMITED_JSON',
  uris = ['gs://your-bucket/vaisc-products/*.json'],
  max_staleness = INTERVAL 1 HOUR,     -- 推奨設定値
  ignore_unknown_values = false,       -- 推奨設定値
  max_bad_records = 10                 -- 推奨設定値
)
AS (
  SELECT 
    -- 基本フィールドの自動スキーマ検出
    JSON_EXTRACT_SCALAR(json_row, '$.id') AS id,
    JSON_EXTRACT_SCALAR(json_row, '$.title') AS title,
    JSON_EXTRACT_ARRAY(json_row, '$.categories') AS categories_raw,
    JSON_EXTRACT_SCALAR(json_row, '$.description') AS description,
    JSON_EXTRACT_SCALAR(json_row, '$.uri') AS uri,
    JSON_EXTRACT_ARRAY(json_row, '$.brands') AS brands_raw,
    
    -- 価格情報の構造化
    STRUCT(
      JSON_EXTRACT_SCALAR(json_row, '$.priceInfo.currencyCode') AS currencyCode,
      CAST(JSON_EXTRACT_SCALAR(json_row, '$.priceInfo.price') AS FLOAT64) AS price,
      CAST(JSON_EXTRACT_SCALAR(json_row, '$.priceInfo.originalPrice') AS FLOAT64) AS originalPrice
    ) AS priceInfo,
    
    -- 画像情報の配列処理
    ARRAY(
      SELECT AS STRUCT 
        JSON_EXTRACT_SCALAR(img, '$.uri') AS uri,
        CAST(JSON_EXTRACT_SCALAR(img, '$.height') AS INT64) AS height,
        CAST(JSON_EXTRACT_SCALAR(img, '$.width') AS INT64) AS width
      FROM UNNEST(JSON_EXTRACT_ARRAY(json_row, '$.images')) AS img
    ) AS images,
    
    -- 対象者情報
    STRUCT(
      ARRAY(
        SELECT JSON_EXTRACT_SCALAR(gender, '$')
        FROM UNNEST(JSON_EXTRACT_ARRAY(json_row, '$.audience.genders')) AS gender
      ) AS genders
    ) AS audience,
    
    -- カラー情報
    STRUCT(
      ARRAY(
        SELECT JSON_EXTRACT_SCALAR(color, '$')
        FROM UNNEST(JSON_EXTRACT_ARRAY(json_row, '$.colorInfo.colors')) AS color
      ) AS colors
    ) AS colorInfo,
    
    -- サイズ配列
    ARRAY(
      SELECT JSON_EXTRACT_SCALAR(size, '$')
      FROM UNNEST(JSON_EXTRACT_ARRAY(json_row, '$.sizes')) AS size
    ) AS sizes,
    
    -- カスタム属性の処理
    ARRAY(
      SELECT AS STRUCT
        JSON_EXTRACT_SCALAR(attr, '$.key') AS key,
        STRUCT(
          ARRAY(
            SELECT JSON_EXTRACT_SCALAR(txt, '$')
            FROM UNNEST(JSON_EXTRACT_ARRAY(attr, '$.value.text')) AS txt
          ) AS text,
          ARRAY(
            SELECT CAST(JSON_EXTRACT_SCALAR(num, '$') AS FLOAT64)
            FROM UNNEST(JSON_EXTRACT_ARRAY(attr, '$.value.numbers')) AS num
          ) AS numbers
        ) AS value
      FROM UNNEST(JSON_EXTRACT_ARRAY(json_row, '$.attributes')) AS attr
    ) AS attributes,
    
    -- メタデータ
    CURRENT_TIMESTAMP() AS _import_timestamp,
    _FILE_NAME AS _source_file,
    json_row AS _raw_json  -- デバッグ用
  FROM UNNEST([json_row]) AS json_row
);
```

## 🔄 データ投入ストアドプロシージャ

### 増分データ投入処理

```sql
CREATE OR REPLACE PROCEDURE `project.dataset.load_vaisc_products`(
  source_path STRING,
  batch_date DATE
)
BEGIN
  DECLARE processed_count INT64 DEFAULT 0;
  DECLARE error_count INT64 DEFAULT 0;
  
  -- テンポラリテーブルでデータ品質チェック
  CREATE OR REPLACE TEMP TABLE temp_validation AS
  SELECT 
    *,
    -- バリデーションフラグ
    CASE 
      WHEN id IS NULL OR id = '' THEN 'MISSING_ID'
      WHEN title IS NULL OR title = '' THEN 'MISSING_TITLE'
      WHEN ARRAY_LENGTH(categories) = 0 THEN 'MISSING_CATEGORIES'
      WHEN LENGTH(title) > 1250 THEN 'TITLE_TOO_LONG'
      ELSE 'VALID'
    END AS validation_status
  FROM `project.dataset.vaisc_products_external`
  WHERE DATE(_import_timestamp) = batch_date;
  
  -- エラーデータのログ出力
  SET error_count = (
    SELECT COUNT(*) 
    FROM temp_validation 
    WHERE validation_status != 'VALID'
  );
  
  IF error_count > 0 THEN
    INSERT INTO `project.dataset.data_quality_log` (
      batch_date, error_type, error_count, sample_records
    )
    SELECT 
      batch_date,
      validation_status,
      COUNT(*),
      ARRAY_AGG(id LIMIT 5)
    FROM temp_validation
    WHERE validation_status != 'VALID'
    GROUP BY validation_status;
  END IF;
  
  -- 正常データのメインテーブル投入
  INSERT INTO `project.dataset.vaisc_products`
  SELECT 
    * EXCEPT(validation_status, _raw_json)
  FROM temp_validation
  WHERE validation_status = 'VALID';
  
  SET processed_count = @@row_count;
  
  -- 処理結果のログ出力
  SELECT 
    batch_date,
    processed_count AS valid_records,
    error_count AS invalid_records,
    ROUND(processed_count / (processed_count + error_count) * 100, 2) AS success_rate;
    
END;
```

## 📈 パフォーマンス最適化設定

### インデックス戦略

```sql
-- 検索パフォーマンス向上のためのクラスタリング
ALTER TABLE `project.dataset.vaisc_products`
SET OPTIONS (
  clustering_fields = ["brands[OFFSET(0)]", "categories[OFFSET(0)]", "audience.genders[OFFSET(0)]"]
);

-- パーティション設定の最適化
-- ⚠️ 要確認: 実際の保存期間・フィルタ要求仕様の確認必要
ALTER TABLE `project.dataset.vaisc_products`
SET OPTIONS (
  partition_expiration_days = 730,  -- 2年でパーティション削除（推定値）
  require_partition_filter = true   -- パーティションフィルタ必須（推奨設定）
);
```

### よく使用されるクエリ用VIEW

```sql
-- ファセット検索用VIEW
CREATE OR REPLACE VIEW `project.dataset.vaisc_facet_search` AS
SELECT 
  id,
  title,
  brands,
  categories,
  priceInfo.price,
  priceInfo.originalPrice,
  audience.genders,
  colorInfo.colors,
  sizes,
  
  -- フィルタリング用属性の展開
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'store_id') AS store_id,
  (SELECT value.text[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'brand_code') AS brand_code,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'primary_item_code') AS primary_item_code,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'secondary_item_code') AS secondary_item_code,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'discount_rate') AS discount_rate,
  
  -- フラグ属性の展開
  (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_newarrival') AS is_new_arrival,
  (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_sale') AS is_on_sale,
  (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_coupon') AS has_coupon,
  
  -- 評価情報
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'comment_count') AS comment_count,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'evaluation_average') AS evaluation_average,
  
  _import_timestamp
FROM `project.dataset.vaisc_products`
WHERE DATE(_import_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);

-- API互換レスポンス用VIEW
CREATE OR REPLACE VIEW `project.dataset.vaisc_api_response` AS
SELECT 
  id AS productId,
  title AS productName1,
  brands[OFFSET(0)] AS brandTextJP,
  uri AS detailUrl,
  images[OFFSET(0)].uri AS imageURL,
  categories[ARRAY_LENGTH(categories)-1] AS scdName,
  priceInfo.price AS taxInclusivePrice,
  priceInfo.originalPrice AS oldPrice,
  
  -- フラグ情報のJSON構造
  STRUCT(
    (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_pricereduced') AS pricereduced,
    (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_sale') AS sale,
    (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_newarrival') AS newarrival,
    (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_giftwrap') AS giftwrap,
    (SELECT value.text[OFFSET(0)] = 'true' FROM UNNEST(attributes) WHERE key = 'flag_coupon') AS coupon
  ) AS flags,
  
  -- 評価情報
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'comment_count') AS commentCount,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'evaluation_average') AS evaluationAverage,
  (SELECT value.numbers[OFFSET(0)] FROM UNNEST(attributes) WHERE key = 'favorite_count') AS favoriteCount,
  
  _import_timestamp
FROM `project.dataset.vaisc_products`;
```

## 🔍 データ品質監視

### データ品質チェッククエリ

```sql
-- 日次データ品質レポート
CREATE OR REPLACE VIEW `project.dataset.data_quality_daily` AS
WITH quality_metrics AS (
  SELECT 
    DATE(_import_timestamp) AS batch_date,
    COUNT(*) AS total_records,
    
    -- 必須フィールドチェック
    COUNTIF(id IS NOT NULL AND id != '') AS valid_id_count,
    COUNTIF(title IS NOT NULL AND title != '') AS valid_title_count,
    COUNTIF(ARRAY_LENGTH(categories) > 0) AS valid_categories_count,
    
    -- データ品質指標
    COUNTIF(LENGTH(title) <= 1250) AS title_length_ok_count,
    COUNTIF(priceInfo.price > 0) AS positive_price_count,
    COUNTIF(ARRAY_LENGTH(brands) > 0) AS has_brand_count,
    
    -- カスタム属性数の統計
    AVG(ARRAY_LENGTH(attributes)) AS avg_attributes_count,
    AVG(ARRAY_LENGTH(sizes)) AS avg_sizes_count,
    AVG(ARRAY_LENGTH(colorInfo.colors)) AS avg_colors_count
    
  FROM `project.dataset.vaisc_products`
  WHERE DATE(_import_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  GROUP BY DATE(_import_timestamp)
)
SELECT 
  batch_date,
  total_records,
  ROUND(valid_id_count / total_records * 100, 2) AS id_completeness_rate,
  ROUND(valid_title_count / total_records * 100, 2) AS title_completeness_rate,
  ROUND(valid_categories_count / total_records * 100, 2) AS categories_completeness_rate,
  ROUND(title_length_ok_count / total_records * 100, 2) AS title_length_compliance_rate,
  ROUND(positive_price_count / total_records * 100, 2) AS price_validity_rate,
  avg_attributes_count,
  avg_sizes_count,
  avg_colors_count
FROM quality_metrics
ORDER BY batch_date DESC;
```

---

## 📋 スキーマ定義サマリー

**⚠️ BigQuery NDJSON スキーマ（初版・検証必要）**

VAISC準拠JSON形式に最適化されたBigQueryスキーマ定義です。実装前に以下の検証が必要です。

**🎯 主要特徴**:
- **⚠️ 要確認**: VAISC Product Schema準拠性要検証
- **構造設計**: パーティション・クラスタリング設定
- **データ品質**: 自動バリデーション・監視機能
- **処理効率**: ストアドプロシージャによる自動化