﻿/**
 * はてなブログに関連エントリを追加する
 */
// ==ClosureCompiler==
// @output_file_name also-read.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog Also read (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * (・ω・) where to go? https://www.youtube.com/watch?v=nbeGeXgjh9Q
 */
(function () {
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
		var selector = "body.page-entry div.entry-categories a";
		if (document.getElementsByTagName("html")[0].dataset.device == "touch") {
			selector = "body.page-entry header.entry-header div.categories a";
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
				list.push({
					"title": $(this).find('title').text(),
					"link": $(this).find('link').text()
				});
			});
			//
			insertEntryList(targetID, list);
			//console.log(list);
		}).fail(function (xhr, status, error) {
			// 通信失敗
		});
	}

	//JSONP受信
	function getHatebu(targetID, url) {
		$.ajax({
			dataType: 'jsonp',
			url: 'http://b.hatena.ne.jp/entrylist/json',
			data: {
				"sort": "count",
				"url": url
			}
		}).done(function (data, status, xhr) {
			insertEntryList(targetID, data);
			//console.log(data);
		}).fail(function (xhr, status, error) {
			// 通信失敗
		});
	}

	//初期処理
	function setupModule() {
		categoryList = getCategoryList();
		var target = document.querySelectorAll('.js-htnpsne-awasete-module');

		for (var i = 0; i < target.length; i++) {
			if (target[i].dataset.userCss == "true") loadCSS = false;

				createModuleBody(target[i], Math.random().toString(36).slice(6));

			var mode = target[i].dataset.mode;
			//カテゴリーが設定されていない事がある　ランダムでも良いかもしれない
			if (categoryList.length == 0) mode = "Recent";

			if (mode == "Popular") {
				getHatebu(target[i].dataset.targetId, blogsUriBase);
			} else if (mode == "Recent") {
				getRSS(target[i].dataset.targetId, blogsUriBase + '/rss');
			} else {
				getRSS(target[i].dataset.targetId, blogsUriBase + rssPath + categoryList[0]);
			}
			$('#Htn-psne-Awasete-Link-' + target[i].dataset.targetId).tipsy({ opacity: 1 }); //はてなブログ依存のツールチップ

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

	//リスト生成
	function insertEntryList(targetID, list) {
		var targetDiv = document.querySelectorAll('.js-htnpsne-awasete-entrys[data-target-id="' + targetID + '"]')[0];
		var count = targetDiv.dataset.count;
		var trackParameters = typeof (targetDiv.dataset.trackParameters) === 'undefined' ? "" : targetDiv.dataset.trackParameters;
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
		for (var i = 0; i < count; i++) {
			var elem = document.createElement("iframe");
			elem.className = "embed-card embed-blogcard";
			elem.style.display = "block";
			elem.style.width = "100%";
			elem.frameBorder = 0;
			elem.scrolling = "no";
			elem.title = list[i].title;
			// ブログパーツ経由にする
			elem.src = 'http://hatenablog-parts.com/embed?url=' + encodeURIComponent(list[i].link + trackParameters);
			targetDiv.appendChild(elem);
		}
	}



	function createModuleBody(targetDiv, targetID) {
		var form = document.createElement("div");
		form.dataset.targetId = targetID;
		targetDiv.dataset.targetId = targetID;
		var trackParameters = typeof (targetDiv.dataset.trackParameters) === 'undefined' ?
			"" : ' data-track-parameters="' + targetDiv.dataset.trackParameters + '"';

		var formButtons = '<button class="js-htnpsne-awasete-btn-reload" data-target-id="' + targetID + '"><i class="blogicon-redirect"></i></button>';
		if (targetDiv.dataset.moreBtn == "true")
			formButtons += '<button class="js-htnpsne-awasete-btn-readmore" data-target-id="' + targetID + '"><i class="blogicon-list"></i></button>'
		if (targetDiv.dataset.subscribeBtn == "true")
			formButtons += '<button class="js-htnpsne-awasete-btn-subscribe" data-target-id="' + targetID + '"><i class="blogicon-subscribe"></i></button>'

		var optionList = '<option value="" data-command="Popular">人気エントリー</option><option value="" data-command="Recent">新着エントリー</option>';

		for (var i = 0; i < categoryList.length; i++) {
			optionList += '<option value="' + categoryList[i] + '">' + decodeURIComponent(categoryList[i]) + '</option>';
		}
		form.innerHTML = ''
			+ '<div class="js-htnpsne-awasete-control-outer">'
			+ '<span class="js-htnpsne-awasete-title">' + targetDiv.dataset.title + '</span>'
			+ '<span class="js-htnpsne-awasete-control">'
			+ '<a href="http://psn.hatenablog.jp/" style="tipsy-top" id="Htn-psne-Awasete-Link-' + targetID + '" original-title="すなばいじりにアクセス" target="_blank">:)</a>'
			+ '<select class="js-htnpsne-awasete-select" data-target-id="' + targetID + '">'
			+ optionList
			+ '</select>'
			+ formButtons
			+ '</span></div>'
			+ '<div class="js-htnpsne-awasete-entrys" data-target-id="' + targetID + '" data-count="' + ~~targetDiv.dataset.count + '"'
			+ trackParameters + '> :) </div>';
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

