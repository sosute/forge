# HTML 品質課題一覧

このドキュメントでは、CMS コンテンツページで発生している主要な HTML 品質課題を整理しています。

問題を解決することで、以下の効果が期待できます：

- **ユーザビリティ向上**: すべてのユーザーの快適なサイト利用
- **SEO 効果向上**: 検索エンジンでの順位とクリック率の改善
- **コンプライアンス**: アクセシビリティ法令への準拠
- **保守性向上**: 標準的な HTML による長期的な保守性確保

## 📋 課題分類

| 分類                      | 概要                                     |
| ------------------------- | ---------------------------------------- |
| 🔴 **アクセシビリティ**   | 視覚障害者や高齢者のアクセスを妨げる問題 |
| 🟡 **SEO・メタタグ**      | 検索エンジン最適化に関する問題           |
| 🟠 **見出し構造**         | 文書構造の論理性に関する問題             |
| 🔵 **セマンティック構造** | HTML 要素の意味的な使用に関する問題      |
| 🟣 **レガシーコード**     | 古いコードや不要なタグの問題             |

---

## 🔴 アクセシビリティ課題

### 🖼️ A1. 画像の alt 属性欠落

<details>
<summary><strong>課題概要：</strong> alt属性が存在しない、または空文字の画像要素</summary>

```html
<!-- ❌ 問題のあるコード -->
<img src="/images/campaign-banner.jpg" alt="" />
<!-- 問題: キャンペーンバナー画像のalt属性が空文字 -->

<img src="/images/product-main.jpg" />
<!-- 問題: 商品画像にalt属性自体が存在しない -->

<img src="/images/brand-logo.png" alt="logo" />
<!-- 問題: alt属性が不適切（logoは画像の内容を説明していない） -->
```

```html
<!-- ✅ 修正されたコード -->
<img
  src="/images/campaign-banner.jpg"
  alt="年末セール最大50%オフキャンペーン"
/>
<img
  src="/images/product-main.jpg"
  alt="シャネル No.5 オードパルファム 100ml"
/>
<img src="/images/brand-logo.png" alt="阪急ビューティーオンライン ロゴ" />
```

**影響：** 視覚障害者がスクリーンリーダーで画像内容を理解できない。検索エンジンも画像内容を認識不可。

</details>

### 🔗 A2. a タグのボタン的利用

<details>
<summary><strong>課題概要：</strong> href="#"やjavascript:void(0)を使用したリンク要素</summary>

```html
<!-- ❌ 問題のあるコード -->
<a href="javascript:void(0);" onclick="addToCart()">カートに追加</a>
<!-- 問題: リンクではなくボタン機能なのにaタグを使用 -->

<a href="#" onclick="showModal()">詳細を見る</a>
<!-- 問題: href="#"でページ内遷移と混同される可能性 -->
```

```html
<!-- ✅ 修正されたコード -->
<button type="button" onclick="addToCart()">カートに追加</button>
<button type="button" onclick="showModal()">詳細を見る</button>
```

**影響：** キーボードナビゲーションやスクリーンリーダーでの操作性が低下。a タグは本来ページ遷移用。

</details>

### 📝 A3. フォーム要素のラベル不足

<details>
<summary><strong>課題概要：</strong> アクセシブルなラベルが設定されていないフォーム要素</summary>

```html
<!-- ❌ 問題のあるコード -->
<input type="text" placeholder="お名前を入力" />
<!-- 問題: placeholder のみでlabel要素やaria-labelが不足 -->

<select>
  <option>選択してください</option>
  <option>男性</option>
  <option>女性</option>
</select>
<!-- 問題: 何を選択するのかが不明確 -->
```

```html
<!-- ✅ 修正されたコード -->
<label for="name">お名前</label>
<input type="text" id="name" placeholder="お名前を入力" />

<label for="gender">性別</label>
<select id="gender">
  <option>選択してください</option>
  <option>男性</option>
  <option>女性</option>
</select>
```

**影響：** スクリーンリーダーユーザーがフォームの目的を理解できず、入力困難。

</details>

### 🎯 A4. ARIA 属性の不適切な使用

<details>
<summary><strong>課題概要：</strong> role属性に対応した必須ARIA属性の欠落</summary>

```html
<!-- ❌ 問題のあるコード -->
<div role="button">クリック</div>
<!-- 問題: ボタンロールなのにaria-labelやtextContentが不足 -->

<div role="tab">タブ1</div>
<!-- 問題: タブロールなのにaria-selectedが不足 -->
```

```html
<!-- ✅ 修正されたコード -->
<div role="button" aria-label="商品をカートに追加">クリック</div>
<div role="tab" aria-selected="true">タブ1</div>
```

**影響：** スクリーンリーダーが要素の状態や機能を正しく伝達できない。

</details>

---

## 🟡 SEO・メタタグ課題

### 📄 S1. ページタイトルの問題

<details>
<summary><strong>課題概要：</strong> タイトルの欠落または不適切な長さ（推奨：30-60文字）</summary>

```html
<!-- ❌ 問題のあるコード -->
<title>ホーム</title>
<!-- 問題: タイトルが短すぎる（3文字） -->

<title>
  阪急ビューティーオンライン 化粧品・美容・コスメの通販サイト
  スキンケアからメイクアップまで豊富な品揃え
</title>
<!-- 問題: タイトルが長すぎる（78文字） -->
```

```html
<!-- ✅ 修正されたコード -->
<title>阪急ビューティーオンライン | 化粧品・美容の通販サイト</title>
<!-- 修正: 適切な長さ（35文字）でブランド名と内容を含む -->
```

**影響：** 検索結果での表示が不適切になり、クリック率と SEO 効果が低下。

</details>

### 📝 S2. メタディスクリプションの問題

<details>
<summary><strong>課題概要：</strong> メタディスクリプションの欠落、重複、不適切な長さ</summary>

```html
<!-- ❌ 問題のあるコード -->
<!-- メタディスクリプションが存在しない -->

<!-- または重複 -->
<meta name="description" content="化粧品・美容の総合サイト" />
<meta name="description" content="阪急ビューティーオンライン" />
```

```html
<!-- ✅ 修正されたコード -->
<meta
  name="description"
  content="阪急ビューティーオンラインは化粧品・美容・コスメの通販サイト。スキンケア、メイクアップ、フレグランスなど人気ブランドを豊富に取り揃え、安心してお買い物いただけます。"
/>
```

**影響：** 検索結果のスニペット表示が不適切になり、クリック率が低下。

</details>

### 📱 S3. Open Graph タグの欠落

<details>
<summary><strong>課題概要：</strong> SNS共有用のOpen Graphタグの欠落</summary>

```html
<!-- ❌ 問題のあるコード -->
<head>
  <title>阪急ビューティーオンライン</title>
  <!-- Open Graphタグが一切存在しない -->
</head>
```

```html
<!-- ✅ 修正されたコード -->
<head>
  <title>阪急ビューティーオンライン</title>
  <meta property="og:title" content="阪急ビューティーオンライン" />
  <meta property="og:description" content="化粧品・美容・コスメの通販サイト" />
  <meta property="og:image" content="https://example.com/og-image.jpg" />
  <meta property="og:url" content="https://voi.0101.co.jp/" />
</head>
```

**影響：** SNS 共有時に適切な情報が表示されず、エンゲージメントが低下。

</details>

---

## 🟠 見出し構造課題

### 🏷️ H1. H1 タグの欠落

<details>
<summary><strong>課題概要：</strong> ページにH1タグが存在しない</summary>

```html
<!-- ❌ 問題のあるコード -->
<h2 class="title">阪急ビューティーオンライン</h2>
<!-- 問題: H1なしでH2から始まる見出し構造 -->

<h3>新着アイテム</h3>
<!-- 問題: H1→H2の階層を飛ばしてH3が出現 -->
```

```html
<!-- ✅ 修正されたコード -->
<h1>阪急ビューティーオンライン</h1>
<h2>新着アイテム</h2>
<h3>スキンケア</h3>
```

**影響：** ページの主要タイトルが不明確になり、SEO 効果の低下とスクリーンリーダーでの文書構造理解が困難。

</details>

### 📊 H2. 見出しタグの階層スキップ

<details>
<summary><strong>課題概要：</strong> 見出しレベルの論理的な階層をスキップする構造</summary>

```html
<!-- ❌ 問題のあるコード -->
<h1>ホーム</h1>
<h3>商品カテゴリ</h3>
<!-- 問題: H1からH3に直接ジャンプ（H2をスキップ） -->

<h4>スキンケア</h4>
<h4>メイク</h4>
<h6>リップ</h6>
<!-- 問題: H4からH6に直接ジャンプ（H5をスキップ） -->
```

```html
<!-- ✅ 修正されたコード -->
<h1>ホーム</h1>
<h2>商品カテゴリ</h2>
<h3>スキンケア</h3>
<h3>メイク</h3>
<h4>リップ</h4>
```

**影響：** 論理的な文書構造が破綻し、スクリーンリーダーユーザーが内容の階層を正しく理解できない。

</details>

---

## 🔵 セマンティック構造課題

### 🗓️ M1. 日付情報の非セマンティック表現

<details>
<summary><strong>課題概要：</strong> DIVタグで日付情報を表現している要素</summary>

```html
<!-- ❌ 問題のあるコード -->
<div class="news-date">2024年12月15日</div>
<!-- 問題: 日付情報がdivタグで表現され、機械読み取り不可 -->

<div class="event-period">12月29日-1月3日 休業</div>
<!-- 問題: 期間情報がテキストのみで構造化データとして認識されない -->
```

```html
<!-- ✅ 修正されたコード -->
<time datetime="2024-12-15">2024年12月15日</time>
<!-- 修正: time要素で機械読み取り可能な日付形式 -->

<time datetime="2024-12-29/2025-01-03">12月29日-1月3日</time> 休業
<!-- 修正: 期間をtime要素でマークアップ -->
```

**影響：** 検索エンジンが日付・期間を正しく認識できず、イベント情報やニュースの時系列整理に支障。

</details>

### 📋 M2. レイアウト目的での table タグ使用

<details>
<summary><strong>課題概要：</strong> データ表以外でのtable要素の使用</summary>

```html
<!-- ❌ 問題のあるコード -->
<table border="0" cellpadding="10" cellspacing="0">
  <!-- 問題: tableはデータ表用の要素、レイアウト目的での使用は不適切 -->
  <tr>
    <td width="300">
      <img src="product-banner.jpg" alt="" />
    </td>
    <td valign="top">
      <h3>商品特集</h3>
      <p>最新商品のご紹介です。</p>
    </td>
  </tr>
</table>
```

```html
<!-- ✅ 修正されたコード -->
<div class="content-layout">
  <section class="banner-section">
    <img src="product-banner.jpg" alt="商品特集バナー" />
  </section>
  <main class="main-content">
    <h2>商品特集</h2>
    <p>最新商品のご紹介です。</p>
  </main>
</div>
```

**影響：** スクリーンリーダーが「データの表」と誤認し、レスポンシブ対応も困難。

</details>

---

## 🟣 レガシーコード課題

### 🗑️ L1. 古いトラッキングコードと不要タグ

<details>
<summary><strong>課題概要：</strong> サポート終了した古いコードや不要なタグ</summary>

```html
<!-- ❌ 問題のあるコード -->
<!-- 古いGoogle Analytics（UA）コード -->
<script>
  ga('create', 'UA-XXXXXXX-1', 'auto');
</script>
<!-- 問題: 2023年7月にサポート終了 -->

<!-- 不要なnoscriptタグ -->
<noscript><!-- 空のコメントのみ --></noscript>
<!-- 問題: 内容が空でページサイズを無駄に増加 -->

<!-- 古いROBOTSディレクティブ -->
<meta name="robots" content="NOODP,NOYDIR" />
<!-- 問題: サポート終了したディレクティブ -->

<!-- 廃止されたmeta keywords -->
<meta name="keywords" content="化粧品,美容,コスメ" />
<!-- 問題: SEO効果なし、削除推奨 -->
```

```html
<!-- ✅ 修正されたコード -->
<!-- Google Analytics 4（GA4）への移行 -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- 不要なタグは削除 -->
<!-- noscript、meta keywords、古いrobotsディレクティブを削除 -->

<!-- 現在有効なrobotsディレクティブ -->
<meta name="robots" content="index,follow" />
```

**影響：** 古いコードは正常に動作せず、不要なタグはページ読み込み速度に悪影響。

</details>
