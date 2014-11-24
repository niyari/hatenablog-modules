/*

* はてなブログの記事のカテゴリをパンくずリストのようなデータに差し替える

** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<!-- ここから -->
<script type="text/javascript">
//親カテゴリの名前を入力します。カテゴリの名前に " が入る場合は \" と置き換えます。
var _parentCategory = [
						"親カテゴリ1",
						"親カテゴリ\"2",
						"親カテゴリ3",
					  ];
</script>
<script src="//niyari.github.io/hatenablog-modules/breadcrumb.js" charset="utf-8" async defer></script>
<!-- ここまで -->

記事のヘッダ部分にあるカテゴリに、パンくずリストのようなmicrodataを差し込むやつです。
https://support.google.com/webmasters/answer/185417

どうぞご利用ください。

免責：何が起きても各自の責任の下お使いください。コメントは程々になりました。

そもそもブログ側の構造的がアレで、色々無理矢理だったりするので、githubに上げておきます。
使いやすいように各自、適当に弄ってください。

詳細は、すなばいじり へ書く予定です。
http://psn.hatenablog.jp/

*/

(function(){
	var _baseURI = document.querySelector("html").getAttribute("data-blogs-uri-base");
	//TOPページ用表示用。HTMLタグの「data-blogs-uri-base」から拾ってくるのが一番スマートであるよ
	//準備
	if(!(window._parentCategory instanceof Array)){_parentCategory = window._parentCategory || [] };

	var _categoryBody = document.querySelectorAll("header.entry-header div.categories");
	var _breadcrumbHTML = document.createElement("div");
	//単一ページの場合はカテゴリ表示は一つ。TOPページから見たら複数ある事もある。
	//検索エンジンが混乱しないように、複数ある場合はスキップさせる。
	if (_categoryBody.length > 1) return;

	make_BreadcrumbNav(_categoryBody[0]);

//おしまい

	function make_BreadcrumbTree(erem){
		//カテゴリの親子関係を調べて階層レベルとして返す。

		var parentStr = _parentCategory.join('<>') + '<>';
		var treeList = [0];
		var treeLevel = 0;

		if(erem.length === 0){
			//カテゴリの指定がない
			return treeList;
		}
		if(_parentCategory.length === 0){
			//親カテゴリのデータが無い場合は、すべて親カテゴリにする
			for (var i = 0; i < erem.length; i++){
				treeList[i] = 0;
			}
			return treeList;
		}

		for (var i = 0; i < erem.length; i++){
			if (parentStr.indexOf(erem[i].innerHTML + '<>') > -1 || i === 0){
				//最初のカテゴリ、または、親カテゴリだった
				treeLevel = 0;
			}
			treeList[i] = treeLevel;
			treeLevel++;
		}
		return treeList;
	}


	function make_BreadcrumbElem(elem,child_flg){
		//
		var el_content = document.createElement("span");//itemscope
		var el_link = document.createElement("a");//link
		var el_title = el_content.cloneNode(true);//span - title

		//microdata部分を大まかに設定する
		el_content.setAttribute("itemscope", "");//set itemscope
		el_content.setAttribute("itemtype", "http://data-vocabulary.org/Breadcrumb");//set itemtype - url
		el_link.setAttribute("itemprop", "url");//set itemprop - url
		el_title.setAttribute("itemprop", "title");//set itemprop - title

		el_title.innerText = elem.innerText;//タイトルを入れる
		el_link.setAttribute("href", elem.href);//リンク先

		//組み立てる
		el_link.appendChild(el_title);
		el_content.appendChild(el_link);

		if (child_flg){
			//子として指定する
			el_content.setAttribute("itemprop", "child");
		}
		return el_content;
	}

	function make_BreadcrumbNav(Categories){
		var nav_Breadcrumb = document.createElement("nav");
		var categoryList = Categories.querySelectorAll("a");

		if(categoryList.length > 1) return;

		var treeList = make_BreadcrumbTree(categoryList);
		var nav_Child = [];
		var nav_Parent = [];

		//逆順に回して子カテゴリから詰め込んでいく
		for (var i = treeList.length - 1; i >= 0; i--){
			if(treeList[i] === 0){
				//親カテゴリ
				nav_Parent = make_BreadcrumbElem(categoryList[i],0);
				for(var index in nav_Child){
					nav_Parent.appendChild(nav_Child[index]);
				}
				nav_Breadcrumb.insertBefore(nav_Parent,nav_Breadcrumb.firstChild);
				nav_Child=[];
			}else{
				//子カテゴリ
				nav_Child.unshift(make_BreadcrumbElem(categoryList[i],1) );
			}

			//不要になった元のカテゴリ表示を消す
			Categories.removeChild(categoryList[i]);

		}
		//すべての処理が終わったら生成済みのパンくずリストを埋め込む
		Categories.appendChild(nav_Breadcrumb);
	}
})();
