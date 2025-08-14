## Head タグに意味をなさないコードがあるので削除

該当ファイル：/apps/voi/components/sp/page/sppage/head.html

befor

```
    <meta charset="utf-8">

    <title>${properties.pageTitle} ${properties.sitename || 'マルイ'}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="keywords" content="${properties.metaKeyword}"/>
    <meta name="description" content="${properties.metaDescription}"/>
    <meta name="author" content="MARUI CO.,LTD.">
    <meta name="copyright" content="COPYRIGHT ALL RIGHTS RESERVED. MARUI CO.,LTD.">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <sly data-sly-use.tempUtils="com.marui.voi.core.models.TemplateUtils"/>
    <link data-sly-test="${tempUtils.canonicalURL}" rel="canonical" href="${tempUtils.canonicalURL}"/>

    <sly data-sly-test="${properties.enableNoCacheTag}">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-conTRol" content="no-cache">
    </sly>
    <meta http-equiv="expires" content="0">
    <meta name="ROBOTS" content="NOODP">
    <meta name="ROBOTS" content="NOYDIR">

    <sly data-sly-include="staticcss.html"/>
    <sly data-sly-list="${tempUtils.cssPaths}">
    <link rel="stylesheet" type="text/css" media="all" href="${item.path}"/>
    </sly>

  <sly data-sly-include="staticjs.html"/>
    <sly data-sly-list="${tempUtils.jsPaths}">
    <script type="text/javascript" src="${item.path}"></script>
    </sly>

    <meta property="og:title" content="${properties.ogTitle || properties.jcr:title}"/>
    <meta property="og:description" content="${properties.ogDescription || properties.metaDescription}"/>
    <meta property="og:type" content="${properties.ogType || 'article'}"/>
    <meta property="og:url" content="${tempUtils.ogUrl || tempUtils.productionURL}"/>
    <meta property="og:image" data-sly-test="${properties.ogImage}" content="${properties.ogImage}"/>
    <meta property="og:site_name" content="${properties.ogSiteName || properties.sitename || 'マルイ'}"/>
    <meta property="og:locale" content="${tempUtils.locale}"/>

    ${tempUtils.headerFreeHTML @ context='unsafe'}

    <meta name="article.published" content="${tempUtils.publishedDate}">
    <meta name="article.closed" content="${tempUtils.closedDate}">
```

after

```
    <meta charset="utf-8">
    <title>${properties.pageTitle} ${properties.sitename || 'マルイ'}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="description" content="${properties.metaDescription}"/>
    <meta name="author" content="MARUI CO.,LTD.">
    <meta name="copyright" content="COPYRIGHT ALL RIGHTS RESERVED. MARUI CO.,LTD.">
    <link rel="apple-touch-icon" href="/voi/apple-touch-icon.png" />
    <sly data-sly-use.tempUtils="com.marui.voi.core.models.TemplateUtils"/>
    <link data-sly-test="${tempUtils.canonicalURL}" rel="canonical" href="${tempUtils.canonicalURL}"/>

    <sly data-sly-test="${properties.enableNoCacheTag}">
    </sly>
    <sly data-sly-include="staticcss.html"/>
    <sly data-sly-list="${tempUtils.cssPaths}">
    <link rel="stylesheet" type="text/css" media="all" href="${item.path}"/>
    </sly>

  <sly data-sly-include="staticjs.html"/>
    <sly data-sly-list="${tempUtils.jsPaths}">
    <script type="text/javascript" src="${item.path}"></script>
    </sly>

    <meta property="og:title" content="${properties.ogTitle || properties.jcr:title}"/>
    <meta property="og:description" content="${properties.ogDescription || properties.metaDescription}"/>
    <meta property="og:type" content="${properties.ogType || 'article'}"/>
    <meta property="og:url" content="${tempUtils.ogUrl || tempUtils.productionURL}"/>
    <meta property="og:image" data-sly-test="${properties.ogImage}" content="${properties.ogImage}"/>
    <meta property="og:site_name" content="${properties.ogSiteName || properties.sitename || 'マルイ'}"/>
    <meta property="og:locale" content="${tempUtils.locale}"/>

    ${tempUtils.headerFreeHTML @ context='unsafe'}

    <meta name="article.published" content="${tempUtils.publishedDate}">
    <meta name="article.closed" content="${tempUtils.closedDate}">
```

## 旧 UA の設定削除

ua-1021509-2 削除

```
  <script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
  </script><script src="./responsive-footer_files/ga.js.ダウンロード" type="text/javascript"></script>
  <script type="text/javascript">
    try {
      var pageTracker = _gat._getTracker("UA-1021509-2");
      pageTracker._setDomainName(".0101.co.jp");
      pageTracker._trackPageview();
    } catch (err) { }
  </script>
```

## 旧 GTM の設定削除

https://voi.0101.co.jp/voi/content/01/sp/media/kakkoii/skincare/sophisticated.html
に GTM-MJ66RZD が読み込まれている

ーーー
旧：GTM-MJ66RZD
を
新：GTM-PCQPR3Z4
に張替え

## Adobe タグマネージャ削除

サイトカタリスト用のコードと思われる
利用されていないので削除で良さそう
`<script src="/voi/js/sitecatalyst/s_code.js"></script>`

GTM タグ用に利用しているが、不要そうな記述があるので削除
コメントアウト部分 → 動いていないので削除で良さそう
スマホ用 TOP へ戻るボタン →UA 出し分けしているので削除でよさそう
Sprocket タグ → 現在は未利用とのこと
MACROMILL→ 現在は未利用とのこと
`<script src="/voi/js/sitecatalyst/s_code_signal.js"></script>`

## nocode は不要

```
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="https://www.googleadservices.com/pagead/conversion/974281862/?label=fgO0CPr0vQIQhrnJ0AM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
```

## GA で受け取っている？

```
<script type="text/javascript">
// sendSiteCatalystTimerCount（カウンター用）
var sendSiteCatalystTimerCount = 0;

// 500ミリ秒単位でs_gi関数の存在をチェックし、存在した場合にsendSiteCatalyst関数を実行する関数
var sendSiteCatalystTimer = function() {
    if (typeof s_gi === "function") {
        setTimeout(function(){
            sendSiteCatalyst();
        },500);
    } else if (sendSiteCatalystTimerCount < 20) {
        sendSiteCatalystTimerCount ++;
        setTimeout(function(){
            sendSiteCatalystTimer();
        },500);
    }
};

function mcLoadEvent(event) {
  if (window.addEventListener) {
    window.addEventListener('load', event, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', event);
  }
}
</script>
```
