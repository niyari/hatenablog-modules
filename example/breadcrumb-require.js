/**
 * HatenaBlog Breadcrumb Ver2
 */
/*
(function(window, document, script, src, object, newElement,
		referenceElement) {
	window['Htnpsne'] = window['Htnpsne'] || {};
	Htnpsne[object] = Htnpsne[object]
	|| function() {
		(Htnpsne[object].q = Htnpsne[object].q || []).push(arguments)
	};
	newElement = document.createElement(script),
	referenceElement = document.getElementsByTagName(script)[0];
	newElement.async = 1;
	newElement.src = src;
	referenceElement.parentNode.insertBefore(newElement, referenceElement)
})(window, document, 'script', '//niyari.github.io/hatenablog-modules/breadcrumb.min.js', 'Breadcrumb');

Htnpsne.Breadcrumb('parentCategory', ["Category1","Category2","Category3",] );

*/

(function (H,T,N,p,s,n,e) { H.Htnpsne = H.Htnpsne || {}; Htnpsne[s] = Htnpsne[s] || function () { (Htnpsne[s].q = Htnpsne[s].q || []).push(arguments) }; n = T.createElement(N); e = T.getElementsByTagName(N)[0]; n.async = 1; n.src = p; e.parentNode.insertBefore(n, e) })(window, document, "script", "//niyari.github.io/hatenablog-modules/breadcrumb.min.js", "Breadcrumb");
Htnpsne.Breadcrumb('parentCategory', ["Category1", "Category2", "Category3",]);
