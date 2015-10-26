/**
 * よく分からないサイトからコピーされた時に道案内するやつ
 */
// ==ClosureCompiler==
// @output_file_name ph-protection.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve Proxy Hacking Protection. (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * 「( ・ω・)┌*━━━ Laser Beam!!!! https://www.youtube.com/watch?v=K54CYowOqxM
 */
(function () {
	var setting = {};
	function siteCheck() {
		console.log(setting);
		var pattern = setting.baseURI;
		if (pattern.indexOf(location.hostname) < 0) {
			insertTag(pattern);
		} else if (window != parent) {
			insertTag(pattern);
		} else {
			//console.log("正しいと思われます");
		}
	}
	function setupSiteCheck(que) {
		if (que instanceof Array === false) {
			var que = [];
			//que.push(['setting', {'baseURI':'http://psn.hatenablog.jp/'}]);
		}
		for (var i = 0; i < que.length; i++) {
			switch (que[i][0]) {
				case 'setting':
					setting = que[i][1];
					break;
			}
		}
		setting.ogURL = getOGP('og:url');
		if (!setting.baseURI && !setting.ogURL) {
			console.log('設定がありません');
			return;
		}
		if (!setting.baseURI && setting.ogURL) setting.baseURI = setting.ogURL;
		if (setting.uriScheme && setting.hostName) {
			if ((setting.uriScheme + '://' + setting.hostName) !== setting.baseURI) {
				setting.baseURI = setting.uriScheme + '://' + setting.hostName; // アドレス書き換え系の対策
			}
			// TODO: URL書き換え系の場合はcanonicalも変わっている可能性がある為、データを正してやる必要がある
		}
		siteCheck();
	}
	function getOGP(prop) {
		var metaTag = document.getElementsByTagName("meta");
		for (i = 0; i < metaTag.length; i++) if (metaTag[i].getAttribute("property") == prop) return metaTag[i].getAttribute("content")
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
		var targetURI = canonical.indexOf(pattern) === 0 ? canonical : pattern;
		var error_box = document.createElement("div");
		error_box.innerHTML = '<a href="' + targetURI + '" target="_top">'
			+ '<div class="error-box" style="position: fixed; top: 40px; left: 30px; font-size: 1.5em; z-index: 800000;'
			+ ' line-height: 1.1; color: #3A3A3A; padding: 0.8em; margin: 0.5em 0 1em; background-color: rgba(249, 234, 234, 0.85); border-left: 5px solid #E83731;">'
			+ 'このページはキャッシュされている可能性があります。<br>記事の最新版はこちらから</div></a>';
		document.getElementsByTagName("body").item(0).appendChild(error_box);

	}
	/*
     * DOM生成完了時にスタート
     */
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			setupSiteCheck(Htnpsne.SiteCheck.q);
		}, false);
	} else {
		setupSiteCheck(Htnpsne.SiteCheck.q);
	}
})();