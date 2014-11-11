/*

* はてなブログの記事一覧で任意のHTMLを表示させる

** 使い方

設定→詳細設定→「headに要素を追加」に貼り付け

<script src="//niyari.github.io/hatenablog-modules/push-content.js" charset="utf-8"></script>
<script>
Htnpsne.PushHTML.init('表示させたいHTML', '');
</script>

記事一覧(カテゴリー含む)、スマホ版のTOPページ(記事一覧)に表示させることができます。
第二引数に'googleads'と指定すると、AdSense用のスクリプトが追加で挿入されます。
AdSense用のスタイルについては、別途記述すると良いでしょう。

どうぞご利用ください。

免責：何が起きても各自の責任の下お使いください。
広告を差し込むために利用する場合は「はてなブログPro」の利用を強くお勧めします。

詳しい設置方法や詳細は、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena

*/


(function(){
	if (typeof(Htnpsne) == 'undefined') Htnpsne = {};

	Htnpsne.PushHTML = {
		content : '<div></div>',
		addType : '',
		init: function(content,type){
			var self = Htnpsne.PushHTML;
			self.content = content;
			self.addType = type;
			if(type == "googleads"){
			//Gads追加スクリプトの読み込み
	(function(b,d){var a=document.createElement(b);a.async=1;a.src=d;var c=document.getElementsByTagName(b)[0];c.parentNode.insertBefore(a,c)})('script','//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
			}
		},
		disp: function(){
			var self = Htnpsne.PushHTML;
			var _entrySelector ='div.entry-list a';
			if(/entry|about/.test(location.href)) return;

			if(document.querySelectorAll("div#footer-menu a.pcpage").length === 0 ) {
			//mobileチェック PC版への案内が無ければPC用の表示と考える
				if(!(/archive/.test(location.href)) ) return;
				//PC版で記事一覧以外なら終わり
				_entrySelector='div.archive-entries section';
			}
			var _entrys = document.querySelectorAll(_entrySelector);
			var _addHTML = document.createElement("div");
			_addHTML.setAttribute("class", "list-entry-article");
			_addHTML.innerHTML = self.content;
			_entrys[0].insertAdjacentHTML('afterend',_addHTML.outerHTML);
			console.log(_addHTML.outerHTML);
			switch (self.addType){
				case 'googleads':
					(adsbygoogle = window.adsbygoogle || []).push({});
					//setTimeout("(adsbygoogle = window.adsbygoogle || []).push({});", 50);
					break;
				case 'HatenaTime':
					Hatena.Locale.setupTimestampUpdater();
					break;
				default:
				//番兵くん
					break;
			}

		}
	}

	window.addEventListener("DOMContentLoaded", function(){
		Htnpsne.PushHTML.disp();
	}, false);

})();

