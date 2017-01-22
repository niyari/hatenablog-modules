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
 * @preserve Htnpsne.API.ts v1.0.3 (c) 2017 Pocket Systems. | MIT | psn.hatenablog.jp
 * (「・ω・)「 Moment of the frame, in slow motion https://www.youtube.com/watch?v=HM63o4UlUPU
 */

namespace Htnpsne.API {
    "use strict";
    export const version: string = "1.0.3";
    let HeadTag: HTMLElement = document.getElementsByTagName("head")[0];
    let delayedFlg: any = { HatenaTime: false, GoogleAds: false };
    export let htmlTagData: DOMStringMap | Object = (() => {
        let dataset: DOMStringMap | Object = document.getElementsByTagName("html")[0].dataset;

        // フォールバック IE 10 以下
        if (typeof dataset === "undefined") {
            let attr: NamedNodeMap = document.getElementsByTagName("html")[0].attributes;
            dataset = {};
            for (let i: number = 0; i < attr.length; i++) {
                if (attr[i].name.indexOf("data-") === 0) {
                    let keyName: string = attr[i].name.slice(5).replace(/-([a-z])/g,
                        function (all: string, letter: string): string {
                            return letter.toUpperCase();
                        });
                    dataset[keyName] = attr[i].value;
                }
            }
        }

        return dataset;
    })();

    /**
     * CSS の読み込み (linkタグの作成)
     * @param url
     */
    export function setupCSS(url: string): void {
        var elmCssTag: HTMLLinkElement = document.createElement("link");
        elmCssTag.href = url;
        elmCssTag.rel = "stylesheet";
        elmCssTag.type = "text/css";
        HeadTag.appendChild(elmCssTag);
    }

    /**
     * Google Adsense のスクリプトを読み込み、利用可能にする (scriptタグの作成)
     */
    function setupGoogAds(): void {
        let a: HTMLScriptElement = document.createElement("script");
        a.async = true;
        a.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        let c: HTMLScriptElement = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(a, c);
        delayedFlg.GoogleAds = true;
    }

    /**
     * アルゴリズム Fisher-Yatesでシャッフルする
     * @param arr リスト
     * @param option_randFunction Math.random以外で乱数を生成したい場合
     */
    export function listShuffle(arr: any[], option_randFunction?: any): any[] {
        let randFunc: any = option_randFunction || Math.random;
        arr = arr.slice(); // arrを複製して新しい配列のみシャッフルする
        for (let i: number = arr.length - 1; 0 < i; i--) {
            let j: number = Math.floor(randFunc() * (i + 1)), temp: any = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    /**
     * 文字列をエスケープするやつ
     * @param a 文字列
     */
    export function escapeHtml(a: string): string {
        return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    };

    /**
     * (WIP) Google AdSense 用HTMLタグを生成する
     * @param AdsData
     * @param objectFlg
     */
    export function makeHtmlGoogAds(AdsData: any, objectFlg: boolean = false): any {
        // 必須項目のチェック data-ad-client
        if (typeof (AdsData.client) === "undefined" || AdsData.client === null || AdsData.client === "") {
            if (objectFlg) {
                let elmInsTag: HTMLElement = document.createElement("ins");
                return elmInsTag.setAttribute("data-ad-error", "error");
            } else {
                return;
            }
        }
        // 必須項目のチェック data-ad-slot
        if (typeof (AdsData.slot) === "undefined" || AdsData.slot == null || AdsData.slot === "") {
            if (objectFlg) {
                let elmInsTag: HTMLElement = document.createElement("ins");
                return elmInsTag.setAttribute("data-ad-error", "error");
            } else {
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
        if (typeof (AdsData.style) === "undefined" || AdsData.style === null) {
            AdsData.style = { display: "block" };
        }
        if (typeof (AdsData.format) === "undefined" || AdsData.format === null) {
            AdsData.format = "auto";
        }
        if (objectFlg) {
            var elmInsTag: HTMLElement = document.createElement("ins");
            elmInsTag.className = "adsbygoogle " + AdsData.className;
            elmInsTag.setAttribute("data-ad-client", AdsData.client);
            elmInsTag.setAttribute("data-ad-slot", AdsData.slot);
            elmInsTag.setAttribute("data-ad-format", AdsData.format);
            // elmInsTag.style = AdsData.style;
            return elmInsTag;
        } else {
            return ""
                + "<ins class=\"adsbygoogle " + AdsData.className + "\""
                + " style=\"" + AdsData.style + "\""
                + " data-ad-client=\"" + AdsData.client + "\""
                + " data-ad-slot=\"" + AdsData.slot + "\""
                + " data-ad-format=\"" + AdsData.format + "\"></ins>";
        }
    }

    /**
     * はてなブログ ユーザーアイコンのURLを取得する
     * @param username ユーザーID(英数字。省略時は自分自身「my」)
     * @param size アイコンサイズ(省略可)
     */
    export function hatenaProfileIconURL(username: string = "my", size?: number): string {
        // http://n.hatena.ne.jp/my/profile/image?size=16&type=icon
        // 一般的には
        // "http://cdn1.www.st-hatena.com/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
        // という呼び出し方をしているようです。TLSで取得したい場合は、
        // "https://www.hatena.ne.jp/users/" + username.substr( 0, 2 ) + "/" + username + "/profile.gif"
        // このように取得します。
        // はてなブログ内であれば、Hatena.User.getProfileIcon(userid) を利用すればHTMLタグとして取得できます。 2016/03/21
        if (size) {
            return "http://n.hatena.ne.jp/" + username + "/profile/image?type=icon" + "&size=" + size;
        } else {
            return "http://n.hatena.ne.jp/" + username + "/profile/image?type=icon";
        }
    }

    /**
     * はてなブログ カテゴリーが記事に設定されているかチェックする
     * @param categoryName カテゴリー名
     */
    export function hasCategory(categoryName: string = ""): boolean {
        // はてなブログでは カテゴリ名に空白(全半角)がある場合はハイフンに変わります。
        // "foo bar"→"foo-bar" "foo　bar"→"foo-bar"
        categoryName = categoryName.replace(/\s/g, "-");
        if (document.getElementsByTagName("html")[0].getAttribute("data-page") !== "entry" || categoryName === "") { return false; }
        return (document.getElementsByTagName("body")[0].className).split(" ").indexOf("category-" + categoryName) >= 0;
    }



}
