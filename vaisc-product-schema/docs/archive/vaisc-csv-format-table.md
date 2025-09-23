# VAISC用CSVデータフォーマット仕様表

## CSVフィールド定義一覧

| No. | CSVフィールド名 | データ型 | 必須/任意 | 対応DB項目 | 実現可能性 | 用途分類 | 説明 | 備考 |
|-----|---------------|----------|----------|-----------|------------|----------|------|------|
| 1 | `product_id` | STRING | 必須 | `s_product_id` | ✅ 確実 | 📤 レスポンス | 商品ID | VAISC主キー |
| 2 | `product_name_1` | STRING | 必須 | `n_product_name_1` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 商品名1（ngram処理済み） | 検索対象 |
| 3 | `product_name_2` | STRING | 任意 | `n_product_name_2` | ✅ 確実 | 📤 レスポンス | 商品名2（ブランド名等） | |
| 4 | `product_description` | STRING | 任意 | `n_caption` | ✅ 確実 | 🔍 索引 | 商品説明（ngram処理済み） | 検索対象 |
| 5 | `freeword_tags` | STRING | 任意 | `sm_freewords` | ✅ 確実 | 🔍 索引 | フリーワードタグ（カンマ区切り） | 検索対象 |
| 6 | `detail_url` | STRING | 必須 | `url` | ✅ 確実 | 📤 レスポンス | 商品詳細ページURL | |
| 7 | `image_url` | STRING | 必須 | `s_thumb_img` | ✅ 確実 | 📤 レスポンス | メイン画像URL | |
| 8 | `brand_code` | STRING | 必須 | `s_web_brand_code` | ✅ 確実 | 🔍 索引 | ブランドコード | フィルタ用 |
| 9 | `brand_name_jp` | STRING | 必須 | `s_web_brand_code_text_jp` | ✅ 確実 | 📤 レスポンス | ブランド名（日本語） | |
| 10 | `brand_name_en` | STRING | 任意 | `s_web_brand_code_text_en` | ✅ 確実 | 📤 レスポンス | ブランド名（英語） | |
| 11 | `store_id` | INTEGER | 必須 | `i_store` | ✅ 確実 | 🔍 索引 | ストアID（1:ファッション等） | カテゴリフィルタ |
| 12 | `figure_main` | INTEGER | 必須 | `i_figure_main` | ✅ 確実 | 🔍 索引 | 性別（1:レディース, 2:メンズ等） | フィルタ用 |
| 13 | `primary_item_code` | INTEGER | 必須 | `sm_primary_item` | ✅ 確実 | 🔍 索引 | 第1カテゴリコード（fcd） | カテゴリフィルタ |
| 14 | `secondary_item_code` | INTEGER | 必須 | `sm_secondary_item` | ✅ 確実 | 🔍 索引 | 第2カテゴリコード（scd） | カテゴリフィルタ |
| 15 | `category_name` | STRING | 必須 | `t_item_code_text` | ✅ 確実 | 📤 レスポンス | カテゴリ名称 | |
| 16 | `tax_inclusive_price` | INTEGER | 必須 | `i_tax_inclusive_price` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 税込価格 | ソート・フィルタ用 |
| 17 | `old_price` | INTEGER | 任意 | `i_old_price` | ✅ 確実 | 📤 レスポンス | 元価格（二重価格表示用） | |
| 18 | `discount_rate` | INTEGER | 任意 | `i_discount_rate` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 割引率（%） | ソート・フィルタ用 |
| 19 | `size_id` | STRING | 任意 | `sm_size_id` | ✅ 確実 | 🔍 索引 | サイズID（カンマ区切り） | フィルタ用 |
| 20 | `size_search` | STRING | 任意 | `sm_size_search` | ✅ 確実 | 🔍 索引 | サイズ検索用テキスト | フィルタ用 |
| 21 | `color_id` | STRING | 任意 | `sm_color_id` | ✅ 確実 | 🔍 索引 | カラーID（カンマ区切り） | フィルタ用 |
| 22 | `color_search` | STRING | 任意 | `sm_color_search` | ✅ 確実 | 🔍 索引 | カラー検索用テキスト | フィルタ用 |
| 23 | `keywords_id` | STRING | 任意 | `sm_keywords_id` | ✅ 確実 | 🔍 索引 | 特徴キーワードID（カンマ区切り） | フィルタ用 |
| 24 | `sale_start_date` | STRING | 任意 | `s_sale_start_date` | ✅ 確実 | 🔍 索引 | セール開始日（YYYY-MM-DD） | 日付フィルタ用 |
| 25 | `arrival_date` | STRING | 任意 | `s_rearrival_date` | ⚠️ 要確認 | 🔍 索引 | 入荷日（YYYY-MM-DD） | 新着フィルタ用（再入荷日のみ） |
| 26 | `shop_id` | STRING | 任意 | `sm_shop` | ✅ 確実 | 🔍 索引 | ショップID | フィルタ用 |
| 27 | `web_shop_id` | STRING | 任意 | `sm_web_shop` | ✅ 確実 | 🔍 索引 | WEBショップID | フィルタ用 |
| 28 | `flag_pricereduced` | BOOLEAN | 任意 | `i_icon_flag_pricereduced` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 値下げフラグ | |
| 29 | `flag_sale` | BOOLEAN | 任意 | `i_icon_flag_sale` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | セールフラグ | |
| 30 | `flag_giftwrap` | BOOLEAN | 任意 | `i_icon_flag_giftwrap` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | ギフトラッピングフラグ | |
| 31 | `flag_rearrival` | BOOLEAN | 任意 | `i_icon_flag_rearrival` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 再入荷フラグ | |
| 32 | `flag_newarrival` | BOOLEAN | 任意 | `i_icon_flag_newarrival` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 新着フラグ | |
| 33 | `flag_limitedsale` | BOOLEAN | 任意 | `i_icon_flag_limitedsale` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 期間限定セールフラグ | |
| 34 | `flag_salespromotion` | BOOLEAN | 任意 | `i_icon_flag_salespromotion` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 販促キャンペーンフラグ | |
| 35 | `flag_deliveryfeeoff` | BOOLEAN | 任意 | `i_icon_flag_deliveryfeeoff` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 配送料無料フラグ | |
| 36 | `flag_secretsale` | BOOLEAN | 任意 | `i_icon_flag_secretsell` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | シークレットセールフラグ | |
| 37 | `flag_reservation` | BOOLEAN | 任意 | `i_icon_flag_reservation` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 先行予約フラグ | |
| 38 | `flag_used` | BOOLEAN | 任意 | `i_icon_flag_used` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | 中古商品フラグ | |
| 39 | `flag_coupon` | BOOLEAN | 任意 | `i_icon_flag_coupon` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | クーポンフラグ | |
| 40 | `flag_bulkdiscount` | BOOLEAN | 任意 | `i_icon_flag_bulk_discount` | ✅ 確実 | 🔍 索引 + 📤 レスポンス | まとめ割フラグ | |
| 41 | `comment_count` | INTEGER | 任意 | `i_comment_count` | ✅ 確実 | 📤 レスポンス | ユーザーコメント数 | |
| 42 | `evaluation_average` | FLOAT | 任意 | `f_evaluation_average` | ✅ 確実 | 📤 レスポンス | ユーザー評価平均（0.0-5.0） | |
| 43 | `favorite_count` | INTEGER | 任意 | `i_favorite_count` | ✅ 確実 | 📤 レスポンス | お気に入り登録数 | |
| 44 | `bulk_discount_min_qty` | INTEGER | 任意 | `i_bulk_discount_apply_low_lm_goods_qty` | ✅ 確実 | ⚙️ 機能実装 | まとめ割適用最小数量 | メッセージ生成用 |
| 45 | `bulk_discount_rate` | INTEGER | 任意 | `i_bulk_discount_rate` | ✅ 確実 | ⚙️ 機能実装 | まとめ割引率（%） | メッセージ生成用 |
| 46 | `search_display_flag` | BOOLEAN | 任意 | `i_use_search_flag` | ✅ 確実 | ⚙️ 機能実装 | 検索結果表示フラグ | VAISC表示制御 |
| 47 | `freeword_search_exclude_flag` | BOOLEAN | 任意 | `i_prohibit_freewordsearch` | ✅ 確実 | ⚙️ 機能実装 | フリーワード検索除外フラグ | VAISC検索制御 |
| 48 | `recommend_display_flag` | BOOLEAN | 任意 | `i_use_recommend_flag` | ✅ 確実 | ⚙️ 機能実装 | レコメンド表示フラグ | VAISC表示制御 |
| 49 | `ranking_display_flag` | BOOLEAN | 任意 | `i_use_ranking_flag` | ✅ 確実 | ⚙️ 機能実装 | ランキング表示フラグ | VAISC表示制御 |

## 実現不可能・要確認フィールド

| No. | CSVフィールド名 | データ型 | 理由 | 代替案 | 影響する機能 |
|-----|---------------|----------|------|--------|-------------|
| - | `floor_id` | STRING | DB項目が空 | カテゴリフィルタで代替 | フロアフィルタ機能 |
| - | `popularity_score` | FLOAT | 人気指標データなし | 関連度順ソートで代替 | 人気順ソート機能 |
| - | `coupon_thumbnail` | STRING | 対応DB項目なし | フラグのみで対応 | クーポンサムネイル表示 |
| - | `flag_pricerereduced` | BOOLEAN | 再値下げ判定ロジック不明 | 単純値下げフラグで代替 | 再値下げ表示機能 |
| - | `sale_end_date` | STRING | DB項目なし | 開始日のみで対応 | セール期間フィルタ |

## データ型・形式定義

| データ型 | 形式 | 例 | 備考 |
|---------|------|-----|------|
| STRING | UTF-8文字列 | "商品名" | カンマ区切りの場合は内部でカンマ使用 |
| INTEGER | 数値 | 12345 | 負数不可 |
| FLOAT | 小数点数値 | 4.5 | 評価等で使用 |
| BOOLEAN | true/false | true | 文字列として出力 |
| DATE | YYYY-MM-DD | 2025-09-23 | ISO 8601形式 |

## CSVファイル仕様

### ファイル形式
- **文字コード**: UTF-8
- **改行コード**: LF
- **区切り文字**: カンマ (,)
- **囲み文字**: ダブルクォート (")
- **ヘッダー行**: 必須（1行目）

### サンプルCSVヘッダー
```csv
product_id,product_name_1,product_name_2,product_description,freeword_tags,detail_url,image_url,brand_code,brand_name_jp,brand_name_en,store_id,figure_main,primary_item_code,secondary_item_code,category_name,tax_inclusive_price,old_price,discount_rate,size_id,size_search,color_id,color_search,keywords_id,sale_start_date,arrival_date,shop_id,web_shop_id,flag_pricereduced,flag_sale,flag_giftwrap,flag_rearrival,flag_newarrival,flag_limitedsale,flag_salespromotion,flag_deliveryfeeoff,flag_secretsale,flag_reservation,flag_used,flag_coupon,flag_bulkdiscount,comment_count,evaluation_average,favorite_count,bulk_discount_min_qty,bulk_discount_rate,search_display_flag,freeword_search_exclude_flag,recommend_display_flag,ranking_display_flag
```

### データ例
```csv
"CF0212351201","ニットTシャツ","アイテムズ アーバンリサーチ","なめらかで肌触りのいい...","25秋冬新作,ドレス,オフィス","https://voi.0101.co.jp/...","https://image.0101.co.jp/...","30095","アイテムズ アーバンリサーチ","ITEMS URBAN RESEARCH",6,1,30001,30162,"ニット・セーター",4990,5490,9,"90001","フリー","brown,white,black","ブラウン,ホワイト,ブラック","G0008_A1460,G0001_A0166","2025-08-25","2025-08-25","itemsurbanresearch","P01940",true,false,false,false,true,false,false,false,false,false,false,false,true,2,4.5,2,2,10,true,false,true,true
```

## 用途分類説明

| 分類 | 記号 | 説明 |
|------|------|------|
| 索引利用 | 🔍 | VAISC内で検索・フィルタリングのインデックスとして使用 |
| レスポンス用 | 📤 | APIレスポンスとしてクライアントに返却される |
| 機能実装用 | ⚙️ | VAISC内部の処理・判定・制御に使用される |

## 実現可能性分類

| 記号 | 意味 | 説明 |
|------|------|------|
| ✅ | 確実 | DB項目存在 + API動作確認済み |
| ⚠️ | 要確認 | DB項目はあるが動作未確認、または仕様不明 |
| ❌ | 不可能 | DB項目なし、または明確に不足 |

## 必須フィールド
VAISCでの最低限の動作に必要な必須フィールド: **16フィールド**
- product_id, product_name_1, detail_url, image_url, brand_code, brand_name_jp
- store_id, figure_main, primary_item_code, secondary_item_code, category_name
- tax_inclusive_price, search_display_flag, freeword_search_exclude_flag
- recommend_display_flag, ranking_display_flag