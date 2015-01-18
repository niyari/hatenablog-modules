/*

* はてなブログの記事にある画像を拡大させないようにする

** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<script src="//niyari.github.io/hatenablog-modules/disable-cbox.js" charset="utf-8" defer></script>

上記1行を貼り付けるだけで、記事内の画像が拡大表示されなくなります。

どうぞご利用ください。

詳しい設置方法や詳細は、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena

*/

(function(){
	var imgs = document.querySelectorAll("div.entry-content img.hatena-fotolife");
	for (var i=0 ; i < imgs.length ; i++) {
		imgs[i].className = imgs[i].className.replace( "hatena-fotolife" , '');
	}
})();

