/*

* はてなブログの記事の日付に曜日を表示する

** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<script src="//niyari.github.io/hatenablog-modules/date-to-week.js" charset="utf-8"></script>

はてなブログの日付が纏まっている所に「Sun」「Mon」… といった曜日を挿入します
date-weekとdate-week-曜日(ex:date-week-Sun)というクラスを持たせるので
日曜日だけ色を変えたり画像にしてみたり色々できるようになると思います

** 一歩進んだ使い方

表示する文字列を「Sun」から「日」という様に変更する

<script src="//niyari.github.io/hatenablog-modules/date-to-week.js" charset="utf-8"></script>
<script>
Htnpsne.DateToWeek.init(["日","月","火","水","木","金","土"]);
</script>

上記のように設定できます

どうぞご利用ください。

詳しい設置方法や詳細は、すなばいじり をご覧ください。
http://psn.hatenablog.jp/entry/discover-hatena

*/

(function(){
	if (typeof(Htnpsne) == 'undefined') Htnpsne = {};

	Htnpsne.DateToWeek = {
		display : false,
		w : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
		selector : '.date [datetime]',
		init : function(weektext){
			var self = Htnpsne.DateToWeek;
			for (var i = 0; i < weektext.length; i++){
				self.w[i]=weektext[i];
			}
		},
		disp : function(){
			var self = Htnpsne.DateToWeek;
			var datetimeEle = document.querySelectorAll(self.selector);
			for (var i = 0; i < datetimeEle.length; i++){
				console.log(datetimeEle[i]);
				datetimeEle[i].appendChild(self.date2week(datetimeEle[i].getAttribute("datetime")));
			}
			self.display = true;
		},
		date2week : function(day){
			var wClass = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			if(typeof day === "undefined"){return ""}
			var d = new Date(day);
			if(typeof d === "undefined" || isNaN( d ) ){return ""}

			var self = Htnpsne.DateToWeek;
			var el = document.createElement("span");
			var day = d.getDay();
			var str = document.createTextNode(self.w[day]);
			el.setAttribute("class", "date-week date-week-" + wClass[day]);
			el.appendChild(str);
			return el;
		}

	}
	window.addEventListener("DOMContentLoaded", function(){
		if(!Htnpsne.DateToWeek.display) Htnpsne.DateToWeek.disp();
	}, false);

})();
