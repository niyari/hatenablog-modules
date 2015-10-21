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
 * 「( ・ω・)┌*━━━ Laser Beam!!!! https://www.youtube.com/watch?v=K54CYowOqxM
 */
(function () {
	function siteCheck() {
		var pattern = document.getElementsByTagName("html")[0].dataset.blogsUriBase;
		if (pattern.indexOf(location.hostname) < 0) {
			insertTag(pattern);
		} else if (window != parent) {
			insertTag(pattern);
			//alert("正規サイトへ移動します。");
			//document.location = canonical.indexOf(pattern) === 0 ? canonical : pattern + "/search?q=" + encodeURIComponent(document.title);
		} else {
			//console.log("hatenablog");
		}
	}
	function insertTag(pattern) {
		var head_tag = document.createElement("meta");
		head_tag.name = "robots";
		head_tag.content = "noindex";
		document.getElementsByTagName("head")[0].appendChild(head_tag);
		var canonical = "";
		var links = document.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			if (links[i].getAttribute("rel") === "canonical") {
				canonical = links[i].getAttribute("href")
			}
		}
		var targetURI = canonical.indexOf(pattern) === 0 ? canonical : pattern + "/search?q=" + encodeURIComponent(document.title);
		var error_box = document.createElement("div");
		error_box.innerHTML = '<a href="' + targetURI + '" target="_top">'
			+ '<div class="error-box" style="position: fixed; top: 40px; left: 30px; font-size: 1.5em; z-index: 800000;">'
			+ 'このページはキャッシュされている可能性があります。<br>記事の最新版はこちらから</div></a>';
		document.getElementsByTagName("body").item(0).appendChild(error_box);

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