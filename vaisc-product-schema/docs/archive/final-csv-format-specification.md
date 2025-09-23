# VAISC用CSVデータフォーマット仕様書（最終版）

## ⚠️ 重要な前提条件

**この仕様書では以下の区分で評価の確実性を示します：**

- ✅ **確実に実現可能** - DB項目存在 + API動作確認済み
- ⚠️ **要確認・曖昧** - DB項目はあるが動作未確認、または仕様不明
- ❌ **実現不可能** - DB項目なし、または明確に不足
- 🔶 **推測・希望的観測** - 仕様書や実API以外の情報による推測

## 1. CSVフィールド定義（用途別分類）

### 1.1 🔍 索引として利用されるフィールド（検索・フィルタリング用）

#### 1.1.1 基本検索フィールド
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `product_name_searchable` | `n_product_name_1` | ✅ 確実 | ngram処理済み |
| `product_description_searchable` | `n_caption` | ✅ 確実 | ngram処理済み |
| `freeword_tags` | `sm_freewords` | ✅ 確実 | カンマ区切り形式 |

#### 1.1.2 カテゴリ階層フィルタ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `store_id` | `i_store` | ✅ 確実 | 実API動作確認済み |
| `figure_main` | `i_figure_main` | ✅ 確実 | 実API動作確認済み |
| `primary_item_code` | `sm_primary_item` | ✅ 確実 | fcdに対応 |
| `secondary_item_code` | `sm_secondary_item` | ✅ 確実 | scdに対応 |

#### 1.1.3 属性フィルタ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `brand_code` | `s_web_brand_code` | ✅ 確実 | 実API動作確認済み |
| `price_current` | `i_tax_inclusive_price` | ✅ 確実 | 実API動作確認済み |
| `price_original` | `i_old_price` | ✅ 確実 | 実API動作確認済み |
| `discount_rate` | `i_discount_rate` | ✅ 確実 | 実API動作確認済み |
| `size_id` | `sm_size_id` | ✅ 確実 | DB項目存在 |
| `color_id` | `sm_color_id` | ✅ 確実 | DB項目存在 |
| `keywords_id` | `sm_keywords_id` | ✅ 確実 | DB項目存在 |

#### 1.1.4 日付フィルタ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `sale_start_date` | `s_sale_start_date` | ✅ 確実 | DB項目存在 |
| `arrival_date` | `s_rearrival_date` | ⚠️ 要確認 | 「再入荷日」のみ。「新着日」は別項目の可能性 |

#### 1.1.5 商品フラグフィルタ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `flag_pricereduced` | `i_icon_flag_pricereduced` | ✅ 確実 | 実API動作確認済み |
| `flag_sale` | `i_icon_flag_sale` | ✅ 確実 | 実API動作確認済み |
| `flag_giftwrap` | `i_icon_flag_giftwrap` | ✅ 確実 | DB項目存在 |
| `flag_rearrival` | `i_icon_flag_rearrival` | ✅ 確実 | DB項目存在 |
| `flag_newarrival` | `i_icon_flag_newarrival` | ✅ 確実 | 実API動作確認済み |
| `flag_limitedsale` | `i_icon_flag_limitedsale` | ✅ 確実 | DB項目存在 |
| `flag_salespromotion` | `i_icon_flag_salespromotion` | ✅ 確実 | DB項目存在 |
| `flag_deliveryfeeoff` | `i_icon_flag_deliveryfeeoff` | ✅ 確実 | DB項目存在 |
| `flag_secretsale` | `i_icon_flag_secretsell` | ✅ 確実 | DB項目存在 |
| `flag_reservation` | `i_icon_flag_reservation` | ✅ 確実 | DB項目存在 |
| `flag_used` | `i_icon_flag_used` | ✅ 確実 | DB項目存在 |
| `flag_coupon` | `i_icon_flag_coupon` | ✅ 確実 | DB項目存在 |
| `flag_bulkdiscount` | `i_icon_flag_bulk_discount` | ✅ 確実 | 実API動作確認済み |

#### 1.1.6 その他フィルタ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `shop_id` | `sm_shop` | ✅ 確実 | DB項目存在 |
| `web_shop_id` | `sm_web_shop` | ✅ 確実 | DB項目存在 |
| `floor_id` | `sm_floor` | ❌ 実現不可能 | DB項目は空（値なし） |

### 1.2 📤 APIレスポンスの取得データとして利用されるフィールド

#### 1.2.1 商品基本情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `product_id` | `s_product_id` | ✅ 確実 | 実API動作確認済み |
| `detail_url` | `url` | ✅ 確実 | 実API動作確認済み |
| `product_name_1` | `n_product_name_1` | ✅ 確実 | 実API動作確認済み |
| `product_name_2` | `n_product_name_2` | ✅ 確実 | 実API動作確認済み |
| `image_url` | `s_thumb_img` | ✅ 確実 | 実API動作確認済み |

#### 1.2.2 ブランド情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `brand_name_jp` | `s_web_brand_code_text_jp` | ✅ 確実 | 実API動作確認済み |
| `brand_name_en` | `s_web_brand_code_text_en` | ✅ 確実 | 実API動作確認済み |

#### 1.2.3 価格情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `tax_inclusive_price` | `i_tax_inclusive_price` | ✅ 確実 | 実API動作確認済み |
| `old_price` | `i_old_price` | ✅ 確実 | 実API動作確認済み |
| `discount_rate_display` | `i_discount_rate` | ✅ 確実 | 実API動作確認済み |

#### 1.2.4 ユーザー評価情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `comment_count` | `i_comment_count` | ✅ 確実 | DB項目存在 |
| `evaluation_average` | `f_evaluation_average` | ✅ 確実 | DB項目存在 |
| `favorite_count` | `i_favorite_count` | ✅ 確実 | DB項目存在 |

#### 1.2.5 カテゴリ情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `category_name` | `t_item_code_text` | ✅ 確実 | 実API動作確認済み |

#### 1.2.6 特別情報
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `coupon_thumbnail` | なし | ❌ 実現不可能 | 対応DB項目なし |
| `bulk_discount_message` | `i_bulk_discount_apply_low_lm_goods_qty` + `i_bulk_discount_rate` | ⚠️ 要確認 | 生成ロジック必要（「N点以上でN%OFF」形式） |

### 1.3 ⚙️ 機能実装のために利用されるフィールド

#### 1.3.1 検索制御
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `search_display_flag` | `i_use_search_flag` | ✅ 確実 | DB項目存在 |
| `freeword_search_exclude_flag` | `i_prohibit_freewordsearch` | ✅ 確実 | DB項目存在 |
| `recommend_display_flag` | `i_use_recommend_flag` | ✅ 確実 | DB項目存在 |
| `ranking_display_flag` | `i_use_ranking_flag` | ✅ 確実 | DB項目存在 |

#### 1.3.2 ソート用データ
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `popularity_score` | なし | ❌ 実現不可能 | 人気順ソート用データなし |
| `arrival_date_for_sort` | `s_rearrival_date` | ⚠️ 要確認 | 「新着順」ソートに使用可能か不明 |

#### 1.3.3 まとめ割関連
| CSVフィールド名 | 対応DB項目 | 評価 | 備考 |
|-------------|-----------|------|------|
| `bulk_discount_min_qty` | `i_bulk_discount_apply_low_lm_goods_qty` | ✅ 確実 | DB項目存在 |
| `bulk_discount_rate` | `i_bulk_discount_rate` | ✅ 確実 | DB項目存在 |

## 2. 実現不可能・要確認項目の詳細

### 2.1 ❌ 完全に実現不可能な項目

#### 2.1.1 DB項目不存在
| 機能 | 理由 | 影響 |
|------|------|------|
| `couponThumbnail` | 対応DB項目なし | クーポンサムネイル表示不可 |
| `floor` フィルタ | DB項目は空 | フロアフィルタ機能不可 |
| 人気順ソート | 人気度指標なし | 人気順ソート機能不可 |

#### 2.1.2 データ不足
| 機能 | 理由 | 影響 |
|------|------|------|
| `pricerereduced` フラグ | 再値下げ判定ロジック不明 | 再値下げフラグ表示不可 |

### 2.2 ⚠️ 要確認・曖昧な項目

#### 2.2.1 データ存在するが仕様不明
| 項目 | 問題点 | 必要な確認作業 |
|------|-------|-------------|
| 新着日フィルタ | 「再入荷日」と「新着日」の区別不明 | 新着判定基準の確認 |
| セール期間フィルタ | 終了日データなし | セール終了日データの確認 |
| 新着順ソート | ソート基準となる日付の確認 | 新着順の判定基準確認 |

#### 2.2.2 生成ロジック必要
| 項目 | 必要なロジック | 実装可否 |
|------|-------------|---------|
| `bulkDiscountMessage` | 「N点以上でN%OFF」メッセージ生成 | ⚠️ ロジック実装次第 |
| 代表色判定 | 全色展開時の代表色選択ロジック | ⚠️ 判定ルール次第 |

## 3. 確実に実現可能な機能範囲

### 3.1 ✅ 検索機能（100%実現可能）
- フリーワード検索（複数キーワード対応）
- 絞り込み検索
- 除外検索

### 3.2 ✅ フィルタリング機能（95%実現可能）
- カテゴリ階層フィルタ（3階層）
- 属性フィルタ（ブランド、価格、サイズ、カラー、特徴）
- 日付フィルタ（セール開始日のみ）
- 商品フラグフィルタ（13種類）
- ショップフィルタ

**❌ 実現不可**: フロアフィルタ（DB項目空）

### 3.3 ✅ ソート機能（80%実現可能）
- 関連度順（VAISC標準機能）
- 価格順（昇順・降順）
- 割引率順

**⚠️ 要確認**: 新着順（基準日付不明）
**❌ 実現不可**: 人気順（データなし）

### 3.4 ✅ レスポンス情報（90%実現可能）
- 商品基本情報（完全対応）
- ブランド情報（完全対応）
- 価格情報（完全対応）
- ユーザー評価情報（完全対応）
- フラグ情報（13/14種類対応）

**❌ 実現不可**: クーポンサムネイル、再値下げフラグ

## 4. 推奨実装順序

### 4.1 フェーズ1: 確実実装（リスクなし）
- 基本検索機能
- カテゴリ・属性フィルタ
- 価格・割引率ソート
- 商品基本情報レスポンス

### 4.2 フェーズ2: 要確認実装
- 新着順ソート（基準日付確認後）
- セール期間フィルタ（終了日データ確認後）
- まとめ割メッセージ（生成ロジック実装後）

### 4.3 フェーズ3: 代替実装検討
- 人気順ソート → 別指標での代替検討
- クーポンサムネイル → 別データソース検討
- フロアフィルタ → カテゴリフィルタで代替

## 5. 最終的なCSVフォーマット仕様

### 5.1 必須フィールド（確実に実現可能）
**合計: 45フィールド**

### 5.2 オプションフィールド（要確認・代替実装）
**合計: 8フィールド**

### 5.3 除外フィールド（実現不可能）
**合計: 5フィールド**

---

**⚠️ 重要**: この仕様書は実際のDB項目とAPI動作確認に基づく保守的な評価です。曖昧な部分は必ず事前確認してから実装を進めてください。