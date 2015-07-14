/**
 * よく分からないサイトからはてなブログのエントリーがコピーされた時に道案内するやつ
 */
// ==ClosureCompiler==
// @output_file_name site-checker.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog Site Checker (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * (「・ω・)／ Alright, let's conquer the world! Da! https://www.youtube.com/watch?v=jcIOg_m-bp4
 */
(function () {
    function siteCheck() {
        var pattern = document.getElementsByTagName("html")[0].dataset.blogsUriBase;
        if (pattern.indexOf(location.hostname) < 0)
        { 
            console.log("?");
            var head_tag = document.createElement("meta");
            head_tag.name = "robots";
            head_tag.content = "noindex";
            document.getElementsByTagName("head")[0].appendChild(head_tag);
            alert("正規サイトへ移動します。");
            var canonical = "";
            var links = document.getElementsByTagName("link");
            for (var i = 0; i < links.length; i++) {
                if (links[i].getAttribute("rel") === "canonical") {
                    canonical = links[i].getAttribute("href")
                }
            }
            if (canonical.indexOf(pattern) === 0) {
                //おそらく正常なURI
                document.location = canonical;
            } else {
                //とりあえず、はてブロの検索へ投げる
                document.location = pattern + "/search?q=" + encodeURIComponent(document.title);
            }
        }else{
            console.log("hatenablog");
        }
    }
    /*
     * DOM生成完了時にスタート
     */
    if (document.readyState == "uninitialized" || document.readyState == "loading") {
        window.addEventListener("DOMContentLoaded", function () {
            siteCheck();
        }, false);
    } else {
        siteCheck();
    }
})();