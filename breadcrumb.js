/*

* はてなブログの記事のカテゴリをパンくずリストのようなデータに差し替える

** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<script src="http://niyari.github.io/hatenablog-modules/breadcrumb.js" charset="utf-8"></script>

記事のヘッダ部分にあるカテゴリに、パンくずリストのようなmicrodataを差し込むやつです。
https://support.google.com/webmasters/answer/185417

どうぞご利用ください。

免責：何が起きても各自の責任の下お使いください。その代わりにコメントたくさん書きました。

そもそもブログ側の構造的がアレで、色々無理矢理だったりするので、githubに上げておきます。
使いやすいように各自、適当に弄ってください。

詳細は、すなばいじり へ書く予定です。
http://psn.hatenablog.jp/

*/

(function(){
//	var baseURI = document.querySelector("#title a");
//未実装：TOPページ用表示用。HTMLタグの「data-blogs-uri-base」から拾ってくるのが一番スマートであるよ

	var categoryBody = document.querySelectorAll("header.entry-header div.categories");
	//単一ページの場合もあるけど、TOPページから見たら複数ある事もあるよね

	for (var i = 0; i < categoryBody.length; i++){
		pankuzuSet(categoryBody[i]);
		//それぞれにmicrodataを付けるよ
	}

//おしまい

	function pankuzuSet(attr){
	    var nav_Breadcrumb = document.createElement("nav");
		//新しい入れ物を用意しよう
	    var categoryModule = attr.querySelectorAll("a");
		//カテゴリーの一覧を作るよ

		//nav_Breadcrumb.appendChild(aToPankuzu_Top(baseURI));
		//未実装：TOPページのやつは無くても良いよね。

	    for (var i = 0; i < categoryModule.length; i++){
			nav_Breadcrumb.appendChild(aToPankuzu(categoryModule[i]));
			//カテゴリーの一覧から一つ一つmicrodataを追加するよ
		}
		attr.appendChild(nav_Breadcrumb);
		//一通りmicrodataを入れたら、元に戻すよ
	}
	function aToPankuzu(elem){
	    var el_outer = document.createElement("span");
	    var el_span = document.createElement("span");
		//入れ物とタイトル用の要素を作るよ

	    el_outer.setAttribute("itemscope", "");//set itemscope
	    el_outer.setAttribute("itemtype", "http://data-vocabulary.org/Breadcrumb");//set itemtype - url
	    elem.setAttribute("itemprop", "url");//set itemprop - url
	    el_span.setAttribute("itemprop", "title");//set itemprop - title
		//microdataの定義をするよ

	    el_span.innerText = elem.innerText;
	    elem.innerHTML = '';
		//機械がタイトルを読めるように書き直すよ
	    
	    elem.appendChild(el_span);
		//書き直したタイトルをリンクに詰めるよ
	    el_outer.appendChild(elem);
		//定義した箱に詰めるよ

	    return el_outer;
		//返すよ
	}
})();
