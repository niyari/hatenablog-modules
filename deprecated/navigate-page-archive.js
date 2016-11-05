/**
 * navigate-page-archive.js
 * Released under the MIT license
 * ! WORNING ! This shouldn't be used for a visitor. :(
 */
// ==ClosureCompiler==
// @output_file_name navigate-page-archive.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve navigate-page-archive.js v1.0.0 (c) 2016 Pocket Systems. | MIT | psn.hatenablog.jp
 * ! WORNING ! This shouldn't be used for a visitor. :(
 * (「・ω・)「 Moment of the frame, in slow motion https://www.youtube.com/watch?v=HM63o4UlUPU
 */
(function () {
	var blogHtml = document.getElementsByTagName('html')[0], matchExp;
	if (blogHtml.getAttribute('data-device') == "touch") return;
	if (blogHtml.getAttribute('data-page') == "index") {
		matchExp = new RegExp(blogHtml.getAttribute('data-blogs-uri-base') + "\/$");
		if (matchExp.test(location.href)) {
			location.href = blogHtml.getAttribute('data-blogs-uri-base') + '/archive';
		}
	} else if (blogHtml.getAttribute('data-page') == "archive") {
		matchExp = new RegExp(blogHtml.getAttribute('data-blogs-uri-base') + "\/archive$");
		if (matchExp.test(location.href)) {
			document.title = blogHtml.getAttribute('data-blog-name');
		}
	}
})();
