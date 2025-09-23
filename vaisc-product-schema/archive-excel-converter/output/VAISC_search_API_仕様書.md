# VAISC サーチAPI レスポンス仕様書

VAISCのサーチAPIが返すJSONレスポンスの詳細仕様です。

## 📊 サマリー
- **総フィールド数**: 45個
- **エンドポイント**: `/api/search`

## 📋 フィールド一覧

| No. | フィールド名 | 型 | 説明 |
|-----|-------------|-----|------|
| 2 | `redirectURL` | string | リダイレクト先URL |
| 4 | `naviTreeTitle` | string | トップのタイトル.「○I○I　web channel TOP」が固定値で設定 |
| 5 | `naviTreeUrl` | string | トップのURL。固定値 |
| 8 | `productId` | string | 商品ID |
| 9 | `detailUrl` | string | 商品詳細ページURL |
| 10 | `taxInclusivePrice` | number | 税込価格 |
| 11 | `oldPrice` | number | 二重価格表示用 |
| 12 | `discountRate` | number | 割引率(%) |
| 13 | `brandTextJP` | string | ブランド名称(日本語) |
| 14 | `brandTextEN` | string | ブランド名称(英語) |
| 16 | `pricereduced` | boolean | 値下げフラグ判定 |
| 17 | `pricerereduced` | boolean | 再値下げフラグ判定(パッケージの"pricereduced=2"に相当) |
| 18 | `sale` | boolean | セールフラグ判定 |
| 19 | `giftwrap` | boolean | ギフトラッピングフラグ判定 |
| 20 | `rearrival` | boolean | 再入荷商品フラグ判定 |
| 21 | `newarrival` | boolean | 新着商品フラグ判定 |
| 22 | `limitedsale` | boolean | 期間限定セールフラグ判定 |
| 23 | `salespromotion` | boolean | 販促キャンペーンフラグ判定 |
| 24 | `deliveryfeeoff` | boolean | 配送料無料フラグ判定 |
| 25 | `secretsale` | boolean | シークレット販売フラグ判定 |
| 26 | `reservation` | boolean | 先行予約商品フラグ判定 |
| 27 | `used` | boolean | 中古商品フラグ判定 |
| 28 | `coupon` | boolean | クーポンフラグ判定 |
| 31 | `productName1` | string | 商品の名前 |
| 32 | `productName2` | string | 商品の属するブランドの日本語名+英語名(現状) |
| 33 | `imageURL` | string | メイン画像へのURL |
| 34 | `commentCount` | number | ユーザーコメント数、nullあり |
| 35 | `evaluationAverage` | number | ユーザー平均評価、0.0~5.0 |
| 36 | `favoriteCount` | number | お気に入り登録数、nullあり |
| 38 | `couponThumbnail` | string | クーポンのサムネイル |
| 59 | `nowPage` | number | 何ページ目か（最低ページは1) |
| 60 | `per` | number | 1ページあたりの商品件数 |
| 63 | `id` | string | example: 0 |
| 64 | `name` | string | example: 新着順 |
| 65 | `isSelected` | boolean | example: false |
| 66 | `order` | number | example: 1 |
| 69 | `total` | number | 総商品件数 |
| 72 | `name` | string | 全色表示 or 代表色 |
| 73 | `selected` | boolean | trueだったら選択中；falseだったら選択されてない |
| 76 | `captionText` | string | ブランド、ショップ等が持つ説明文.factor=shop,brand,webshopの場合のみに設定、他はnull |
| 77 | `isBannerVisible` | boolean | バナー情報を表示するかどうかの判定結果; trueなら表示 |
| 78 | `showPrice` | boolean | 価格を表示するかの判定; trueなら表示 |
| 79 | `logoImageAltText` | string | ショップのロゴ画像ALT |
| 80 | `logoImageURI` | string | ショップのロゴ画像パス |
| 81 | `store` | string | storeIDに対応するテキスト 複数指定された場合はカンマ区切りでテキストを繋げる (ex. ファッション、スポーツ) |

## 🔍 詳細仕様

### redirectURL

**基本情報**
- **No.**: 2
- **フィールド名**: `redirectURL`
- **値の例**: `"https://search-voi.0101.co.jp/brand/10030/"`
- **説明**: リダイレクト先URL

**利用状況**
- **VAICS導入後**: サービス提供コントロールより設定

**JSON例**
```json
"redirectURL": "https://search-voi.0101.co.jp/brand/10030/"
```

---

### naviTreeTitle

**基本情報**
- **No.**: 4
- **フィールド名**: `naviTreeTitle`
- **値の例**: `"○I○I　web channel TOP"`
- **説明**: トップのタイトル.「○I○I　web channel TOP」が固定値で設定

**利用状況**
- **VAICS導入後**: ×

**JSON例**
```json
"naviTreeTitle": "○I○I　web channel TOP"
```

---

### naviTreeUrl

**基本情報**
- **No.**: 5
- **フィールド名**: `naviTreeUrl`
- **値の例**: `"http://voi.0101.co.jp/voi/"`
- **説明**: トップのURL。固定値

**利用状況**
- **VAICS導入後**: ×

**JSON例**
```json
"naviTreeUrl": "http://voi.0101.co.jp/voi/"
```

---

### productId

**基本情報**
- **No.**: 8
- **フィールド名**: `productId`
- **値の例**: `"WW7786010101"`
- **説明**: 商品ID

**利用状況**
- **VAICS導入後**: SearchResult.Product.id

**JSON例**
```json
"productId": "WW7786010101"
```

---

### detailUrl

**基本情報**
- **No.**: 9
- **フィールド名**: `detailUrl`
- **値の例**: `"//voi.0101.co.jp/voi/webcatalog/showGoodsDetails.do?wrt=5&mcd=WW769&cpg=601&pno=11&ino=01"`
- **説明**: 商品詳細ページURL

**利用状況**
- **VAICS導入後**: SearchResult.Product.uri

**JSON例**
```json
"detailUrl": "//voi.0101.co.jp/voi/webcatalog/showGoodsDetails.do?wrt=5&mcd=WW769&cpg=601&pno=11&ino=01"
```

---

### taxInclusivePrice

**基本情報**
- **No.**: 10
- **フィールド名**: `taxInclusivePrice`
- **値の例**: `2796`
- **説明**: 税込価格

**利用状況**
- **VAICS導入後**: SearchResult.Product.priceinfo.uri

**JSON例**
```json
"taxInclusivePrice": 2796
```

---

### oldPrice

**基本情報**
- **No.**: 11
- **フィールド名**: `oldPrice`
- **値の例**: `0`
- **説明**: 二重価格表示用

**JSON例**
```json
"oldPrice": 0
```

---

### discountRate

**基本情報**
- **No.**: 12
- **フィールド名**: `discountRate`
- **値の例**: `0`
- **説明**: 割引率(%)

**JSON例**
```json
"discountRate": 0
```

---

### brandTextJP

**基本情報**
- **No.**: 13
- **フィールド名**: `brandTextJP`
- **値の例**: `"ヴェリココ/ラクチンきれいシューズ"`
- **説明**: ブランド名称(日本語)

**JSON例**
```json
"brandTextJP": "ヴェリココ/ラクチンきれいシューズ"
```

---

### brandTextEN

**基本情報**
- **No.**: 14
- **フィールド名**: `brandTextEN`
- **値の例**: `"velikoko"`
- **説明**: ブランド名称(英語)

**JSON例**
```json
"brandTextEN": "velikoko"
```

---

### pricereduced

**基本情報**
- **No.**: 16
- **フィールド名**: `pricereduced`
- **値の例**: `false`
- **説明**: 値下げフラグ判定

**JSON例**
```json
"pricereduced": false
```

---

### pricerereduced

**基本情報**
- **No.**: 17
- **フィールド名**: `pricerereduced`
- **値の例**: `false`
- **説明**: 再値下げフラグ判定(パッケージの"pricereduced=2"に相当)

**JSON例**
```json
"pricerereduced": false
```

---

### sale

**基本情報**
- **No.**: 18
- **フィールド名**: `sale`
- **値の例**: `false`
- **説明**: セールフラグ判定

**JSON例**
```json
"sale": false
```

---

### giftwrap

**基本情報**
- **No.**: 19
- **フィールド名**: `giftwrap`
- **値の例**: `false`
- **説明**: ギフトラッピングフラグ判定

**JSON例**
```json
"giftwrap": false
```

---

### rearrival

**基本情報**
- **No.**: 20
- **フィールド名**: `rearrival`
- **値の例**: `false`
- **説明**: 再入荷商品フラグ判定

**JSON例**
```json
"rearrival": false
```

---

### newarrival

**基本情報**
- **No.**: 21
- **フィールド名**: `newarrival`
- **値の例**: `false`
- **説明**: 新着商品フラグ判定

**JSON例**
```json
"newarrival": false
```

---

### limitedsale

**基本情報**
- **No.**: 22
- **フィールド名**: `limitedsale`
- **値の例**: `false`
- **説明**: 期間限定セールフラグ判定

**JSON例**
```json
"limitedsale": false
```

---

### salespromotion

**基本情報**
- **No.**: 23
- **フィールド名**: `salespromotion`
- **値の例**: `false`
- **説明**: 販促キャンペーンフラグ判定

**JSON例**
```json
"salespromotion": false
```

---

### deliveryfeeoff

**基本情報**
- **No.**: 24
- **フィールド名**: `deliveryfeeoff`
- **値の例**: `false`
- **説明**: 配送料無料フラグ判定

**JSON例**
```json
"deliveryfeeoff": false
```

---

### secretsale

**基本情報**
- **No.**: 25
- **フィールド名**: `secretsale`
- **値の例**: `false`
- **説明**: シークレット販売フラグ判定

**JSON例**
```json
"secretsale": false
```

---

### reservation

**基本情報**
- **No.**: 26
- **フィールド名**: `reservation`
- **値の例**: `false`
- **説明**: 先行予約商品フラグ判定

**JSON例**
```json
"reservation": false
```

---

### used

**基本情報**
- **No.**: 27
- **フィールド名**: `used`
- **値の例**: `false`
- **説明**: 中古商品フラグ判定

**JSON例**
```json
"used": false
```

---

### coupon

**基本情報**
- **No.**: 28
- **フィールド名**: `coupon`
- **値の例**: `false`
- **説明**: クーポンフラグ判定

**JSON例**
```json
"coupon": false
```

---

### productName1

**基本情報**
- **No.**: 31
- **フィールド名**: `productName1`
- **値の例**: `"【19.5～27.0cm】2Wayファーパンプス（1.5cmヒール）"`
- **説明**: 商品の名前

**JSON例**
```json
"productName1": "【19.5～27.0cm】2Wayファーパンプス（1.5cmヒール）"
```

---

### productName2

**基本情報**
- **No.**: 32
- **フィールド名**: `productName2`
- **値の例**: `"パープル＆イエロー（レディース）（Purple & Yellow）"`
- **説明**: 商品の属するブランドの日本語名+英語名(現状)

**JSON例**
```json
"productName2": "パープル＆イエロー（レディース）（Purple & Yellow）"
```

---

### imageURL

**基本情報**
- **No.**: 33
- **フィールド名**: `imageURL`
- **値の例**: `"https://voi.0101.co.jp/voi/webcatalog/img/ww777/601/ww777-60110-54a.jpg"`
- **説明**: メイン画像へのURL

**JSON例**
```json
"imageURL": "https://voi.0101.co.jp/voi/webcatalog/img/ww777/601/ww777-60110-54a.jpg"
```

---

### commentCount

**基本情報**
- **No.**: 34
- **フィールド名**: `commentCount`
- **値の例**: `0`
- **説明**: ユーザーコメント数、nullあり

**JSON例**
```json
"commentCount": 0
```

---

### evaluationAverage

**基本情報**
- **No.**: 35
- **フィールド名**: `evaluationAverage`
- **値の例**: `0`
- **説明**: ユーザー平均評価、0.0~5.0

**JSON例**
```json
"evaluationAverage": 0
```

---

### favoriteCount

**基本情報**
- **No.**: 36
- **フィールド名**: `favoriteCount`
- **値の例**: `0`
- **説明**: お気に入り登録数、nullあり

**JSON例**
```json
"favoriteCount": 0
```

---

### couponThumbnail

**基本情報**
- **No.**: 38
- **フィールド名**: `couponThumbnail`
- **値の例**: `"1000円クーポン対象商品"`
- **説明**: クーポンのサムネイル

**JSON例**
```json
"couponThumbnail": "1000円クーポン対象商品"
```

---

### nowPage

**基本情報**
- **No.**: 59
- **フィールド名**: `nowPage`
- **値の例**: `1`
- **説明**: 何ページ目か（最低ページは1)

**JSON例**
```json
"nowPage": 1
```

---

### per

**基本情報**
- **No.**: 60
- **フィールド名**: `per`
- **値の例**: `100`
- **説明**: 1ページあたりの商品件数

**JSON例**
```json
"per": 100
```

---

### id

**基本情報**
- **No.**: 63
- **フィールド名**: `id`
- **値の例**: `"0"`
- **説明**: example: 0

**JSON例**
```json
"id": "0"
```

---

### name

**基本情報**
- **No.**: 64
- **フィールド名**: `name`
- **値の例**: `"新着順"`
- **説明**: example: 新着順

**JSON例**
```json
"name": "新着順"
```

---

### isSelected

**基本情報**
- **No.**: 65
- **フィールド名**: `isSelected`
- **値の例**: `false`
- **説明**: example: false

**JSON例**
```json
"isSelected": false
```

---

### order

**基本情報**
- **No.**: 66
- **フィールド名**: `order`
- **値の例**: `1`
- **説明**: example: 1

**JSON例**
```json
"order": 1
```

---

### total

**基本情報**
- **No.**: 69
- **フィールド名**: `total`
- **値の例**: `100`
- **説明**: 総商品件数

**JSON例**
```json
"total": 100
```

---

### name

**基本情報**
- **No.**: 72
- **フィールド名**: `name`
- **値の例**: `"string"`
- **説明**: 全色表示 or 代表色

**JSON例**
```json
"name": "string"
```

---

### selected

**基本情報**
- **No.**: 73
- **フィールド名**: `selected`
- **値の例**: `true`
- **説明**: trueだったら選択中；falseだったら選択されてない

**JSON例**
```json
"selected": true
```

---

### captionText

**基本情報**
- **No.**: 76
- **フィールド名**: `captionText`
- **値の例**: `"example caption"`
- **説明**: ブランド、ショップ等が持つ説明文.factor=shop,brand,webshopの場合のみに設定、他はnull

**利用状況**
- **VAICS導入後**: ×

**JSON例**
```json
"captionText": "example caption"
```

---

### isBannerVisible

**基本情報**
- **No.**: 77
- **フィールド名**: `isBannerVisible`
- **値の例**: `true`
- **説明**: バナー情報を表示するかどうかの判定結果; trueなら表示

**利用状況**
- **VAICS導入後**: ×\n今回スコープ外のため対応なし

**JSON例**
```json
"isBannerVisible": true
```

---

### showPrice

**基本情報**
- **No.**: 78
- **フィールド名**: `showPrice`
- **値の例**: `true`
- **説明**: 価格を表示するかの判定; trueなら表示

**利用状況**
- **VAICS導入後**: ×

**JSON例**
```json
"showPrice": true
```

---

### logoImageAltText

**基本情報**
- **No.**: 79
- **フィールド名**: `logoImageAltText`
- **値の例**: `"example text"`
- **説明**: ショップのロゴ画像ALT

**利用状況**
- **VAICS導入後**: ×\n今回スコープ外のため対応なし

**JSON例**
```json
"logoImageAltText": "example text"
```

---

### logoImageURI

**基本情報**
- **No.**: 80
- **フィールド名**: `logoImageURI`
- **値の例**: `"adidas.gif"`
- **説明**: ショップのロゴ画像パス

**利用状況**
- **VAICS導入後**: ×\n今回スコープ外のため対応なし

**JSON例**
```json
"logoImageURI": "adidas.gif"
```

---

### store

**基本情報**
- **No.**: 81
- **フィールド名**: `store`
- **値の例**: `"ファッション"`
- **説明**: storeIDに対応するテキスト 複数指定された場合はカンマ区切りでテキストを繋げる (ex. ファッション、スポーツ)

**利用状況**
- **VAICS導入後**: ×\nTLBに詳細確認する

**JSON例**
```json
"store": "ファッション"
```

---
