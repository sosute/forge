# VAISC 既存API仕様書 (正式版)

## 概要

既存のsearch APIとmenu APIの正式仕様（Swagger YAML準拠）をVAISC移行のための参考資料として整理したものです。

## 対象API

### 1. Search API (`/api/search`)

**エンドポイント**: GET `/api/search`

#### 必須パラメータ
- `factor`: **"freeword"** (必須) - ベースとなる検索種別

#### フリーワード検索パラメータ
- `q`: フリーワード検索文字列 (**必須**, +区切りで複数指定可能)
  - 例: `カバン+メンズ`
- `adw`: 絞り込みUI内のキーワード検索 (+区切りで複数指定可能)
  - 例: `カバン`
- `exq`: 除外キーワード検索 (+区切りで複数指定可能)
  - 例: `トート`

#### フィルタリングパラメータ
- `store`: 大分類 (カンマ区切り複数可)
  - 1: ファッション, 2: キッズ, 3: コスメ, 4: スポーツ, 5: スイーツ, 6: インテリア, 7: 生活雑貨, 8: 電化製品, 9: おもちゃ・ゲーム・ホビー, 10: 書籍・音楽映像ソフト, 11: アニメ・キャラクター系グッズ
- `figure`: 性別 (カンマ区切り複数可)
  - 1: レディース, 2: メンズ, 3: ガール, 4: ボーイ, 5: ホーム
- `bcd`: ブランドコード (カンマ区切り複数可)
  - 例: `10799`
- `fcd`: 第1カテゴリコード (カンマ区切り複数可)
  - 例: `10000`
- `scd`: 第2カテゴリコード (カンマ区切り複数可)
  - 例: `10004`
- `price`: 価格範囲 (下限_上限形式, 1つまで)
  - 例: `"0_10000"`
- `size`: サイズコード (カンマ区切り複数可)
  - 例: `40005`
- `color`: カラー (カンマ区切り複数可)
  - 例: `black`
- `offrate`: 割引率 (40なら40%以上, 1つまで)
  - 例: `40`
- `kwd`: 特徴コード (group_kwd形式, カンマ区切り複数可)
  - 例: `"G0007_A0224"`

#### 日付関連パラメータ
- `new_date`: 新着(入荷)日 (yyyymmdd_yyyymmdd形式, 最大2週間, カンマ区切り複数可)
  - 例: `"20200213_20200226"`
- `sale_date`: セール日 (yyyymmdd_yyyymmdd形式, 最大2週間, カンマ区切り複数可)
  - 例: `"20200213_20200226"`

#### フラグパラメータ
- `arrival`: 新着/再入荷商品 (1: 新着, 2: 再入荷, カンマ区切り複数可)
- `sale`: セール商品 (1: セール, 2: 再値下げ, 3: 通常, カンマ区切り複数可)
- `gift`: ギフトラッピング可能商品 (0:off, 1:on, 1つまで)
- `ls`: 期間限定セール商品 (0:off, 1:on, 1つまで)
- `sp`: 販促キャンペーン商品 (0:off, 1:on, 1つまで)
- `sf`: 送料無料商品 (0:off, 1:on, 1つまで)
- `rsrv`: 先行予約商品 (0:off, 1:on, 1つまで)
- `used`: 中古商品 (0:新品, 1:中古, 1つまで)
- `coupon`: クーポン対象商品 (0:なし, 1:あり, 1つまで)
- `bulkdiscount`: まとめ割対象商品 (0:非対象, 1:対象, 1つまで)
- `secretsale`: シークレットセール商品 (search APIのみ)

#### ソート・ページングパラメータ
- `sortby`: ソート順 (1つまで)
  - **0**: 新着順 (再入荷日降順→在庫ありフラグ降順→アイテム大分類ID昇順→アイテム小分類ID昇順→商品型番昇順)
  - **1**: 安い順 (価格昇順→在庫ありフラグ降順→再入荷日降順→アイテム大分類ID昇順→アイテム小分類ID昇順→商品型番昇順)
  - **2**: 高い順 (価格降順→在庫ありフラグ降順→再入荷日降順→アイテム大分類ID昇順→アイテム小分類ID昇順→商品型番昇順)
  - **4**: アクセス数順 (アクセス数降順→在庫ありフラグ降順→再入荷日降順→アイテム大分類ID昇順→アイテム小分類ID昇順→商品型番昇順)
  - **5**: キーワードと関連度が高い順 (関連度降順→在庫ありフラグ降順→購買数降順→再入荷日降順→アイテム大分類ID昇順→アイテム小分類ID昇順→商品型番昇順)
  - **6**: お客さまコメントの多い順
  - **7**: お客さま評価の高い順
  - **8**: お気に入り登録の多い順
  - **14**: オフ率の高い順
  - **15**: 人気順
  - **16**: あなたへのおすすめ商品順
  - **17**: 売れている順
  - **18**: 入金額の高い順
  - **19**: まとめ割オフ率の高い順
- `page`: ページ番号 (デフォルト: 1)
- `per`: 1ページあたりの件数 (デフォルト: 60)

#### 表示制御パラメータ
- `full`: カラー表示制御 (デフォルト: 1)
  - **0**: 代表色表示 (同じ商品のとき、代表色のみ表示)
  - **1**: カラー展開 (同じ商品でも全色を結果に表示)
- `display_dreni`: ドレニ商品表示フラグ (デフォルト: 0)
  - **0**: s_web_brand_code=31192 (ドレニ) 商品を返却対象にしない
  - **1**: s_web_brand_code=31192 (ドレニ) 商品を返却対象にする
- `forceFreeword`: 強制的にフリーワード検索実行フラグ (デフォルト: 0)
  - **0**: off, **1**: on (リダイレクト機能を使わない)

#### その他パラメータ
- `shop`: ショップ (実店舗)
- `wno`: ウェブショップコード (カンマ区切り複数可)
- `floor`: フロア(カテゴリの集合体) (カンマ区切り複数可)
- `sd`: こだわりサイズ ((region_id)_min_max形式, カンマ区切り複数可)

### 2. Menu API (`/api/menu`)

**エンドポイント**: GET `/api/menu`

**主要パラメータ**: Search APIとほぼ同じパラメータセット (差分: `sortby`, `page`, `per`, `forceFreeword`は除外)

## レスポンス構造

### Search API レスポンス詳細構造

```json
{
  "redirectURL": null,  // リダイレクト先URL (通常はnull)
  "searchContent": {
    "naviTreeTitle": "○I○I　web channel TOP",
    "naviTreeUrl": "http://voi.0101.co.jp/voi/",
    "products": [
      {
        "productId": "CF0212351201",  // 商品ID
        "detailUrl": "https://voi.0101.co.jp/voi/wsg/wrt-5_mcd-CF021_cpg-235_pno-12_ino-01_ocn-03.html",
        "taxInclusivePrice": 4990,  // 税込価格
        "oldPrice": 5490,  // 二重価格表示用 (0の場合もあり)
        "discountRate": 9,  // 割引率(%)
        "brandTextJP": "アイテムズ アーバンリサーチ",
        "brandTextEN": "ITEMS URBAN RESEARCH",
        "productName1": "ニットTシャツ",  // 商品名
        "productName2": "アイテムズ アーバンリサーチ",  // ブランド名(通常は日本語)
        "imageURL": "https://image.0101.co.jp/17412/img/cf02123512/cf021-23512-06b.jpg?basethum=225",
        "commentCount": 2,  // ユーザーコメント数
        "evaluationAverage": 4.5,  // ユーザー平均評価(0.0~5.0)
        "favoriteCount": 2,  // お気に入り登録数
        "scdName": "ニット・セーター",  // アイテムカテゴリ名称
        "couponThumbnail": null,  // クーポンサムネイル
        "bulkDiscountMessage": "2個以上で10%OFF",  // まとめ割メッセージ (nullの場合もあり)
        "flags": {
          "pricereduced": true,   // 値下げフラグ
          "pricerereduced": false,  // 再値下げフラグ
          "sale": false,  // セールフラグ
          "giftwrap": false,  // ギフトラッピングフラグ
          "rearrival": false,  // 再入荷フラグ
          "newarrival": true,  // 新着フラグ
          "limitedsale": false,  // 期間限定セールフラグ
          "salespromotion": false,  // 販促キャンペーンフラグ
          "deliveryfeeoff": false,  // 配送料無料フラグ
          "secretsale": false,  // シークレット販売フラグ
          "reservation": false,  // 先行予約フラグ
          "used": false,  // 中古商品フラグ
          "coupon": false,  // クーポンフラグ
          "bulkdiscount": true  // まとめ割フラグ
        },
        "colorProducts": [
          {
            "productId": "WW5553671301_04",  // カラー別商品ID (ダミー色玉の場合はproduct.item_id)
            "colorId": "black",             // カラーID (ダミー色玉の場合は固定値「dummy」)
            "colorName": "ブラック",         // カラー名 (ダミー色玉の場合は固定値「ダミー」)
            "imageURL": "https://image.0101.co.jp/.../image.jpg",  // カラー別画像URL
            "detailUrl": "https://voi.0101.co.jp/.../details.html", // カラー別詳細URL
            "taxInclusivePrice": 14850,     // カラー別税込価格
            "oldPrice": 0,                  // カラー別元価格
            "discountRate": 0,              // カラー別割引率
            "flags": {
              "rearrival": false,           // カラー別再入荷フラグ
              "newarrival": false,          // カラー別新着フラグ
              "reservation": false          // カラー別先行予約フラグ
            }
          }
          // full=0の場合: 代表色のみ表示、full=1の場合: 全色表示 (null)
        ]
      }
    ],
    "nowPage": 1,  // 現在のページ番号
    "per": 60,  // 1ページあたりの件数
    "total": 847,  // 総商品件数
    "sortMenu": [
      {
        "name": "商品並び順",
        "sortByList": [
          {"id": "recommend", "name": "おすすめ順", "selected": true},
          {"id": "newarrival", "name": "新着順", "selected": false},
          {"id": "popular", "name": "人気順", "selected": false},
          {"id": "priceup", "name": "価格の安い順", "selected": false},
          {"id": "pricedown", "name": "価格の高い順", "selected": false},
          {"id": "offrate", "name": "割引率の高い順", "selected": false}
        ]
      }
    ],
    "colorDisplay": [
      "全色表示",  // index 0
      "代表色"     // index 1
    ],
    "showPrice": true
  }
}
```

### Menu API レスポンス詳細構造 (Swagger準拠)

```json
{
  "figure": [
    {
      "id": "1",              // 性別ID
      "name": "レディース",    // 性別名
      "count": 890,           // 該当商品数
      "isSelected": false,    // 選択状態
      "order": 1              // 表示順
    }
  ],
  "size": [
    {
      "id": "90001",         // サイズID
      "name": "フリー",       // サイズ名
      "count": 234,          // 該当商品数
      "isSelected": false,   // 選択状態
      "order": 1             // 表示順
    }
  ],
  "color": [
    {
      "id": "white",         // カラーID
      "name": "ホワイト",     // カラー名
      "count": 567,          // 該当商品数
      "isSelected": false,   // 選択状態
      "order": 1             // 表示順
    }
  ],
  "brand": [
    {
      "firstLetter": "ア",   // 頭文字(50音グループ)
      "brandList": [
        {
          "id": "30001",          // ブランドID
          "nameJp": "アーヴェヴェ", // ブランド名（日本語）
          "nameEn": "a.v.v",      // ブランド名（英語）
          "count": 123,           // 該当商品数
          "isSelected": false     // 選択状態
        }
      ]
    }
    // 以下、各50音グループが続く（ア, カ, サ, タ, ナ, ハ, マ, ヤ, ラ, ワ）
  ],
  "item": [
    {
      "id": "10015",            // 第1カテゴリ(fcd)ID
      "name": "アウター・ジャケット", // 第1カテゴリ名
      "isSelected": false,      // 選択状態
      "order": 1,               // 表示順
      "scdList": [
        {
          "id": "30162",          // 第2カテゴリ(scd)ID
          "name": "ニット・セーター", // 第2カテゴリ名
          "count": 123,           // 該当商品数
          "isSelected": false,    // 選択状態
          "order": 1              // 表示順
        }
      ]
    }
  ],
  "keyword": [
    {
      "groupId": "G0001",       // キーワードグループID
      "groupName": "素材・組成", // グループ名
      "keywordList": [
        {
          "keywordId": "A0166",     // キーワードID
          "keywordName": "コットン・綿", // キーワード名
          "count": 345,             // 該当商品数
          "isSelected": false       // 選択状態
        }
      ]
    }
  ],
  "price": {
    "bottom": 1000,    // 最低価格
    "top": 50000       // 最高価格
  },
  "saleOption": [
    {
      "id": "1",          // セールオプションID
      "name": "セール",    // セールオプション名
      "count": 123,       // 該当商品数
      "isSelected": false // 選択状態
    }
  ],
  "offrate": [
    {
      "id": "30",             // 割引率ID
      "name": "30%OFF以上",    // 割引率名
      "count": 234,           // 該当商品数
      "isSelected": false     // 選択状態
    }
  ],
  "arrivalOption": [
    {
      "id": "1",          // 新着オプションID
      "name": "新着",      // オプション名
      "count": 567,       // 該当商品数
      "isSelected": false // 選択状態
    },
    {
      "id": "2",
      "name": "再入荷",
      "count": 123,
      "isSelected": false
    }
  ],
  "gift": {
    "count": 789,       // ギフト対象商品数
    "isSelected": false // 選択状態
  },
  "coupon": {
    "count": 234,       // クーポン対象商品数
    "isSelected": false // 選択状態
  },
  "used": [
    {
      "id": "0",          // 新品・中古ID (0:新品, 1:中古)
      "name": "新品",      // 表示名
      "count": 456,       // 該当商品数
      "isSelected": false // 選択状態
    }
  ],
  "freeword": "ナイキ　メンズ",  // フリーワード検索内容(qパラメータの値)
  "exword": "トート",          // 除外キーワード検索内容(exqパラメータの値)
  "title": "アウター・ジャケット", // 検索結果のタイトル
  "fcdScdMap": [
    {
      "fcdId": "0001",    // scdに紐づくfcdId
      "scdId": "30001"    // scdのId
    }
  ],
  "popularKeywords": [
    {
      "param": "bcd",     // 絞り込みパラメータ名
      "value": {
        "id": "ア",           // 親のid値 (param=brandの場合はfirstLetter)
        "childId": "30143",   // 実際の絞り込み属性のid値
        "name": "アディダス"   // 絞り込み属性の名前
      },
      "label": "ブランド"   // 絞り込み項目表示名
    }
  ]
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