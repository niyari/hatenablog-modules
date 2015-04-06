/**
 * はてなブログにサイドメニューを追加する
 */
// ==ClosureCompiler==
// @output_file_name sidemenu.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==
/**
 * @preserve HatenaBlog SideMenu (c) 2015 Pocket Systems. | psn.hatenablog.jp
 * (「・ω・)／ Alright, let's conquer the world! Da! https://www.youtube.com/watch?v=jcIOg_m-bp4
 */
//(function(){
var overlayHtml,overlayContainer,sideMenuOverlay,sideMenu,scrollPosY;
var info={};
/*
 * メニュー開閉処理
 */
function toggleSideMenu(){
	//メインのコンテンツにオーバーレイする要素が見えているかでメニューの開閉を判断する
	if(sideMenuOverlay.style.display === 'block'){
		closeSideMenu();
	}else{
		sideMenuOverlay.style.display = 'block';
		scrollPosY = document.body.scrollTop;
		document.getElementById("container").style.top = ~~(0 - scrollPosY) +'px';
		overlayHtml.className = 'menu-open';
	}
}
//閉じる部分は複数から呼ばれる
function closeSideMenu(){
	sideMenuOverlay.style.display = 'none';
	overlayHtml.className = '';
	document.getElementById("container").style.top = '';
	window.scrollTo(0, scrollPosY);
}
/*
 * サイドメニューのアイテムを生成する
 */
function createMenuItem(name){
	var url,text;
	switch (name){
	case 'subscribe':
		url = info.subscribeUrl;
		text = '&nbsp;<i class="blogicon-subscribe lg"></i>&nbsp;読者になる';
		break;
	case 'facebook':
		url = 'https://www.facebook.com/sharer/sharer.php?u=' + info.urlEncodedPermaLink;
		text = '<i class="sideicon-facebook-squared"></i>facebookでシェア';
		break;
	case 'googleplus':
		url = 'https://plus.google.com/share?url=' + info.urlEncodedPermaLink;
		text = '<i class="sideicon-gplus-squared"></i>google +1';
		break;
	case 'twitter':
		url = 'https://twitter.com/intent/tweet?url=' + info.urlEncodedPermaLink + '&text=' + info.entryTitle;
		text = '<i class="sideicon-twitter-squared"></i>ツイートする';
		break;
	case 'hatebu':
		url = 'http://b.hatena.ne.jp/entry/' + info.urlEncodedPermaLink;
		text = '&nbsp;<i class="blogicon-bookmark lg"></i>&nbsp;はてなブックマーク';
		break;
	case 'pocket':
		url = 'http://getpocket.com/edit?url=' + info.urlEncodedPermaLink + '&title=' + info.entryTitle;
		text = '<i class="sideicon-pocket"></i>Pocketに送る';
		break;
	case 'feedly':
		url = 'http://cloud.feedly.com/#subscription%2Ffeed%2F' + info.baseURI + '/feed';
		text = '&nbsp;<i class="blogicon-rss lg"></i>&nbsp;feedlyに送る';
		break;
	case 'feed':
		url = info.baseURI + '/feed';
		text = '&nbsp;<i class="blogicon-rss lg"></i>&nbsp;RSS';
		break;
	default:
		url = info.baseURI;
		text = 'TOPページへ';
		break;
	}
	var elmLi = document.createElement("li");
	elmLi.className = 'urllist-item';
	elmLi.innerHTML = '<div class="urllist-title-link"><a href="' + url + '" target="_blank">' + text + '</a></div>';
	return elmLi;
}
/*
 * ブログの各種データを取得する
 * 公式なデータをヘッダメニューからも取得するが、非同期に処理されるため、一部は後から上書きする
 */
function setBlogInfo(){
	info.baseURI = document.querySelector("html").getAttribute("data-blogs-uri-base");
	info.blogAuthor = document.querySelector("html").getAttribute("data-author");
	info.permaLink = info.baseURI + location.pathname;
	info.blogName = document.getElementById("title").textContent.replace(/\s+/g, "");
	info.entryTitle = document.title;
	info.urlEncodedentryTitle = encodeURIComponent(info.title);
	info.urlEncodedPermaLink = encodeURIComponent(info.permaLink);
	info.subscribeUrl = 'http://blog.hatena.ne.jp/' + info.blogAuthor +'/' + location.host + '/subscribe';
	Hatena.Diary.Pages.message('init', function (obj) {
		if(obj === undefined) return;
		info.can_open_editor = obj.can_open_editor;//編集可能か？
		info.editable = obj.editable;//編集可能か？
		info.subscribe = obj.subscribe;//購読しているか
		info.subscribeUrl = obj.subscribe_url;//購読用URL
		info.subscribes = obj.subscribes;//購読者数
	});
}
/*
 * サイドメニューのスケルトンを生成した後に呼び出す
 * キューを処理しつつ各種メニューの追加・表示/非表示を設定して組み立てていく
 */
function createSideMenu(que){
	var menulist = document.getElementById("js-psne-menulist");
	if(que instanceof Array === false){
		var que = [];
		que.push(['create','subscribe','facebook','googleplus','twitter','hatebu','pocket','feedly']);
	}
	for (var i = 0; i < que.length; i++) {
		switch (que[i][0]) {
		case 'create':
			for (var s = 1; s < que[i].length; s++) {
				menulist.appendChild(createMenuItem(que[i][s]));
			}
			break;
			//TODO キューの仕様を変える可能性あり['create','subscribe',…] → ['create',{'item':'subscribe',…}] どちらが良いですかねぇ
			//TODO 新着エントリー・人気エントリー・メニューリストの並べ替え
			//TODO 上記の非表示設定
			//TODO 一覧表示の遅延表示設定
			//TODO 他5項目
		}
	}
}
/*
 * オーバーレイ部分の生成
 */
function createSideMenuOverlayElm(){
	var elmSideMenuOverlay = document.createElement("div");
	elmSideMenuOverlay.id = 'psne-side-menu-overlay-container';
	elmSideMenuOverlay.innerHTML = '<div id="psne-side-menu-button"><i class="sideicon-menu"></i></div><div id="psne-side-menu-overlay"></div>';
	document.body.appendChild(elmSideMenuOverlay);
}
/*
 * メニュー本体の生成
 */
function createSideMenuElm(){
	var elmSideMenu = document.createElement("ul");
	elmSideMenu.id = 'psne-side-menu';
	elmSideMenu.innerHTML ='<li><div id="psne-side-menu-top"></div></li>' +
	'<li><div id="js-blog-title">' + info.blogName + '</div></li>' +
	'<li><div id="js-psne-newentry" class="side-menu-container"><div class="side-menu-container-title">新着エントリー</div></div></li>' +
	'<li><div id="js-psne-hotentry" class="side-menu-container"><div class="side-menu-container-title">人気エントリー</div></div></li>' +
	'<li><div class="side-menu-container"><div class="side-menu-container-title">こちらもどうぞ</div><ul id="js-psne-menulist">' +
	'</ul></div></li>' +
	'<li ><div id="psne-sidemenu-end"><a href="http://psn.hatenablog.jp/entry/discover-hatena" target="_blank">:)</a></div></li>';
	document.body.appendChild(elmSideMenu);
}
/*
 * CSSをリンクする
 */
function setupCSS(url){
	var elmSideMenuCSS = document.createElement("link");
	elmSideMenuCSS.href = url;
	elmSideMenuCSS.rel = "stylesheet";
	elmSideMenuCSS.type = "text/css";
	document.getElementsByTagName("head")[0].appendChild(elmSideMenuCSS);
}
/*
 * 新規エントリーと人気エントリーを呼び出すやつ
 */
function displayUrlList(){
	feedToHTML();
	fecthUrlList('access');
}
/*
 * ブログのfeedを取得して新着エントリーを表示させる
 */
function feedToHTML(){
	$.ajax({
		url : info.baseURI +'/feed',
		async : true,
		cache : false,
		dataType : 'xml'
	}).done( function(xml) {
		var elmUl = document.createElement("ul");
		elmUl.className='hatena-urllist';
//		$('feed>title', xml).text();//ブログ名
		$(xml).find("entry").each(function(index){
			if (index > 4) return false;
			var elmLi = document.createElement("li");
			var elmDiv = document.createElement("div");
			var elmA = document.createElement("a");
			elmLi.className = 'urllist-item';
			elmA.className = 'urllist-title-link';
			elmDiv.className = 'urllist-entry-body';
			elmA.textContent = $('title', this).text();
			if(elmA.innerHTML == ""){
				//基本的にここには入らない
				elmA.innerHTML = "■";
			}
			elmA.href = $(this).find("link").attr("href");
			elmLi.appendChild(elmA);
			elmDiv.textContent = $('summary', this).text();
			elmLi.appendChild(elmDiv);
			elmUl.appendChild(elmLi);
		});
		$("#js-psne-newentry").append(elmUl);
	});
}
/*
 * 人気エントリーを追加する
 */
function fecthUrlList(url){
	$.ajax({
		url : info.baseURI + "/entries_access_ranking_module",
//		url : url,
		data : "count=5&display_entry_category=0&display_entry_image=0&display_entry_image_size_width=50&display_entry_image_size_height=50&display_entry_body_length=50&display_entry_date=0&display_bookmark_count=0&source=" + url,
		async : true,
		cache : false,
		dataType : 'html'
	}).done( function(data) {
		//1行で済むのでjQuery。速度を求めるならリファクタリング
		$("#js-psne-hotentry").append(data);
	});
}
/*
 * (テスト)Android2.3でスクロールしない場合のメニュースクロール
 * //TODO 他にも上手く動かないのでJavascriptを借りる必要がある場合にもリストへ入れる
 * //TODO 若しくはCSSを書き換えて上手い事やれる構成にしてしまう
 */
function scrollSideMenu(){
	var ua = window.navigator.userAgent.toLowerCase();
	// && ('ontouchstart' in window)を追加してタッチできるかも調べた方が良いかもしれない
	if (/android 2./.test(ua)) {
//		console.log("droid");
	} else {
//		console.log("no_droid");
		return;
	}
	//debug
	var el = document.getElementById('psne-side-menu');
	el.addEventListener("touchstart", function(event) {
		el.pageY = event.changedTouches[0].pageY;
		el.top1 = el.scrollTop;
	}, false);
	el.addEventListener("touchmove", function(event) {
		el.top2 = el.pageY - event.changedTouches[0].pageY;
		el.scrollTop = el.top1 + el.top2;
/*
		console.log("scrollTop " + el.scrollTop);
		console.log("pageY " + el.pageY);
		console.log("event.pageY " + event.changedTouches[0].pageY);
		console.log("top1 " + el.top1);
		console.log("top2 " + el.top2);
*/
		if (el.top2 !== 0) {
			// スクロールさせたいのでページ変移を止める
			stopEvent(event);
		}
	}, false);
	el.addEventListener("touchend", function(event) {
	}, false);
	var stopEvent = function(event) {
		event.preventDefault();
		event.stopPropagation();
	};
}
/*
 * メイン
 */
function setupSideMenu(){
	setBlogInfo();
	setupCSS("//niyari.github.io/hatenablog-modules/css/sidemenu.css");
	setupCSS("//niyari.github.io/hatenablog-modules/css/htnshare-embedded.css");
	createSideMenuOverlayElm();
	createSideMenuElm();
	createSideMenu(Htnpsne.SideMenu.q);
	var menuBtn = document.getElementById("psne-side-menu-button");
	overlayHtml = document.getElementsByTagName("html")[0];
	overlayContainer = document.getElementById("psne-side-menu-overlay-container");
	sideMenuOverlay = document.getElementById("psne-side-menu-overlay");
	sideMenu = document.getElementById("psne-side-menu");
	menuBtn.addEventListener("click", toggleSideMenu, false);
	sideMenuOverlay.addEventListener("click", closeSideMenu, false);
	displayUrlList();
	scrollSideMenu();
}
/*
 * DOM生成完了時にスタート
 */
window.addEventListener("DOMContentLoaded", function(){
	if (document.querySelector("html").getAttribute("data-globalheader-type") !== "touch") return;
	setupSideMenu();

}, false);
//})();