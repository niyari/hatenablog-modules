/**
 * はてなブログTOPページからの一覧に「戻る」リンクを付けるやつ
 */
// ==ClosureCompiler==
// @output_file_name index-prev-button.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog prev-button (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * 「( ・ω・)┌*━━━ Laser Beam!!!! https://www.youtube.com/watch?v=K54CYowOqxM
 */
(function () {
	function displayPrevBtn() {
		var target = document.getElementsByTagName("html")[0].dataset.blogsUriBase + '/?page=';
		if (location.href.indexOf(target) === 0) {
			$("<span></span>", {
				addClass: "pager-prev",
				on: {
					click: function (e) {
						history.back();
					}
				}
			}).append(
			$("<a>前のページ</a>", {
				href: "#_"
			})
			).prependTo(".pager-next");
		}
	}
	//DOM生成完了時にスタート
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			displayPrevBtn();
		}, false);
	} else {
		displayPrevBtn();
	}
})();
