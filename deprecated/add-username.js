/*

* はてなブログの /about ページにユーザー名を増やすやつ
http://q.hatena.ne.jp/1418279079

** 使い方

<script src="//niyari.github.io/hatenablog-modules/add-username.js" charset="utf-8"></script>
<script>
Htnpsne.AddAuthor.init(["ユーザID1","ユーザID1","ユーザID1"],1);
</script>

はてなIDを "" で囲って追加していきます。
最後の ,1 は、横に並べるか、縦に積むかの指定です。
省略すると横に表示されていきます。

どうぞご利用ください。


詳細は、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena
*/

/*

//TODO:
2016/09の仕様は、はてなハイクのAPIを使った名前の取得
https://h.hatena.ne.jp/api/friendships/show.json?callback=jQuery19106939333802523071_1473241377396&url_name=sample&url_name=hatenablog
/aboutページがカスタマイズ可能になったので、プロフィールが表示されているかを確認
カスタマイズの自由度が上がったので、そもそも不要なのでは、と思うやつ。→ deprecated へ移動予定
*/

(function(){
	if (typeof(Htnpsne) == 'undefined') Htnpsne = {};
	Htnpsne.AddAuthor = {
		init: function (name, vertical_flg) {}
	}
	/*
	Htnpsne.AddAuthor = {
			users:[],
			vertical:false,
			init: function(name,vertical_flg){
				var self = Htnpsne.AddAuthor;
				self.users = name;
				if(vertical_flg===1)self.vertical = true;
			},
			disp:function (){
				var self = Htnpsne.AddAuthor;
				var author_a = document.querySelector('[data-user-name]').parentNode;
				var authorList = author_a.parentNode
				for ( var i in self.users ){
					if(self.vertical) authorList.appendChild(document.createElement("br"));
					authorList.appendChild(self.makeProfileElem(self.users[i]));

				}
				Hatena.Diary.Util.updateDynamicPieces([document]);
//				setTimeout(function() {
//					Hatena.Diary.Util.updateDynamicPieces([document]);
//				}, 500);
			},
			makeProfileElem:function (authorID){
				var name_span = document.createElement("span");
				var name_img = document.createElement("img");
				var name_a = document.createElement("a");
				name_span.setAttribute("data-load-nickname", "1");
				name_span.setAttribute("data-user-name", authorID);
				name_span.innerText = "id:" + authorID;

				name_img.setAttribute("src", "http://cdn1.www.st-hatena.com/users/" + authorID.substr( 0, 2 ) + "/" + authorID + "/profile.gif");
				name_img.setAttribute("width", "16");
				name_img.setAttribute("height", "16");
				name_img.setAttribute("class", "profile-icon");

				name_a.setAttribute("href", "http://profile.hatena.ne.jp/" + authorID + "/");
				name_a.appendChild(name_img);
				name_a.appendChild(name_span);
				return name_a;
			}

	}

	window.addEventListener("DOMContentLoaded", function(){
		var dataPage = document.querySelector("html").getAttribute("data-page");
		if (dataPage === "about") Htnpsne.AddAuthor.disp();
	}, false);
	*/
})();