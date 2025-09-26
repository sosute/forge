# API実動作分析レポート

## 📋 分析概要

**目的**: 既存search APIの実際のレスポンス構造を複数パラメータパターンで検証し、マッピング表の正確性を確保  
**対象**: https://marui.search.zetacx.net/api/search  
**検証日時**: 2025-09-26  

## 🔍 検証実行パラメータパターン

### 1. カラー表示制御パラメータ (`full`)

#### `full=0` (代表色表示モード)
**リクエスト**: `?factor=freeword&q=adidas&full=0`  
**レスポンス構造**:
```json
{
  "searchContent": {
    "products": [
      {
        "productId": "CF0210888001",
        "colorProducts": [
          {
            "productId": "CF0210888001_01",
            "colorId": "brown",
            "colorName": "ブラウン",
            "imageURL": "...",
            "detailUrl": "...",
            "taxInclusivePrice": 15400,
            "flags": {"rearrival": false, "newarrival": false}
          }
        ]
      }
    ]
  }
}
```

**確認された構造**:
- ✅ `colorProducts`: **配列形式** - 各商品の代表色オブジェクトを含む
- ✅ カラーオブジェクト構造: `colorId`, `colorName`, `imageURL`, `detailUrl`, `taxInclusivePrice`, `flags` 含有

#### `full=1` (全色表示モード)  
**リクエスト**: `?factor=freeword&q=adidas&full=1`  
**レスポンス構造**:
```json
{
  "searchContent": {
    "products": [
      {
        "productId": "CF0210888001_01", // 注目: カラー別商品IDに変更
        "colorProducts": null            // 注目: null値確定
      }
    ]
  }
}
```

**確認された構造**:
- ✅ `colorProducts`: **null値** - 全商品で一貫してnull
- ✅ `productId`: カラー別商品ID (`_01`, `_02` 等のサフィックス付き)
- ✅ 全カラー情報は個別商品レコードで展開

### 2. ページング制御パラメータ

#### `page=2&per=5`
**リクエスト**: `?factor=freeword&q=adidas&page=2&per=5`  
**レスポンス構造**:
```json
{
  "searchContent": {
    "nowPage": 2,
    "per": 5,
    "total": 2824,
    "products": [/* 5件のみ */]
  }
}
```

**確認された構造**:
- ✅ `nowPage`: リクエストパラメータと一致 (2)
- ✅ `per`: リクエストパラメータと一致 (5) 
- ✅ `total`: フィルタ条件適用後の総件数 (2824)
- ✅ `products配列長`: per値と一致 (5件)

### 3. フィルタリングパラメータ

#### `color=brown` (カラーフィルタ)
**リクエスト**: `?factor=freeword&q=adidas&color=brown`  
**レスポンス構造**:
```json
{
  "searchContent": {
    "total": 50  // フィルタ適用後の件数
  }
}
```

**確認された構造**:
- ✅ `total`: フィルタ条件適用で大幅減少 (2824 → 50)
- ✅ フィルタ条件に合致する商品のみ返却

## 📊 重要な発見事項

### 1. colorProducts フィールドの完全な動作パターン

| パラメータ | colorProducts | productId形式 | 説明 |
|-----------|---------------|---------------|------|
| `full=0` | **配列** (代表色オブジェクト含有) | `CF0210888001` | 基本商品ID、代表色情報を配列で提供 |
| `full=1` | **null** | `CF0210888001_01` | カラー別商品ID、colorProducts無効化 |

### 2. 商品ID形式の変化

**`full=0`時**:
- 商品ID: `CF0210888001` (基本形式)
- カラー別ID: `colorProducts[].productId` で `CF0210888001_01` 形式

**`full=1`時**:  
- 商品ID: `CF0210888001_01` (カラー別形式)
- 各カラーバリエーションが個別商品として展開

### 3. レスポンス構造に影響するパラメータ確認

| パラメータ種別 | 影響するフィールド | 影響内容 |
|-------------|------------------|---------|
| **`full`** | `colorProducts`, `productId` | **構造完全変更**: 配列 ⇄ null, 基本ID ⇄ カラー別ID |
| **`page`, `per`** | `nowPage`, `per`, `products[]` | **ページング制御**: 配列範囲とメタ情報 |
| **フィルタ系** | `total`, `products[]` | **データフィルタ**: 該当商品のみ表示、件数変化 |

## 📋 マッピング分析表への影響

### 修正が必要な記載内容

**現在の記載** (不正確):
```markdown
| 全色表示（full=1時はcolorProducts=null） | colorProducts (全色) | [{"colorId": "brown", "colorName": "ブラウン"}, ...] |
```

**正確な記載** (修正後):
```markdown  
| 全色表示（full=1時はcolorProducts=null） | colorProducts | null |
```

### 追加すべき重要情報

1. **productId の動作変化**:
   - `full=0`: 基本商品ID (`CF0210888001`)
   - `full=1`: カラー別商品ID (`CF0210888001_01`)

2. **カラー情報の取得方法**:
   - `full=0`: `colorProducts[]` 配列から取得
   - `full=1`: 各商品レコードがカラー別になるため不要

## 🎯 VAISC統合への示唆

### 1. colorProducts フィールドの実装戦略

**VAISC側実装**:
```javascript
// full=0 相当: 代表色表示
response.products[].colorProducts = [
  {
    "colorId": product.attributes.color_id.text[0],
    "colorName": product.colorInfo.colors[0],
    // ... 他フィールド
  }
]

// full=1 相当: 全色表示  
response.products[].colorProducts = null
// 代わりに商品レコード自体をカラー別に展開
```

### 2. productId 変換戦略

**VAISC Product Schema**:
```javascript
// full=0: 基本商品ID
product.id = "CF0210888001"

// full=1: カラー別商品ID  
product.id = "CF0210888001_01"  // カラーサフィックス追加
```

### 3. レスポンス互換性の確保

**必須実装項目**:
- ✅ `full` パラメータによる colorProducts の null/配列切り替え
- ✅ `full` パラメータによる productId 形式変更
- ✅ ページング制御の完全再現
- ✅ フィルタ適用後の総件数計算

## 📝 検証完了項目

- ✅ colorProducts フィールドの動作確認完了
- ✅ ページングパラメータの影響確認完了  
- ✅ フィルタパラメータの影響確認完了
- ✅ レスポンス構造変化パターンの特定完了

## 📌 次のステップ

1. **マッピング分析表の修正**: colorProducts の正確な記載
2. **VAISC実装仕様**: productId変換ロジックの詳細設計
3. **追加検証**: 他のフィルタパラメータでの動作確認
4. **統合テスト**: VAISC統合エンドポイントでの再現性確認

---

**注意**: 本分析は実際のAPI動作を基にした実証的調査結果です。VAISC統合実装時はこの実動作データを最優先で参照してください。