/// <reference path="./Htnpsne.d.ts" />
/**
 * Htnpsne.API.ts for HatenaBlog CommonAPI  MIT License
 */
// ==ClosureCompiler==
// @output_file_name Htnpsne.API.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve Htnpsne.API.ts v1.0.1 (c) 2016 Pocket Systems. | MIT | psn.hatenablog.jp
 * (「・ω・)「 Moment of the frame, in slow motion https://www.youtube.com/watch?v=HM63o4UlUPU
 */
window['Htnpsne'] = Htnpsne;// TODO var Htnpsne;
/**
 * @type {Object}
 * @const
 */
module Htnpsne.API {
    var HeadTag: HTMLElement = document.getElementsByTagName("head")[0];
    var delayedFlg: any = { HatenaTime: false, GoogleAds: false };
    var version: string = "1.0.1";
    export var htmlTagData: any = document.getElementsByTagName("html")[0].dataset;

    //CSSをリンクする
    export function setupCSS(url): void {
        var elmCssTag = document.createElement("link");
        elmCssTag.href = url;
        elmCssTag.rel = "stylesheet";
        elmCssTag.type = "text/css";
        HeadTag.appendChild(elmCssTag);
    }
    function setupGoogAds(): void {
        var a = document.createElement('script');
        a.async = true;
        a.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        var c = document.getElementsByTagName('script')[0];
        c.parentNode.insertBefore(a, c);
        delayedFlg.GoogleAds = true;
    }

    //Fisher-Yatesアルゴリズムでシャッフルする
    export function listShuffle(a) { var b, c, d; a = a.slice(); b = a.length; if (0 === b) return a; for (; --b;) c = Math.floor(Math.random() * (b + 1)), d = a[b], a[b] = a[c], a[c] = d; return a }
    //文字列をエスケープするやつ
    export function escapeHtml(a: string) { return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") };

    export function makeHtmlGoogAds(AdsData, objectFlg: boolean=false): any {
        //必須項目のチェック data-ad-client
        if (typeof (AdsData.client) == 'undefined' || AdsData.client == null || AdsData.client == '') {
            return;
        }
        //必須項目のチェック data-ad-slot
        if (typeof (AdsData.slot) == 'undefined' || AdsData.slot == null || AdsData.slot == '') {
            return;
        }
        //GoogAds追加スクリプトの読み込み
        if (!delayedFlg.GoogleAds) {
            setupGoogAds();
        }

        if (typeof (AdsData.className) == 'undefined' || AdsData.className == null) {
            AdsData.className = '';
        }
        if (typeof (AdsData.style) == 'undefined' || AdsData.style == null) {
            AdsData.style = { display: 'block' };
        }
        if (typeof (AdsData.format) == 'undefined' || AdsData.format == null) {
            AdsData.format = 'auto';
        }
        if (objectFlg) {
            var elmInsTag = document.createElement('ins');
            elmInsTag.className = 'adsbygoogle ' + AdsData.className;
            elmInsTag.setAttribute('data-ad-client', AdsData.client);
            elmInsTag.setAttribute('data-ad-slot', AdsData.slot);
            elmInsTag.setAttribute('data-ad-format', AdsData.format);
            //elmInsTag.style = AdsData.style;
            return elmInsTag;
        } else {
            return ''
                + '<ins class="adsbygoogle ' + AdsData.className + '"'
                + ' style="' + AdsData.style + '"'
                + ' data-ad-client="' + AdsData.client + '"'
                + ' data-ad-slot="' + AdsData.slot + '"'
                + ' data-ad-format="' + AdsData.format + '"></ins>';
        }
    }

    export function hatenaProfileIconURL(username: string = 'my', size?: number) {
        // http://n.hatena.ne.jp/my/profile/image?size=16&type=icon
        // 一般的には
        // "http://cdn1.www.st-hatena.com/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
        // という呼び出し方をしているようです。TLSで取得したい場合は、
        // "https://www.hatena.ne.jp/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
        // このように取得します。
        //はてなブログ内であれば、Hatena.User.getProfileIcon(userid) を利用すればHTMLタグとして取得できます。 2016/03/21
        if (size) {
            return 'http://n.hatena.ne.jp/' + username + '/profile/image?type=icon' + '&size=' + size;
        } else {
            return 'http://n.hatena.ne.jp/' + username + '/profile/image?type=icon';
        }
    }

    //カテゴリー有無のチェック
    export function hasCategory(categoryName: string = '') {
        if (document.getElementsByTagName('html')[0].getAttribute('data-page') != "entry" || categoryName === '') return false;
        return (document.getElementsByTagName('body')[0].className).split(" ").indexOf('category-' + categoryName) >= 0;
    }



}
