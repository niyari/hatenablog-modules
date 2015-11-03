/**
 * はてなブログのコメント内に道案内するやつ
 */
// ==ClosureCompiler==
// @output_file_name comment-box.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog CommentBox (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * 「( ・ω・)┌*━━━ Laser Beam!!!! https://www.youtube.com/watch?v=K54CYowOqxM
 */
(function () {
	function commentBox() {
		var target = 'js-comment-box';
		//コメント一覧のリンクを変更する
		$(".recent-comments").on("click", "a", function (e) {
			e.preventDefault();
			window.location.href = $(this).attr("href") + '#' + target;
		});

		//コメント欄にジャンプするか
		if (location.hash === '#' + target) {
			$(".comment-box ul.comment").attr("id", target); //お節介(無くても良い)
			//スクロールする
			$("html,body").animate({
				scrollTop: $(".comment-box ul.comment").offset().top
			}, {
				queue: false
			});
		}

	}
	/*
     * DOM生成完了時にスタート
     */
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			commentBox();
		}, false);
	} else {
		commentBox();
	}
})();
