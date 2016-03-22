/*

* はてなブログのGoogleの検索結果から「検索結果内の検索ボックス」を表示させる
* MIT
** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<script src="//niyari.github.io/hatenablog-modules/microdata-search.js" charset="utf-8" defer></script>

2016年3月にmicrodataからJSON-LDへ出力を変更しました。目的、結果は同じです。
以下の説明文は、microdataにて出力していた際のものです。

検索ボックスにmicrodataを差し込むやつです。
Amazonや価格.comのGoogleの検索結果のように、「検索結果内の検索ボックス」が表示できるようなデータを生成します。
Google側が「有用」と判定すると表示されるようになるようです。

http://googlewebmastercentral-ja.blogspot.jp/2014/09/improved-sitelinks-search-box.html

どうぞご利用ください。

なお、JSON-LDを利用した方が、検索ボックスに影響されないすっきりした実装になります。

https://developers.google.com/webmasters/richsnippets/sitelinkssearch
How do you set it up?を参照してマークアップすると良いでしょう。

免責：何が起きても各自の責任の下お使いください。その代わりにコメントたくさん書きました。

詳しい設置方法など、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena

*/

(function () {
	"use strict";
	var _blogData = document.getElementsByTagName("html")[0].dataset;
	var _baseURI = _blogData.blogsUriBase;
	var _searchBoxBody = document.querySelector("div.hatena-module-search-box div.hatena-module-body");
	add_SearchActionJsonLD();
	if (_searchBoxBody) {
		//検索Boxがあるらしいので色々付加する
		//add_SearchAction_Tag(_searchBoxBody);
	}else{
		//タグが無いので何かする
		if(!window.console) {
			window.console = { log: function(msg){} };
		}
		console.log("microdata付き検索ボックス: 検索ボックスが設置されていないようです。");
		//make_SearchBox();
	}

	//おわり

	function add_SearchActionJsonLD() {
		var jsonld = document.createElement('script');
		jsonld.type = 'application/ld+json';
		jsonld.innerHTML = JSON.stringify(
			{
			"@context": "http://schema.org",
			"@type": "WebSite",
			"name": _blogData.blogName,
			"url": _baseURI + "/",
			"potentialAction": {
				"@type": "SearchAction",
				"target": _baseURI + "/search?q={search_term_string}",
				"query-input": "required name=search_term_string"
			}
			}
		);
		document.getElementsByTagName("head")[0].appendChild(jsonld);
	}
	/*
	function add_SearchAction_Tag(elem) {
		// JSON-LDに移行したため使用中止となっています。
		//タグいれるやーつ
		var meta_url = document.createElement("meta");
		var meta_target = meta_url.cloneNode(true);
		var meta_sitename = meta_url.cloneNode(true);
		meta_url.setAttribute("itemprop", "url");//set itemprop - url
		meta_url.setAttribute("content", _baseURI + '/');//set itemprop - url - content
		meta_target.setAttribute("itemprop", "target");//set itemprop - target
		meta_target.setAttribute("content", _baseURI + '/search?q={q}');//set itemprop - target - content
		meta_sitename.setAttribute("itemprop", "name");//set itemprop - name
		meta_sitename.setAttribute("content", document.getElementById("title").textContent);//set itemprop - name - content

		//書き方が汚いがダラダラ実装
		// http://schema.org/WebSite を定義する
		elem.setAttribute("itemscope", "");
		elem.setAttribute("itemtype", "http://schema.org/WebSite");
		
		// http://schema.org/SearchAction を定義する
		var searchBoxForm = elem.querySelector("form.search-form");
		searchBoxForm.setAttribute("itemscope", "");
		searchBoxForm.setAttribute("itemprop", "potentialAction");
		searchBoxForm.setAttribute("itemtype", "http://schema.org/SearchAction");
		
		// query-input (クエリはこれですよ) を定義する
		var searchBoxInput = searchBoxForm.querySelector("input.search-module-input");
		searchBoxInput.setAttribute("itemprop", "query-input");
		
		//書き換えが一通り終わったので、最後にmetaタグを入れる
		searchBoxForm.insertBefore(meta_target, searchBoxForm.firstChild);
		elem.insertBefore(meta_url, elem.firstChild);
		elem.insertBefore(meta_sitename, elem.firstChild);
	}
	function make_SearchBox() {
		// JSON-LDに移行したため使用中止となっています。
		//検索ボックスが設置されていないらしい
		var html_str = '<!-- microdata付き検索ボックス -->';
		html_str += '<div class="hatena-module hatena-module-search-box">';
		html_str += '<div class="hatena-module-title">何かお探しですか？ :)</div>';
		html_str += '<div itemscope itemtype="http://schema.org/WebSite" class="hatena-module-body">';
		html_str += '	<meta itemprop="url" content="' + _baseURI + '/"/>';
		html_str += '	<form itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction" class="search-form" role="search" action="' + _baseURI + '/search" method="get">';
		html_str += '		<meta itemprop="target" content="' + _baseURI + '/search?q={q}"/>';
		html_str += '		<input itemprop="query-input" type="text" name="q" class="search-module-input" placeholder="ブログ内検索" required="">';
		html_str += '		<input type="submit" class="search-module-button">';
		html_str += '	</form>';
		html_str += '</div>';
		html_str += '<p>検索ボックスが自動生成されました</p>';
		html_str += '</div>';
		html_str += "\n<!-- http://psn.hatenablog.jp/entry/discover-hatena -->";
		html_str += "\n<!-- / microdata付き検索フォーム -->";
		document.querySelector("div#box2-inner").insertAdjacentHTML('beforeend',html_str);
	}
	*/
})();
