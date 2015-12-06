/**
 * はてなブログのサイドバーにあるカテゴリー表示にサブカテゴリーを追加する
 */
// ==ClosureCompiler==
// @output_file_name hbsubcat.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog SubCategory (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * (・ω・) where to go? https://www.youtube.com/watch?v=nbeGeXgjh9Q
 */
(function () {
	var setting;
	var matchExp;
	var CSSfileURL = '//niyari.github.io/hatenablog-modules/css/hb-subcat.css';
	function mainFunc(que) {
		if (que instanceof Array === false) {
			return; //設定が無いのでカテゴリが作ることができない
		}
		for (var i = 0; i < que.length; i++) {
			switch (que[i][0]) {
				case 'setting':
					setting = que[i][1];
					break;
			}
		}
		if (typeof (setting.pattern) === 'undefined') {
			return; //パターン設定が無いのでカテゴリが作ることができない
		}
		/* 各種設定 */
		// TODO: 見通しが悪いので、いつかどうにかする
		console.log("//openSub");
		switch (setting.openSub) {
			case 'all':
				setting.openSub = 'ALLOPEN';
				break;
			case 'just':
				setting.openSub = 'JUST';
				break;
			default:
				setting.openSub = 'CLOSE';
				break;
		}
		console.log("    -> " + setting.openSub);
		console.log("//userCSS");
		switch (setting.userCSS) {
			case true:
				setting.userCSS = true;
				break;
			default:
				setting.userCSS = false;
				break;
		}
		console.log("    -> " + setting.userCSS);
		/* 各種設定 */

		matchExp = new RegExp("^" + setting.pattern + "(?:.+) \\(([0-9]+)\\)");

		if (!setting.userCSS) setupCSS(CSSfileURL);

		var target = document.querySelectorAll('.hatena-module-category .hatena-urllist');
		for (var i = 0; i < target.length; i++) {
			createSubCategory(target[i]);
		}
	}

	function createSubCategory(parentUl) {
		if (parentUl.dataset.categoryProcessed == "done") return;
		parentUl.dataset.categoryProcessed = "done";
		var target = parentUl.querySelectorAll('li');
		var categoryList = {};
		for (var i = 0; i < target.length; i++) {
			var found = target[i].innerText.match(matchExp);
			if (found !== null) {
				//console.log(found);
				if (typeof (categoryList[found[1]]) === 'undefined') {
					$(target[i]).before(''
						+ '<li class="htnpsne-subcategory js-category-parent js-category-' + found[1] + '">'
							+ '<div class="archive-module-button js-category-toggle" data-category-name="' + found[1] + '">'
								+ '<span class="js-category-parent-hide-button" data-category-name="' + found[1] + '">▼</span>'
								+ '<span class="js-category-parent-show-button" data-category-name="' + found[1] + '">▶</span>'
							+ '</div>'
							+ '<span class="js-category-parent-title js-category-' + found[1]
								+ '" data-parent-category-name="' + found[1] + '">' + found[1] + '</span>'
							+ '<ul class="js-category-child js-category-child-' + found[1] + '"></ul>'
						+ '</li>');
					var targetChild = parentUl.querySelector('ul .js-category-child-' + found[1]);
					eventListener(parentUl.querySelector('.js-category-toggle[data-category-name="' + found[1] + '"]'));
					categoryList[found[1]] = {count:0};
				}
				categoryList[found[1]].count += ~~found[2];
				targetChild.appendChild(target[i]);

			}
		}
		//親カテゴリの合計数を表示させるやつ
		for (var key in categoryList) {
			var target = parentUl.querySelector('span[data-parent-category-name="' + key + '"]');
			target.innerText = key + ' (' + categoryList[key].count + ')';
			//サブカテゴリの展開操作(初期表示)
			if (setting.openSub == 'ALLOPEN' || (setting.openSub == 'JUST' && categoryList[key].count == 1)) {
				target.parentElement.dataset.categoryDisplay = "block";
				target.parentElement.classList.add('js-category-child-show');
			}
		}


	}
	function eventListener(target) {
		target.addEventListener('click', function (e) {
			if (this.parentElement.dataset.categoryDisplay == "block") {
				this.parentElement.dataset.categoryDisplay = "none";
				this.parentElement.classList.remove('js-category-child-show');
			} else {
				this.parentElement.dataset.categoryDisplay = "block";
				this.parentElement.classList.add('js-category-child-show');
			}
		}, false);

	}
/*
 * CSSをリンクする
 */
	function setupCSS(url) {
		var elmSideMenuCSS = document.createElement("link");
		elmSideMenuCSS.href = url;
		elmSideMenuCSS.rel = "stylesheet";
		elmSideMenuCSS.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(elmSideMenuCSS);
	}
/*
 * DOM生成完了時にスタート
 */
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			mainFunc(Htnpsne.SubCategory.q);
		}, false);
	} else {
		mainFunc(Htnpsne.SubCategory.q);
	}
})();
