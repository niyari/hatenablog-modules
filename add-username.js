/*

* はてなブログの /about ページにユーザー名を増やすやつ
http://q.hatena.ne.jp/1418279079

はてなブログ側の仕様変更により、/about ページが自由にカスタマイズできるようになった為、
このスクリプトは無効化されています。

詳細は、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena
*/

/*

//TODO:
2016/09の仕様は、はてなハイクのAPIを使った名前の取得
https://h.hatena.ne.jp/api/friendships/show.json?callback=jQuery19106939333802523071_1473241377396&url_name=sample&url_name=hatenablog
カスタマイズの自由度が上がったので、そもそも不要なのでは、と思うやつ。→ deprecated へ移動
/aboutページがカスタマイズ可能になったので、何処かのタイミングで正常動作しているコードを書いて、終了とする
*/

(function () {
	"use strict";
	if (typeof(Htnpsne) == 'undefined') Htnpsne = {};
	Htnpsne.AddAuthor = {
		init: function (name, vertical_flg) {
			window.addEventListener("DOMContentLoaded", function () {
				Messenger.addEventListener('init', function (data) {
					if (data.can_open_editor) {
						var elm_comeOnWindow = document.createElement("div");
						elm_comeOnWindow.innerHTML = '<div style="position: fixed;top: 45px;right: 0px;background: #fff;'
							+ 'max-width: 100%;padding: .2em;border: solid 1px #303030;">'
							+ '<div style="font-size: 1.3em;text-align: center;border-bottom: solid 2px #000;">add-username.js</div>'
							+ '<div style="padding-bottom: .3em;">/aboutページがカスタマイズ可能になったため無効化されています。<br>代替の方法があります。</div>'
							+ '<div style="text-align: right;margin: 0.3em 0.1em;">'
							+ '<a href="http://psn.hatenablog.jp/entry/2016/09/10/220001" target="_blank" style="background: #309aea;text-decoration: none;color: #FFF;'
							+ 'padding: .3em;">確認する</a>'
						  + '</div>'
						+ '</div>';
						document.getElementsByTagName("body")[0].appendChild(elm_comeOnWindow);
					}
				});
			}, false);
		}
	}
})();
