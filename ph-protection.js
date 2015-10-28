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
	var setting = [];
	function siteCheck() {
		var settingData = '';
		for (i = 0; i < setting.length ; i++) {
			var pattern = setting[i].hostName;
			var target = location.hostname;
			if (window != parent) target = document.referrer.split('/')[2];
			if (pattern.indexOf(target) !== 0) {
				settingData = settingData === '' ? setting[i] : settingData;
			} else {
				settingData = '';
				break;
				//console.log("正しいと思われます");
			}
		}
		if (settingData) insertTag(settingData);
	}
	function setupSiteCheck(que) {
		if (que instanceof Array === false) {
			var que = [];
			//que.push(['setting', [{'uriScheme':'http','hostName':'psn.hatenablog.jp'}]]);
		}
		for (var i = 0; i < que.length; i++) {
			switch (que[i][0]) {
				case 'setting':
					setting = que[i][1];
					break;
			}
		}
		if (!setting[0].hostName) {
			console.log('設定がありません');
			return;
		}
		siteCheck();
	}
	function getOGP(prop) {
		var metaTag = document.getElementsByTagName("meta");
		for (i = 0; i < metaTag.length; i++)
			if (metaTag[i].getAttribute("property") == prop) return metaTag[i].getAttribute("content")
	}
	function getCanonical() {
		for (var linkTag = document.getElementsByTagName("link"), a = 0; a < linkTag.length; a++)
			if ("canonical" === linkTag[a].getAttribute("rel")) return linkTag[a].getAttribute("href")
	};
	function targetURI(settingData) {
		var canonical = getCanonical().split(settingData.hostName)[1];
		if (!canonical) canonical = getOGP('og:url').split(settingData.hostName)[1];
		if (!canonical) canonical = '';
		return settingData.uriScheme + '://' + settingData.hostName + canonical;
	}
	function insertTag(settingData) {
		var head_tag = document.createElement("meta");
		head_tag.name = "robots";
		head_tag.content = "noindex";
		document.getElementsByTagName("head")[0].appendChild(head_tag);
		var error_box = document.createElement("div");
		error_box.innerHTML = '<a href="' + targetURI(settingData) + '" target="_top">'
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