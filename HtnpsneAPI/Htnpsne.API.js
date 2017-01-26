/*
 * Htnpsne.API.ts for HatenaBlog CommonAPI (c) 2016,2017 Pocket Systems.
 * Released under the MIT license
 */
// ==ClosureCompiler==
// @output_file_name Htnpsne.API.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve Htnpsne.API.ts v1.0.4 (c) 2017 Pocket Systems. | MIT | psn.hatenablog.jp
 * (「・ω・)「 Moment of the frame, in slow motion https://www.youtube.com/watch?v=HM63o4UlUPU
 */
var Htnpsne;
(function (Htnpsne) {
    var API;
    (function (API) {
        "use strict";
        API.version = "1.0.4";
        var HeadTag = document.getElementsByTagName("head")[0];
        var delayedFlg = { HatenaTime: false, GoogleAds: false };
        /**
         * HTMLに置かれているデータ属性へのショートカット
         */
        API.htmlTagData = document.getElementsByTagName("html")[0].dataset;
        if (typeof API.htmlTagData === "undefined") {
            console.log("if you'd like to use many of our latest and greatest features,"
                + " please upgrade to a modern, fully supported browser. :)");
        }
        /**
         * CSS の読み込み (linkタグの作成)
         * @param url
         */
        function setupCSS(url) {
            var elmCssTag = document.createElement("link");
            elmCssTag.href = url;
            elmCssTag.rel = "stylesheet";
            elmCssTag.type = "text/css";
            HeadTag.appendChild(elmCssTag);
        }
        API.setupCSS = setupCSS;
        /**
         * Google Adsense のスクリプトを読み込み、利用可能にする (scriptタグの作成)
         */
        function setupGoogAds() {
            var a = document.createElement("script");
            a.async = true;
            a.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
            var c = document.getElementsByTagName("script")[0];
            c.parentNode.insertBefore(a, c);
            delayedFlg.GoogleAds = true;
        }
        /**
         * アルゴリズム Fisher-Yatesでシャッフルする
         * @param arr リスト
         * @param option_randFunction Math.random以外で乱数を生成したい場合
         */
        function listShuffle(arr, option_randFunction) {
            var randFunc = option_randFunction || Math.random;
            arr = arr.slice(); // arrを複製して新しい配列のみシャッフルする
            for (var i = arr.length - 1; 0 < i; i--) {
                var j = Math.floor(randFunc() * (i + 1)), temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        }
        API.listShuffle = listShuffle;
        /**
         * 文字列をエスケープするやつ
         * @param a 文字列
         */
        function escapeHtml(a) {
            return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }
        API.escapeHtml = escapeHtml;
        ;
        function makeHtmlGoogAds(AdsData, objectFlg) {
            if (objectFlg === void 0) { objectFlg = true; }
            // 必須項目のチェック data-ad-client
            if (typeof (AdsData.client) === "undefined" || AdsData.client === null || AdsData.client === "") {
                if (objectFlg) {
                    var elmInsTag_1 = document.createElement("ins");
                    return elmInsTag_1.setAttribute("data-ad-error", "error");
                }
                else {
                    return;
                }
            }
            // 必須項目のチェック data-ad-slot
            if (typeof (AdsData.slot) === "undefined" || AdsData.slot == null || AdsData.slot === "") {
                if (objectFlg) {
                    var elmInsTag_2 = document.createElement("ins");
                    return elmInsTag_2.setAttribute("data-ad-error", "error");
                }
                else {
                    return;
                }
            }
            // googAds追加スクリプトの読み込み
            if (!delayedFlg.GoogleAds) {
                setupGoogAds();
            }
            if (typeof (AdsData.className) === "undefined" || AdsData.className === null) {
                AdsData.className = "";
            }
            if (typeof (AdsData.style) === "undefined" || AdsData.style === null || AdsData.style === {}) {
                AdsData.style.display = "block";
            }
            if (typeof (AdsData.format) === "undefined" || AdsData.format === null) {
                AdsData.format = "auto";
            }
            var elmInsTag = document.createElement("ins");
            elmInsTag.className = "adsbygoogle " + AdsData.className;
            elmInsTag.setAttribute("data-ad-client", AdsData.client);
            elmInsTag.setAttribute("data-ad-slot", AdsData.slot);
            elmInsTag.setAttribute("data-ad-format", AdsData.format);
            Object.keys(AdsData.style).map(function (key) { return elmInsTag.style[key] = AdsData.style[key]; });
            if (objectFlg === false) {
                return elmInsTag.outerHTML;
            }
            return elmInsTag;
        }
        API.makeHtmlGoogAds = makeHtmlGoogAds;
        /**
         * はてなブログ ユーザーアイコンのURLを取得する
         * @param username ユーザーID(英数字。省略時は自分自身「my」)
         * @param size アイコンサイズ(省略可)
         */
        function hatenaProfileIconURL(username, size) {
            if (username === void 0) { username = "my"; }
            // http://n.hatena.ne.jp/my/profile/image?size=16&type=icon
            // 一般的には
            // "http://cdn1.www.st-hatena.com/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
            // という呼び出し方をしているようです。TLSで取得したい場合は、
            // "https://www.hatena.ne.jp/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
            // このように取得します。
            // はてなブログ内であれば、Hatena.User.getProfileIcon(userid) を利用すればHTMLタグとして取得できます。 2016/03/21
            if (size) {
                return "http://n.hatena.ne.jp/" + username + "/profile/image?type=icon" + "&size=" + size;
            }
            else {
                return "http://n.hatena.ne.jp/" + username + "/profile/image?type=icon";
            }
        }
        API.hatenaProfileIconURL = hatenaProfileIconURL;
        /**
         * はてなブログ カテゴリーが記事に設定されているかチェックする
         * @param categoryName カテゴリー名
         */
        function hasCategory(categoryName) {
            if (categoryName === void 0) { categoryName = ""; }
            // はてなブログでは カテゴリ名に空白(全半角)がある場合はハイフンに変わります。
            // "foo bar"→"foo-bar" "foo　bar"→"foo-bar"
            categoryName = categoryName.replace(/\s/g, "-");
            if (document.getElementsByTagName("html")[0].getAttribute("data-page") !== "entry" || categoryName === "") {
                return false;
            }
            return (document.getElementsByTagName("body")[0].className).split(" ").indexOf("category-" + categoryName) >= 0;
        }
        API.hasCategory = hasCategory;
    })(API = Htnpsne.API || (Htnpsne.API = {}));
})(Htnpsne || (Htnpsne = {}));
