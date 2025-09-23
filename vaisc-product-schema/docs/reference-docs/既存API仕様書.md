# VAISC フリーワード検索 API仕様 (既存API抜粋)

## 概要

既存のsearch APIとmenu APIのうち、factor=freewordで利用される機能をVAISCに移行するための仕様整理です。

## 対象API

### 1. Search API (`/api/search`)

**エンドポイント**: GET `/api/search`

**主要パラメータ** (factor=freewordの場合):
- `factor`: "freeword" (必須)
- `q`: フリーワード検索文字列 (必須, +区切りで複数指定可能)
- `adw`: 絞り込みキーワード (任意, +区切りで複数指定可能)
- `exq`: 除外キーワード (任意, +区切りで複数指定可能)

**フィルタリングパラメータ**:
- `store`: 大分類 (1:ファッション, 2:キッズ等, カンマ区切り複数可)
- `figure`: 性別 (1:レディース, 2:メンズ等, カンマ区切り複数可)
- `bcd`: ブランドコード (カンマ区切り複数可)
- `fcd`: 第1カテゴリコード (カンマ区切り複数可)
- `scd`: 第2カテゴリコード (カンマ区切り複数可)
- `price`: 価格範囲 (下限_上限形式)
- `size`: サイズコード (カンマ区切り複数可)
- `color`: カラー (カンマ区切り複数可)
- `offrate`: 割引率 (40なら40%以上)
- `kwd`: 特徴コード (group_kwd形式, カンマ区切り複数可)

**日付関連パラメータ**:
- `new_date`: 新着日 (yyyymmdd_yyyymmdd形式)
- `sale_date`: セール日 (yyyymmdd_yyyymmdd形式)

**フラグパラメータ**:
- `arrival`: 新着/再入荷商品
- `sale`: セール商品
- `gift`: ギフトラッピング可能商品
- `limitedsale`: 期間限定セール商品
- `salespromotion`: 販促キャンペーン商品
- `shipfree`: 送料無料商品
- `preorder`: 先行予約商品
- `used`: 中古商品
- `coupon`: クーポン対象商品
- `bulkdiscount`: まとめ割対象商品
- `secretsale`: シークレットセール商品

**ソート・ページング**:
- `sortby`: ソート順
- `page`: ページ番号
- `per`: 1ページあたりの件数

**表示制御**:
- `full`: 0:代表色表示, 1:全色表示 (デフォルト:1)
- `display_dreni`: ドレニ商品表示フラグ (0:非表示, 1:表示)

### 2. Menu API (`/api/menu`)

**エンドポイント**: GET `/api/menu`

**主要パラメータ**: Search APIとほぼ同じパラメータセット (factor=freewordの場合)

## レスポンス構造

### SearchResponse (主要フィールド)

```json
{
  "redirectURL": "リダイレクト先URL",
  "searchContent": {
    "naviTreeTitle": "○I○I　web channel TOP",
    "naviTreeUrl": "http://voi.0101.co.jp/voi/",
    "products": [
      {
        "productId": "商品ID",
        "detailUrl": "商品詳細ページURL",
        "taxInclusivePrice": 税込価格,
        "oldPrice": 二重価格表示用,
        "discountRate": 割引率(%),
        "brandTextJP": "ブランド名称(日本語)",
        "brandTextEN": "ブランド名称(英語)",
        "productName1": "商品名",
        "productName2": "ブランド名(日英)",
        "imageURL": "メイン画像URL",
        "commentCount": ユーザーコメント数,
        "evaluationAverage": ユーザー平均評価(0.0~5.0),
        "favoriteCount": お気に入り登録数,
        "scdName": "アイテムカテゴリ名称",
        "couponThumbnail": "クーポンサムネイル",
        "bulkDiscountMessage": "まとめ割メッセージ",
        "flags": {
          "pricereduced": 値下げフラグ,
          "pricerereduced": 再値下げフラグ,
          "sale": セールフラグ,
          "giftwrap": ギフトラッピングフラグ,
          "rearrival": 再入荷フラグ,
          "newarrival": 新着フラグ,
          "limitedsale": 期間限定セールフラグ,
          "salespromotion": 販促キャンペーンフラグ,
          "deliveryfeeoff": 配送料無料フラグ,
          "secretsale": シークレット販売フラグ,
          "reservation": 先行予約フラグ,
          "used": 中古商品フラグ,
          "coupon": クーポンフラグ,
          "bulkdiscount": まとめ割フラグ
        },
        "colorProducts": [
          // 色玉表示用データ (代表色表示時のみ)
        ]
      }
    ],
    "nowPage": 現在のページ番号,
    "per": 1ページあたりの件数,
    "total": 総商品件数,
    "sortMenu": [
      // ソートメニュー情報
    ],
    "colorDisplay": {
      // 色表示切り替え情報
    },
    "showPrice": true
  }
}
```

## VAISCへの移行要件

### 検索機能
1. **フリーワード検索**: 複数キーワード対応（+区切り）
2. **絞り込みキーワード**: 検索結果をさらに絞り込む
3. **除外キーワード**: 特定キーワードを含む商品を除外

### フィルタリング機能
1. **カテゴリ階層**: store > fcd > scd の3階層
2. **属性フィルタ**: 性別、ブランド、サイズ、カラー、価格帯
3. **日付フィルタ**: 新着日、セール日
4. **フラグフィルタ**: 各種商品フラグ（セール、新着、クーポン等）

### ソート機能
- 既存のソート順を維持（詳細は要確認）

### ページング
- ページ番号とページあたりの件数指定

### 表示制御
- 代表色/全色表示の切り替え
- 特定ブランド商品の表示/非表示制御