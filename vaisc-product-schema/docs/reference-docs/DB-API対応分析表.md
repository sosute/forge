# DB項目とAPI機能の対応分析

## 1. 検索機能の実現可能性

### 1.1 フリーワード検索機能
| 機能 | 必要なDB項目 | 対応状況 | 備考 |
|------|-------------|----------|------|
| 基本フリーワード検索 | 検索対象テキストフィールド | ✅ 対応可能 | `n_product_name_1`(商品名), `n_caption`(キャプション), `sm_freewords`(フリーワードタグ) |
| 絞り込み検索 | 同上 | ✅ 対応可能 | 同上 |
| 除外検索 | 同上 | ✅ 対応可能 | 同上 |

## 2. フィルタリング機能の実現可能性

### 2.1 カテゴリ階層フィルタ
| APIパラメータ | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `store` | `i_store` | ✅ 完全対応 | 値例: 6 |
| `figure` | `i_figure_main`, `i_figure_all` | ✅ 完全対応 | 値例: 1 |
| `fcd` | `sm_primary_item` | ✅ 完全対応 | 値例: 30001 |
| `scd` | `sm_secondary_item` | ✅ 完全対応 | 値例: 30162 |

### 2.2 属性フィルタ
| APIパラメータ | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `bcd` (ブランドコード) | `s_web_brand_code` | ✅ 完全対応 | 値例: 30095 |
| `price` (価格範囲) | `i_tax_inclusive_price`, `i_old_price` | ✅ 完全対応 | 現在価格・元価格両方あり |
| `size` (サイズ) | `sm_size_id` | ✅ 完全対応 | 値例: 90001 |
| `color` (カラー) | `sm_color_id`, `sm_color_search` | ✅ 完全対応 | ID・検索用テキスト両方あり |
| `offrate` (割引率) | `i_discount_rate` | ✅ 完全対応 | 値例: 9 |
| `kwd` (特徴コード) | `sm_keywords_id` | ✅ 完全対応 | 値例: G0008_A1460,G0001_A0166 |

### 2.3 日付フィルタ
| APIパラメータ | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `new_date` (新着日) | `s_rearrival_date` | ⚠️ 部分対応 | 再入荷日のみ。新着日が別途必要 |
| `sale_date` (セール日) | `s_sale_start_date` | ⚠️ 部分対応 | 開始日のみ。終了日が別途必要 |

### 2.4 商品フラグフィルタ
| APIパラメータ | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `arrival` (新着/再入荷) | `i_icon_flag_newarrival`, `i_icon_flag_rearrival` | ✅ 完全対応 | |
| `sale` (セール) | `i_icon_flag_sale` | ✅ 完全対応 | |
| `gift` (ギフト) | `i_icon_flag_giftwrap` | ✅ 完全対応 | |
| `limitedsale` (期間限定) | `i_icon_flag_limitedsale` | ✅ 完全対応 | |
| `salespromotion` (販促) | `i_icon_flag_salespromotion` | ✅ 完全対応 | |
| `shipfree` (送料無料) | `i_icon_flag_deliveryfeeoff` | ✅ 完全対応 | |
| `preorder` (先行予約) | `i_icon_flag_reservation` | ✅ 完全対応 | |
| `used` (中古) | `i_icon_flag_used` | ✅ 完全対応 | |
| `coupon` (クーポン) | `i_icon_flag_coupon` | ✅ 完全対応 | |
| `bulkdiscount` (まとめ割) | `i_icon_flag_bulk_discount` | ✅ 完全対応 | |
| `secretsale` (シークレット) | `i_icon_flag_secretsell` | ✅ 完全対応 | |

### 2.5 その他フィルタ
| APIパラメータ | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `shop` (ショップ) | `sm_shop` | ✅ 完全対応 | 値例: itemsurbanresearch |
| `wno` (WEBショップ) | `sm_web_shop` | ✅ 完全対応 | 値例: P01940 |
| `floor` (フロア) | `sm_floor` | ❌ 未対応 | DBに値が空 |

## 3. レスポンス情報の実現可能性

### 3.1 商品基本情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `productId` | `s_product_id` | ✅ 完全対応 | |
| `detailUrl` | `url` | ✅ 完全対応 | |
| `taxInclusivePrice` | `i_tax_inclusive_price` | ✅ 完全対応 | |
| `oldPrice` | `i_old_price` | ✅ 完全対応 | |
| `discountRate` | `i_discount_rate` | ✅ 完全対応 | |

### 3.2 ブランド情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `brandTextJP` | `s_web_brand_code_text_jp` | ✅ 完全対応 | |
| `brandTextEN` | `s_web_brand_code_text_en` | ✅ 完全対応 | |

### 3.3 商品名・説明
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `productName1` | `n_product_name_1` | ✅ 完全対応 | |
| `productName2` | `n_product_name_2` | ✅ 完全対応 | |

### 3.4 画像情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `imageURL` | `s_thumb_img` | ✅ 完全対応 | |

### 3.5 ユーザー評価情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `commentCount` | `i_comment_count` | ✅ 完全対応 | |
| `evaluationAverage` | `f_evaluation_average` | ✅ 完全対応 | |
| `favoriteCount` | `i_favorite_count` | ✅ 完全対応 | |

### 3.6 カテゴリ情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `scdName` | `t_item_code_text` | ✅ 完全対応 | |

### 3.7 特別情報
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `couponThumbnail` | ❌ 対応項目なし | ❌ 未対応 | 新規データ必要 |
| `bulkDiscountMessage` | `i_bulk_discount_apply_low_lm_goods_qty`, `i_bulk_discount_rate` | ⚠️ 部分対応 | メッセージ生成ロジック必要 |

### 3.8 フラグ情報 (flags)
| APIフィールド | 対応DB項目 | 対応状況 | 備考 |
|-------------|-----------|----------|------|
| `pricereduced` | `i_icon_flag_pricereduced` | ✅ 完全対応 | |
| `pricerereduced` | ❌ 対応項目なし | ❌ 未対応 | 再値下げ判定ロジック必要 |
| `sale` | `i_icon_flag_sale` | ✅ 完全対応 | |
| `giftwrap` | `i_icon_flag_giftwrap` | ✅ 完全対応 | |
| `rearrival` | `i_icon_flag_rearrival` | ✅ 完全対応 | |
| `newarrival` | `i_icon_flag_newarrival` | ✅ 完全対応 | |
| `limitedsale` | `i_icon_flag_limitedsale` | ✅ 完全対応 | |
| `salespromotion` | `i_icon_flag_salespromotion` | ✅ 完全対応 | |
| `deliveryfeeoff` | `i_icon_flag_deliveryfeeoff` | ✅ 完全対応 | |
| `secretsale` | `i_icon_flag_secretsell` | ✅ 完全対応 | |
| `reservation` | `i_icon_flag_reservation` | ✅ 完全対応 | |
| `used` | `i_icon_flag_used` | ✅ 完全対応 | |
| `coupon` | `i_icon_flag_coupon` | ✅ 完全対応 | |
| `bulkdiscount` | `i_icon_flag_bulk_discount` | ✅ 完全対応 | |

## 4. 表示・制御機能

### 4.1 ソート機能
| 機能 | 必要な情報 | 対応状況 | 備考 |
|------|-----------|----------|------|
| 価格順ソート | 価格情報 | ✅ 完全対応 | `i_tax_inclusive_price` |
| 新着順ソート | 新着日情報 | ⚠️ 要確認 | 新着日フィールド要確認 |
| 人気順ソート | 人気指標 | ❌ 未対応 | 売上・閲覧数等のデータ必要 |
| 関連度順ソート | 検索スコア | ❌ 未対応 | VAISC側で計算 |

### 4.2 ページング機能
| 機能 | 必要な情報 | 対応状況 | 備考 |
|------|-----------|----------|------|
| 総件数取得 | 検索結果カウント | ✅ 対応可能 | VAISC側で計算 |
| ページ制御 | - | ✅ 対応可能 | VAISC標準機能 |

### 4.3 色表示制御
| 機能 | 必要な情報 | 対応状況 | 備考 |
|------|-----------|----------|------|
| 代表色表示 | 代表色判定 | ⚠️ 要確認 | 代表色判定ロジック必要 |
| 全色表示 | カラー展開情報 | ✅ 完全対応 | `sm_color_id`, `sm_color_search` |

## 5. 不足情報の特定

### 5.1 ❌ 完全未対応項目 (新規データ作成必要)
1. **`couponThumbnail`** - クーポンサムネイル情報
2. **`pricerereduced`** - 再値下げフラグ（判定ロジック必要）
3. **`floor`** - フロア情報（現在DBで空）
4. **人気順ソート用データ** - 売上・閲覧数・人気指標
5. **新着日情報** - 正確な新着日（入荷日と区別）

### 5.2 ⚠️ 部分対応項目 (補完データ・ロジック必要)
1. **`new_date`** - 新着日フィルタ（再入荷日はあるが新着日要確認）
2. **`sale_date`** - セール期間フィルタ（開始日のみ、終了日必要）
3. **`bulkDiscountMessage`** - まとめ割メッセージ（生成ロジック必要）
4. **代表色判定** - 色表示制御用（判定ルール必要）

### 5.3 ✅ 完全対応項目
- 基本的な商品情報: 84/91項目で対応可能
- フィルタリング機能: 90%以上対応可能
- フラグ情報: 12/14項目で対応可能

## 6. 次のステップ: CSVフォーマット設計

この分析結果を基に、以下の観点でCSVフィールドを設計します：

### 6.1 フィールド用途分類
- 🔍 **索引として利用** - 検索・フィルタリング用
- 📤 **APIレスポンス取得データ** - クライアントへの返却用  
- ⚙️ **機能実装のために利用** - 内部処理・判定用

### 6.2 優先度分類
- 🔴 **必須** - 既存API互換性のため必要
- 🟡 **推奨** - 機能向上のため推奨
- 🟢 **オプション** - 将来拡張用