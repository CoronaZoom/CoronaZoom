var HOME_PATH = window.HOME_PATH || '.';

var mapDiv = document.getElementById('map');
var map = new naver.maps.Map(mapDiv, {
  zoom: 8,
  center: new naver.maps.LatLng(36.0207091, 127.9204629)
});

var datalist = new Array();
//var dotmap;
var dotmap_t1; //24시간 미만
var dotmap_t2;//24시간 이상 ~ 4일 미만
var dotmap_t3; //4일 이상 ~ 9일 이하

var z, m, d;

var today = new Date("2020-05-31");
var prev_1day = new Date("2020-05-30");
var prev_4day = new Date("2020-05-27");
var prev_9day = new Date("2020-05-22");

var visitDatelist = new Array();

var t1 = new Array();
var t2 = new Array();
var t3 = new Array();
//ajax...
naver.maps.Event.once(map, 'init_stylemap', function() {
  jb5.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/ConfirmerVisitedPlaces',
     type: 'GET',
     crossOrigin: true,
     //async:false,
     success: startDotMap
  });
});

// 전체: 격리 중 + 격리 해제 + 사망
// 처음 세팅: 전체 상태 출력
function startDotMap(data) {
  var listLen = data.length;
  datalist = data;
  console.log("파싱성공");
  var x, y;
  var test = [x, y];
  var str;
  var j = 0;
  var idx_t1 = new Array();
  var idx_t2 = new Array();
  var idx_t3 = new Array();

  for(var i=0;i<listLen;i++){
    str = data[i]['VisitDate'].split('T');
    z = str[0].substr(0,4);
    m = str[0].substr(5,2);
    d = str[0].substr(8,2);
    strdate = new Date(z, m-1, d);
    visitDatelist[i] = strdate; //console.log(test);  // 어떻게 저장되는지 확인
  }
  for(var i=0;i<listLen;i++){//24시간미만
    if(prev_1day < visitDatelist[i] && visitDatelist[i] <= today) {
      test = [data[i]['Lat'], data[i]['Lon']];
      t1[j++] = test;
    }
  }
  j = 0;
    for(var i=0;i<listLen;i++){//24시간 이상 ~ 4일 미만
      if(prev_4day < visitDatelist[i] && visitDatelist[i] <= prev_1day) {
      test = [data[i]['Lat'], data[i]['Lon']];
      t2[j++] = test;
    }
  }
  j = 0;
    for(var i=0;i<listLen;i++){ //4일 이상 ~ 9일 이하
      if(prev_9day <= visitDatelist[i] && visitDatelist[i] <= prev_4day) {
      test = [data[i]['Lat'], data[i]['Lon']];
      t3[j++] = test;
    }
  }
  // 24시간 미만
  dotmap_t1 = new naver.maps.visualization.DotMap({
    map: map,
    data: t1,
    fillColor: '#FF0000',
    opacity: 1,
    radius: 3
  });
  // 24시간 이상~4일 미만
  dotmap_t2 = new naver.maps.visualization.DotMap({
    map: map,
    data: t2,
    fillColor: '#51ff00',
    opacity: 1,
    radius: 3
  });
  // 4일 이상 ~ 9일 이하
  dotmap_t3 = new naver.maps.visualization.DotMap({
    map: map,
    data: t3,
    fillColor: '#0000ff',
    opacity: 1,
    radius: 3
  });
}
