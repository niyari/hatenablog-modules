/**
 * はてなブログ パンくずリスト Ver2
 * (c) 2015-2016 Pocket Systems. | MIT License
 * 詳しい設置方法や詳細は、すなばいじり をご覧ください。
 * http://psn.hatenablog.jp/entry/breadcrumb
 */
// ==ClosureCompiler==
// @output_file_name breadcrumb.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog Breadcrumb v2 (c) 2015-2016 Pocket Systems. | MIT | psn.hatenablog.jp
 * (・ω・) where to go? https://www.youtube.com/watch?v=nbeGeXgjh9Q
 */

/**
 * @preserve Htnpsne.API.ts v1.0.2 (c) 2016 Pocket Systems. | MIT | psn.hatenablog.jp
 */
if (typeof (Htnpsne) == 'undefined') var Htnpsne = {};
(function(e){(function(d){var e=document.getElementsByTagName("head")[0],f=!1;d.htmlTagData=document.getElementsByTagName("html")[0].dataset;d.setupCSS=function(a){var b=document.createElement("link");b.href=a;b.rel="stylesheet";b.type="text/css";e.appendChild(b)};d.listShuffle=function(a){var b,c,d;a=a.slice();b=a.length;if(0===b)return a;for(;--b;)c=Math.floor(Math.random()*(b+1)),d=a[b],a[b]=a[c],a[c]=d;return a};d.escapeHtml=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,
"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")};d.makeHtmlGoogAds=function(a,b){void 0===b&&(b=!1);if("undefined"==typeof a.client||null==a.client||""==a.client){if(b){var c=document.createElement("ins");return c.setAttribute("data-ad-error","error")}}else if("undefined"==typeof a.slot||null==a.slot||""==a.slot){if(b)return c=document.createElement("ins"),c.setAttribute("data-ad-error","error")}else{if(!f){c=document.createElement("script");c.async=!0;c.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
var d=document.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d);f=!0}if("undefined"==typeof a.className||null==a.className)a.className="";if("undefined"==typeof a.style||null==a.style)a.style={display:"block"};if("undefined"==typeof a.format||null==a.format)a.format="auto";return b?(c=document.createElement("ins"),c.className="adsbygoogle "+a.className,c.setAttribute("data-ad-client",a.client),c.setAttribute("data-ad-slot",a.slot),c.setAttribute("data-ad-format",a.format),c):'<ins class="adsbygoogle '+
a.className+'" style="'+a.style+'" data-ad-client="'+a.client+'" data-ad-slot="'+a.slot+'" data-ad-format="'+a.format+'"></ins>'}};d.hatenaProfileIconURL=function(a,b){void 0===a&&(a="my");return b?"http://n.hatena.ne.jp/"+a+"/profile/image?type=icon&size="+b:"http://n.hatena.ne.jp/"+a+"/profile/image?type=icon"};d.hasCategory=function(a){void 0===a&&(a="");a=a.replace(/\s/g,"-");return"entry"!=document.getElementsByTagName("html")[0].getAttribute("data-page")||""===a?!1:0<=document.getElementsByTagName("body")[0].className.split(" ").indexOf("category-"+
a)}})(e.API||(e.API={}))})(Htnpsne||(Htnpsne={}));

(function () {
	"use strict";
	// TODO:セパレート型のパンくずリストを導入しているブログ向け対応
	var _blogData, _baseURI, _parentCategoryList, _categoryBody, categoryListType = 'list', matchExp;
	var _setting = {allParent:false};
	function breadcrumb() {
		_blogData = Htnpsne.API.htmlTagData;
		if (_blogData.page === 'about') {
			moduleExecuteTest();
		};
		_baseURI = _blogData.blogsUriBase;
		if (_blogData.page === 'entry') {
			//準備
			loadQue();
			_categoryBody = document.querySelector("header.entry-header div.categories");
			//TOPページから見たら複数ある事もある。
			if (_categoryBody instanceof HTMLElement === false) return;
			make_BreadcrumbNav(_categoryBody);
		} else if (_blogData.page === 'archive' && /^\/archive\/category\//.test(location.pathname)) {
			//カテゴリページ
			modify_childProp();
		};
	}

	//コードの動作確認
	function moduleExecuteTest() {
		var elm_aboutContent, elm_div;
		if (document.getElementById('Htnpsne-about-elem') == null) {
			if (document.querySelector('.about-subscription-count') != null) {
				//最後から2番目に追加
				elm_aboutContent = document.querySelectorAll('div.entry-content dt');
				elm_aboutContent = elm_aboutContent[elm_aboutContent.length - 1];
				elm_div = document.createElement("dt");
				elm_div.innerText = 'ブログ拡張機能';
				elm_aboutContent.parentNode.insertBefore(elm_div, elm_aboutContent);
				elm_div = document.createElement("dd");
				elm_div.id = 'Htnpsne-about-elem';
				elm_aboutContent.parentNode.insertBefore(elm_div, elm_aboutContent);
			} else {
				//最後に追加
				elm_aboutContent = document.querySelectorAll('div.entry-content dd');
				if (elm_aboutContent.length == 0) {
					//aboutページのコンテンツが空なのでdivを入れる
					elm_div = document.createElement("div");
					elm_aboutContent = document.querySelector('div.entry-content');
					elm_aboutContent.appendChild(elm_div);
					elm_aboutContent = elm_div;
				} else {
					elm_aboutContent = elm_aboutContent[elm_aboutContent.length - 1];
				}
				elm_div = document.createElement("dt");
				elm_div.innerText = 'ブログ拡張機能';
				elm_aboutContent.parentNode.appendChild(elm_div);
				elm_div = document.createElement("dd");
				elm_div.id = 'Htnpsne-about-elem';
				elm_aboutContent.parentNode.appendChild(elm_div);
			}
		}
		elm_aboutContent = document.getElementById('Htnpsne-about-elem');
		elm_div = document.createElement("div");
		elm_div.innerHTML = '<a href="http://psn.hatenablog.jp/entry/breadcrumb" target="_blank">パンくずリスト(はてなブログ) を利用中です。</a>';
		elm_aboutContent.appendChild(elm_div);
	}

	function loadQue() {
		var que = Htnpsne.Breadcrumb.q;
		if (window._parentCategory) {
			//古い設定がある
			console.log("Breadcrumb：古い設定があります。");
			display_comeOnBreadcrumbV2();// 移行を促す奴
		}
		if (que instanceof Array === false) {
			var que = [];
			if (window._parentCategory) {
				que.push(['parentCategory', window._parentCategory]);
			} else {
				que.push(['parentCategory', []]);
			}
		}
		for (var i = 0; i < que.length; i++) {
			try {
				switch (que[i][0]) {
					case 'parentCategory':
						_parentCategoryList = que[i][1];
						break;
					case 'mode':
						if (que[i][1].Category == 'Separate') {
							categoryListType = 'Separate';
							matchExp = new RegExp("" + que[i][1].pattern + "");
						} else {
							categoryListType = 'list';
						}
						break;
					case 'setting':
						_setting = que[i][1];
						break;
					default:
						break;
				}
			} catch (e) {
				console.log("Queue Error →");
				console.log(e);
			}
		}
	}

	function display_comeOnBreadcrumbV2() {
		// 移行を促す奴
		Messenger.addEventListener('init', function (data) {
			// if (data) return; // 移行告知キャンセル中
			if (data.can_open_editor) {
				var elm_comeOnWindow = document.createElement("div");
				elm_comeOnWindow.innerHTML = '<div style="position: fixed;top: 45px;right: 0px;background: #fff;'
					+ 'max-width: 100%;padding: .2em;border: solid 1px #303030;">'
					+ '<div style="font-size: 1.3em;text-align: center;border-bottom: solid 2px #000;">パンくずリスト</div>'
					+ '<div style="padding-bottom: .3em;">最新のバージョンがあります。<br>(古い設定が残っています)</div>'
					+ '<div style="text-align: right;margin: 0.3em 0.1em;">'
					+ '<a href="http://psn.hatenablog.jp/entry/breadcrumb" target="_blank" style="background: #309aea;text-decoration: none;color: #FFF;'
					+ 'padding: .3em;">確認する</a>'
				  + '</div>'
				+ '</div>';
				document.getElementsByTagName("body")[0].appendChild(elm_comeOnWindow);
			}
		});

	}

	function modify_childProp() {
		//カテゴリページのパンくずリストのエラーを修正する 2016/03
		var elm_child = document.querySelector("span.breadcrumb-child[itemtype='http://data-vocabulary.org/Breadcrumb']");
		if (!elm_child) return;
		var elm_childSpan = elm_child.querySelector("span[itemprop='title']")
		var elm_link = document.createElement("a");//
		elm_link.setAttribute("itemprop", "url");//set itemprop - url
		elm_link.setAttribute("href", location.href);
		elm_link.appendChild(elm_childSpan);
		elm_child.appendChild(elm_link);

		make_JsonLdCategoryPage(location.href, elm_childSpan.innerText);
	}

	function make_JsonLdCategoryPage(uri, pageTitle) {
		var jsonld = document.createElement('script');
		jsonld.type = 'application/ld+json';
		jsonld.innerHTML = JSON.stringify({
			"@context": "http://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [{
				"@type": "ListItem",
				"position": 1,
				"item": {
					"@id": uri,
					"name": pageTitle
				}
			}]
		});
		document.getElementsByTagName("head")[0].appendChild(jsonld);
	}

	function make_BreadcrumbTree(elem) {
		//カテゴリの親子関係を調べて階層レベルとして返す。

		var parentStr = _parentCategoryList.join('<>') + '<>';
		var treeList = [0];
		var treeLevel = 0;

		if (elem.length === 0) {
			//カテゴリの指定がない
			return treeList;
		}
		if (_parentCategoryList.length === 0 || _setting.allParent == true) {
			//親カテゴリのデータが無い場合は、すべて親カテゴリにする
			for (var i = 0; i < elem.length; i++) {
				treeList[i] = 0;
			}
			return treeList;
		}

		for (var i = 0; i < elem.length; i++) {
			if (parentStr.indexOf(elem[i].innerHTML + '<>') > -1 || i === 0) {
				//最初のカテゴリ、または、親カテゴリだった
				treeLevel = 0;
			}
			treeList[i] = treeLevel;
			treeLevel++;
		}
		return treeList;
	}

	function make_BreadcrumbNav(Categories) {
		var categoryList = Categories.querySelectorAll("a");
		if (categoryList instanceof NodeList === false) {
			console.log("エントリにカテゴリがありませんでした")
			return;
		}
		var treeList = make_BreadcrumbTree(categoryList);
		//// JSON-LD
		var ld_breadcrumbList = [], ld_itemListElement = [];
		for (var i = treeList.length - 1; i >= 0; i--) {
			ld_itemListElement.unshift({
				"@type": "ListItem",
				"position": treeList[i] + 1,
				"item": {
					"@id": categoryList[i].href,
					"name": categoryList[i].innerText
				}
			});
			if (treeList[i] === 0) {
				//親カテゴリ
				ld_breadcrumbList.unshift({
					"@context": "http://schema.org",
					"@type": "BreadcrumbList",
					"itemListElement": ld_itemListElement
				});
				ld_itemListElement = [];
			}
		}
		var jsonld = document.createElement('script');
		jsonld.type = 'application/ld+json';
		jsonld.innerHTML = JSON.stringify(ld_breadcrumbList);
		document.getElementsByTagName("head")[0].appendChild(jsonld);
	}

	if (typeof (Htnpsne.Breadcrumb) == 'undefined') Htnpsne.Breadcrumb = {};
	if (Htnpsne.Breadcrumb.processed) return;
	Htnpsne.Breadcrumb.processed = true;
	if (document.readyState == "uninitialized" || document.readyState == "loading") {
		window.addEventListener("DOMContentLoaded", function () {
			breadcrumb();
		}, false);
	} else {
		breadcrumb();
	}

})();
