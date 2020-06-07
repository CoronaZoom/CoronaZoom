var HOME_PATH = window.HOME_PATH || '.';

var mapDiv = document.getElementById('map');
var map = new naver.maps.Map(mapDiv, {
  zoom: 8,
  center: new naver.maps.LatLng(36.0207091, 127.9204629)
});

var datalist = new Array();
//var dotmap;
var dotmap_t1; //24시간 미만
var dotmap_t2; //24시간 이상 ~ 4일 미만
var dotmap_t3; //4일 이상 ~ 9일 이하

var today = new Date();
console.log(today);
var prev_4day = new Date();
prev_4day.setDate(prev_4day.getDate()-4);
var date;

var total = new Array();
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
  var j = 0;

  for(var i=0;i<listLen;i++){
    test = [data[i]['Lat'], data[i]['Lon']];
    total[i] = test;
    //console.log(test);  // 어떻게 저장되는지 확인
  }
  for(var i=0;i<listLen;i++){
    if(today <= (date=new Date(data[i]['VisitDate']))) {
      test = [data[i]['Lat'], data[i]['Lon']];
      t1[j++] = test;
    }
  }
  for(var i=0;i<listLen;i++){
    if(today >= date=new Date(data[i]['VisitDate') {
      test = [data[i]['Lat'], data[i]['Lon']];
      t2[j++] = test;
    }
  }
/*  for(var i=0;i<listLen;i++){
    if(data[i]['VisitDate'] <= "2020-06-03" && data[i]['VisitDate'] > "2020-05-27") {
      test = [data[i]['Lat'], data[i]['Lon']];
      t3[j++] = test;
    }
  }*/
  // 격리 중 (빨강)
  dotmap_t1 = new naver.maps.visualization.DotMap({
    map: map,
    data: tl,
    fillColor: '#FF0000',
    radius: 3
  });
  dotmap_t2 = new naver.maps.visualization.DotMap({
    map: map,
    data: t2,
    fillColor: '#000000',
    radius: 3
  });
/*  dotmap_t3 = new naver.maps.visualization.DotMap({
    map: map,
    data: t3,
    fillColor: '#0000FF',
    radius: 3
  });*/
  return result;
}
