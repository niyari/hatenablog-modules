/*

* �͂Ăȃu���O�̋L���̓��t�ɗj����\������

** �g����

�ȉ����R�s�[���āA�f�U�C���ҏW �� �J�X�^�}�C�Y �� �t�b�^HTML �ɓ\��t��

<script src="http://niyari.github.io/hatenablog-modules/date-to-week.js" charset="utf-8"></script>

�͂Ăȃu���O�̓��t���Z�܂��Ă��鏊�ɁuSun�v�uMon�v�c �Ƃ������j����}�����܂�
date-week��date-week-�j��(ex:date-week-Sun)�Ƃ����N���X����������̂�
���j�����F��ς�����摜�ɂ��Ă݂���F�X�ł���悤�ɂȂ�Ǝv���܂�
�ǂ��������p��������

�ڍׂ́A���Ȃ΂����� �֏����\��ł��B
http://psn.hatenablog.jp/

*/

(function(){
	datetimeEle = document.querySelectorAll('[datetime]');
	for (var i = 0; i < datetimeEle.length; i++){
		datetimeEle[i].appendChild(DateToWeek(datetimeEle[i].getAttribute("datetime")));
	}
	function DateToWeek(day){
		if(typeof day === "undefined"){return ""}
		day = day.substr(0,10);
		var d = new Date(day);
		var w = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var el = document.createElement("span");
		var str = document.createTextNode(w[d.getDay()]);
		el.setAttribute("class", "date-week");
		el.setAttribute("class", "date-week-" + str.data);
		el.appendChild(str);
		return el;
	}
})();
