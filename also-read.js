/**
 * はてなブログに関連エントリを追加する
 * HatenaBlog Also read (c) 2015,2016 Pocket Systems. http://psn.hatenablog.jp/entry/also-read
 * Released under the MIT license
 */
// ==ClosureCompiler==
// @output_file_name also-read.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog Also read (c) 2016 Pocket Systems. | MIT license | psn.hatenablog.jp/entry/also-read
 * (・ω・) where to go? https://www.youtube.com/watch?v=nbeGeXgjh9Q
 */

(function () {
	'use strict';
	if (typeof (Htnpsne) == 'undefined') Htnpsne = {};
	if (typeof (Htnpsne.API) == 'undefined') Htnpsne.API = {};
	Htnpsne.API.htmlTagData = document.getElementsByTagName("html")[0].dataset;
		//:TODO IE10未満(VistaのIE9など)を切り捨てた共通APIを用意する。
})();

(function () {
	'use strict';
	var blogsUriBase = document.getElementsByTagName("html")[0].dataset.blogsUriBase;
	var blogBase = document.getElementsByTagName("html")[0].dataset.blog;
	var categoryPath = '/archive/category/';
	var rssPath = '/rss/category/';
	var loadCSS = true;
	var categoryList = [];
	var feedlyURL = 'http://cloud.feedly.com/#subscription%2Ffeed%2F';
	var externalCSS = '//niyari.github.io/hatenablog-modules/css/also-read.css';

	//カテゴリリスト取得
	function getCategoryList() {
		var list = [];
		//TODO: カテゴリの取得はbodyタグのclassからも取得できそう
		//TODO: 不要データも含まれるが、エントリーページかどうかも取得できる(page-entry)
		//TODO: "body.page-entry div.categories a" のみで良いかもしれない/スマホ版の「記事下のカテゴリ表示」に対応
		var selector = "body.page-entry div.entry-categories a";
		if (document.getElementsByTagName("html")[0].dataset.device == "touch") {
			selector = "body.page-entry div.categories a";
		}
		var categoryList = document.querySelectorAll(selector);

		for (var i = 0; i < categoryList.length; i++) {
			var listStr = categoryList[i].href.split(blogBase + categoryPath)[1];
			if (typeof (listStr) !== 'undefined') list.push(listStr);
		}
		return list;
	}

	//RSS受信
	function getRSS(targetID, url) {
		var list = [];
		$.ajax({
			dataType: 'xml',
			url: url
			//url: './sandbox.xml'
		}).done(function (data, status, xhr) {
			//RSSリスト整形
			$(data).find("item").each(function () {
				if (/^\/entry/.test(location.pathname) == false || location.origin + location.pathname != $(this).find('link').text()) {
					// /^\/entry/.test(location.pathname) は、記事ページではない場合の計算コストを考慮する為に書いた(要検証)
					list.push({
						"title": $(this).find('title').text(),
						"link": $(this).find('link').text()
					});
				}
			});
			insertEntryList(targetID, list);
		}).fail(function (xhr, status, error) {
			// 通信失敗
			insertEntryList(targetID, [{
				"title": '(取得できませんでした。再読み込みを行ってください)',
				"link": blogsUriBase
			}]);
		});
	}

	//JSONP(はてなブックマーク)受信
	function getHatebu(targetID, url) {
		var list = [];
		$.ajax({
			dataType: 'jsonp',
			url: 'http://b.hatena.ne.jp/entrylist/json',
			data: {
				"sort": "count",
				"url": url
			}
		}).done(function (data, status, xhr) {
			for (var i = 0; i < data.length; i++) {
				if (/\/entry\//.test(data[i].link) == true && //エントリーページのみ(簡易判定)
					location.origin + location.pathname != data[i].link) {
					list.push({
						"title": data[i].title,
						"count": data[i].count,
						"link": data[i].link
					});
				} else {
					console.log("対象のページを除外しました。(B!)");
				}
			}
			insertEntryList(targetID, list);
		}).fail(function (xhr, status, error) {
			// 通信失敗
			insertEntryList(targetID, [{
				"title": '(取得できませんでした。再読み込みを行ってください)',
				"link": blogsUriBase
			}]);
		});
	}

	//初期処理
	function setupModule() {
		categoryList = getCategoryList();
		var target = document.querySelectorAll('.js-htnpsne-awasete-module');

		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.userCss == "true") loadCSS = false;

			var mode = target[i].dataset.mode;
			//カテゴリーが設定されていない事がある　ランダムでも良いかもしれない
			if (categoryList.length == 0) mode = "Recent";

			if (mode == "Popular") {
				createModuleBody(target[i], Math.random().toString(36).slice(6), "Popular");
				getHatebu(target[i].dataset.targetId, blogsUriBase);
			} else if (mode == "Recent") {
				createModuleBody(target[i], Math.random().toString(36).slice(6), "Recent");
				getRSS(target[i].dataset.targetId, blogsUriBase + '/rss');
			} else {
				createModuleBody(target[i], Math.random().toString(36).slice(6), categoryList[0]);
				getRSS(target[i].dataset.targetId, blogsUriBase + rssPath + categoryList[0]);
			}
			$('#Htn-psne-Awasete-Link-' + target[i].dataset.targetId).tipsy({ opacity: 1, gravity: 's' }); //はてなブログ依存のツールチップ

		}
		setupEventListener();
		if (loadCSS) {
			//デフォルトCSS読み込み
			setupCSS(externalCSS);
		}
	}

	//CSSをリンクする
	function setupCSS(url) {
		var elmSideMenuCSS = document.createElement("link");
		elmSideMenuCSS.href = url;
		elmSideMenuCSS.rel = "stylesheet";
		elmSideMenuCSS.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(elmSideMenuCSS);
	}

	//Fisher-Yatesアルゴリズムでシャッフルする
	function listShuffle(a) { var b, c, d; a = a.slice(); b = a.length; if (0 === b) return a; for (; --b;) c = Math.floor(Math.random() * (b + 1)), d = a[b], a[b] = a[c], a[c] = d; return a }
	//文字列をエスケープするやつ
	function escapeHtml(a) { return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") };

	//リスト生成
	function insertEntryList(targetID, list) {
		var targetDiv = document.querySelectorAll('.js-htnpsne-awasete-entrys[data-target-id="' + targetID + '"]')[0];
		var count = targetDiv.dataset.count;
		var trackParameters = typeof (targetDiv.dataset.trackParameters) === 'undefined' ? "" : targetDiv.dataset.trackParameters;
		var listType = typeof (targetDiv.dataset.listType) === 'undefined' ? "" : targetDiv.dataset.listType;
		var displayBookmark_count = typeof (targetDiv.dataset.displayBookmark_count) === 'undefined' ? false : targetDiv.dataset.displayBookmark_count;
		targetDiv.innerHTML = '';
		if (list.length == 0) {
			list = [{
				"link": blogsUriBase,
				"title": "ブログTOPへ"
			}];
		}
		list = listShuffle(list);
		if (count > list.length) {
			count = list.length;
		} else if (count == 0) {
			count = 3;
		}
		//TODO:はてなブログのブログパーツ経由で表示させているが、オリジナルのHTMLを出力が必要か(要望があるか)確認する
		//その際、はてブの一覧ので画像表示にコストが掛かるため、実装の前にどうにかする必要がある
		if (listType == 'list') {
			var elem = document.createElement("ul");
			var listHtml = '';
			for (var i = 0; i < count; i++) {
				listHtml += '<li><a href="' + list[i].link + trackParameters + '">' + escapeHtml(list[i].title);
				if (displayBookmark_count == 'true') {
					listHtml += '<img src="http://b.st-hatena.com/entry/image/' + list[i].link + '" class="bookmark-count">'
				}
				listHtml += '</a></li>';
			}
			elem.innerHTML = listHtml;
			targetDiv.appendChild(elem);
		} else {
			//iframe
			// iframe版はdisplayBookmark_countはtrue扱いとなる
			for (var i = 0; i < count; i++) {
				var elem = document.createElement("iframe");
				elem.className = "embed-card embed-blogcard";
				elem.style.display = "block";
				elem.style.width = "100%";
				elem.frameBorder = 0;
				elem.scrolling = "no";
				elem.title = list[i].title;
				// ブログパーツ経由にする 外部サイト経由のアクセスとしてはてなブログのアクセス解析に載る
				// 他にも //psn.hatenablog.jp/embed/also-read というようにembedに置換しても良い (アクセス解析に載らない)
				elem.src = 'http://hatenablog-parts.com/embed?url=' + encodeURIComponent(list[i].link + trackParameters);
				targetDiv.appendChild(elem);
			}
		}
	}



	function createModuleBody(targetDiv, targetID,targetListName) {
		var form = document.createElement("div");
		form.dataset.targetId = targetID;
		targetDiv.dataset.targetId = targetID;
		var trackParameters = typeof (targetDiv.dataset.trackParameters) === 'undefined' ?
			"" : ' data-track-parameters="' + targetDiv.dataset.trackParameters + '"';
		var listType = typeof (targetDiv.dataset.listType) === 'undefined' ?
			"" : ' data-list-type="' + targetDiv.dataset.listType + '"';
		var displayBookmark_count = typeof (targetDiv.dataset.displayBookmark_count) === 'undefined' ?
			"" : ' data-display-bookmark_count="' + targetDiv.dataset.displayBookmark_count + '"';

		var formButtons = '<button class="js-htnpsne-awasete-btn-reload" data-target-id="' + targetID + '"><i class="blogicon-repeat"></i></button>';
		if (targetDiv.dataset.moreBtn == "true")
			formButtons += '<button class="js-htnpsne-awasete-btn-readmore" data-target-id="' + targetID + '"><i class="blogicon-list"></i></button>'
		if (targetDiv.dataset.subscribeBtn == "true")
			formButtons += '<button class="js-htnpsne-awasete-btn-subscribe" data-target-id="' + targetID + '"><i class="blogicon-subscribe"></i></button>'

		var optionList = '';
		if (targetListName == "Popular") {
			optionList += '<option value="" data-command="Popular" selected>人気エントリー</option>';
			targetListName = "";
		} else {
			optionList += '<option value="" data-command="Popular">人気エントリー</option>';
		}
		if (targetListName == "Recent") {
			optionList += '<option value="" data-command="Recent" selected>新着エントリー</option>';
			targetListName = "";
		} else {
			optionList += '<option value="" data-command="Recent">新着エントリー</option>';
		}

		for (var i = 0; i < categoryList.length; i++) {
			optionList += '<option value="' + categoryList[i] + '"';
			if (targetListName == categoryList[i]) {
				optionList += ' selected';
			}
			optionList += '>' + escapeHtml(decodeURIComponent(categoryList[i])) + '</option>';
		}
		form.innerHTML = ''
			+ '<div class="js-htnpsne-awasete-control-outer">'
			+ '<span class="js-htnpsne-awasete-title">' + targetDiv.dataset.title + '</span>'
			+ '<span class="js-htnpsne-awasete-control">'
			+ '<a href="http://psn.hatenablog.jp/entry/also-read" id="Htn-psne-Awasete-Link-' + targetID
			+ '" original-title="この機能は何？" target="_blank"><i class="blogicon-help"></i></a>'
			+ '<select class="js-htnpsne-awasete-select" data-target-id="' + targetID + '">'
			+ optionList
			+ '</select>'
			+ formButtons
			+ '</span></div>'
			+ '<div class="js-htnpsne-awasete-entrys" data-target-id="' + targetID
			+ '" data-count="' + ~~targetDiv.dataset.count + '"'
			+ trackParameters + listType + displayBookmark_count + '> :) </div>';
		targetDiv.appendChild(form);
	}

	function setupEventListener() {
		var target = document.querySelectorAll('.js-htnpsne-awasete-select');
		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.listen != "true") {
				target[i].dataset.listen = "true";
				target[i].addEventListener('change', function () {
					var targetID = this.dataset.targetId;
					if (this.value != "") {
						//カテゴリ選択
						getRSS(targetID, blogsUriBase + rssPath + this.value);
					} else {
						//新着 もしくは人気
						var targetSelect = document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0];
						if (targetSelect[targetSelect.selectedIndex].dataset.command == "Popular") {
							//人気記事
							getHatebu(targetID, blogsUriBase);
						} else {
							//新着記事
							getRSS(targetID, blogsUriBase + '/rss');
						}
					}
				}, false);
			}
		}


		//カテゴリ一覧を表示
		target = document.querySelectorAll('.js-htnpsne-awasete-btn-reload');
		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.listen != "true") {
				target[i].dataset.listen = "true";
				target[i].addEventListener('click', function () {

					//ボタンのtargetIDからセレクトボックスを指定する
					var targetID = this.dataset.targetId;
					var targetSelect = document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0];
					var openURL = '';
					if (targetSelect.value != "") {
						getRSS(targetID, blogsUriBase + rssPath + document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0].value);
					} else {
						//新着 もしくは人気
						if (targetSelect[targetSelect.selectedIndex].dataset.command == "Popular") {
							//人気記事
							getHatebu(targetID, blogsUriBase);
						} else {
							//新着記事
							getRSS(targetID, blogsUriBase + '/rss');
						}
					}

				}, false);
			}
		}



		//カテゴリ一覧を表示
		target = document.querySelectorAll('.js-htnpsne-awasete-btn-readmore');
		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.listen != "true") {
				target[i].dataset.listen = "true";
				target[i].addEventListener('click', function () {

					//ボタンのtargetIDからセレクトボックスを指定する
					var targetID = this.dataset.targetId;
					//console.log(document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0].value);

					var targetSelect = document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0];
					var openURL = '';
					if (targetSelect.value != "") {
						openURL = blogsUriBase + categoryPath
							+ document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0].value;
					} else {
						//新着 もしくは人気
						if (targetSelect[targetSelect.selectedIndex].dataset.command == "Popular") {
							//人気記事
							openURL = 'http://b.hatena.ne.jp/entrylist?sort=count&url='
								+ encodeURIComponent(blogsUriBase);
						} else {
							//新着記事
							openURL = blogsUriBase + '/archive';
						}
					}
					openNewWindow(openURL);

				}, false);
			}
		}

		//カテゴリ一覧の購読
		target = document.querySelectorAll('.js-htnpsne-awasete-btn-subscribe');
		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.listen != "true") {
				target[i].dataset.listen = "true";
				target[i].addEventListener('click', function () {

					//ボタンのtargetIDからセレクトボックスを指定する
					var targetID = this.dataset.targetId;
					var targetSelect = document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0];
					var openURL = '';
					if (targetSelect.value != "") {
						openURL = blogsUriBase + rssPath
							+ document.querySelectorAll('select[data-target-id="' + targetID + '"]')[0].value;
					} else {
						//新着 もしくは人気
						if (targetSelect[targetSelect.selectedIndex].dataset.command == "Popular") {
							//人気記事
							openURL = 'http://b.hatena.ne.jp/entrylist?sort=count&mode=rss&url='
								+ encodeURIComponent(blogsUriBase);
						} else {
							//新着記事
							openURL = blogsUriBase + '/feed';
						}
					}
					openNewWindow(feedlyURL + encodeURIComponent(openURL));

				}, false);
			}
		}

	}
	function openNewWindow(url) {
		window.open(url);
	}

	/*
	 * DOM生成完了時にスタート
	 */
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			setupModule();
		}, false);
	} else {
		setupModule();
	}
})();

