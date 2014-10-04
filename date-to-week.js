/*

* はてなブログの記事の日付に曜日を表示する

** 使い方

以下をコピーして、デザイン編集 → カスタマイズ → フッタHTML に貼り付け

<script src="http://niyari.github.io/hatenablog-modules/date-to-week.js" charset="utf-8"></script>

はてなブログの日付が纏まっている所に「Sun」「Mon」… といった曜日を挿入します
date-weekとdate-week-曜日(ex:date-week-Sun)というクラスを持たせるので
日曜だけ色を変えたり画像にしてみたり色々できるようになると思います
どうぞご利用ください

詳細は、すなばいじり へ書く予定です。
http://psn.hatenablog.jp/

*/

(function(){
	datetimeEle = document.querySelectorAll('[datetime]');
	for (var i = 0; i < datetimeEle.length; i++){
		datetimeEle[i].appendChild(DateToWeek(datetimeEle[i].getAttribute("datetime")));
	}
	function DateToWeek(day){
		if(typeof day === "undefined"){return ""}
		//day = day.substr(0,10);
		var d = new Date(day);
		if(typeof d === "undefined" || isNaN( d ) ){return ""}
		var w = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var el = document.createElement("span");
		var str = document.createTextNode(w[d.getDay()]);
		el.setAttribute("class", "date-week date-week-" + str.data);
		el.appendChild(str);
		return el;
	}
})();
