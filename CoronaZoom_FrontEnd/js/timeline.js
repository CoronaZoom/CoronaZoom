
// 검색 옵션과의 충돌을 막기 위해 체크박스 이용
// 우선 enable/disable만 구현해뒀고
// 구체적으로 충돌을 막는 기능을 추가할 예정입니다
jb2("#timeline-enabled").click(function() {
	if(this.checked) {
		slider.enable();
	}
	else {
		slider.disable();
	}
});

// Without JQuery
// timeline 기본 세팅
// 현재를 기준으로 한달(31일)전까지의 기록만 보여줌(한달전~오늘)
var slider = new Slider("#timeline", {
  step: 1,
	min: 0,
	max: 30,
  value: 0,
  enabled: false
});

// yyyy년 MM월 dd일 포맷으로 출력하기 위해 변환해주는 함수
function getFormatDate(date){
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '년 ' + month + '월 ' + day + '일';
}

var tldate, tlstart;

slider.on("slide", function(sliderValue) {
  // 오늘 날짜
  var tltoday = new Date();
  console.log(tltoday);
  // 오늘 날짜기준으로 31일 전의 날짜 = tlstart
  // tlstart부터 +1씩 = tldate
  tldate = new Date(tltoday.getFullYear(), tltoday.getMonth(), tltoday.getDate() - 30 + sliderValue);
  tlstart = new Date(tltoday.getFullYear(), tltoday.getMonth(), tltoday.getDate() - 30);
  var strdate = getFormatDate(tldate);
  // index.html로 값을 넘겨주어 출력
  document.getElementById("timelineSliderVal").textContent = strdate;
  // 슽라이더가 움직일 때마다 지도를 새로 찍음 -> 이래서 느릴 수도..
  timelinereDotMap(); // dotmap.js에 있는 함수
});

// dotmap.js로 값을 넘겨주기 위한 함수
function tldateReturn(){
  return tldate;
}

function tlstartReturn(){
  return tlstart;
}

// With JQuery
//$("#timeline").slider({
//  step: 20000,
//  min: 0,
//  max: 200000,
//  ticks: [0, 100, 200, 300, 400],
//  ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
//  ticks_snap_bounds: 30
//});
