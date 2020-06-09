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

var y, m, d;

var today = new Date("2020-06-01");
var prev_1day = new Date("2020-05-31");
var prev_4day = new Date("2020-05-28");
var prev_9day = new Date("2020-05-23");

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
    console.log(today);
      console.log(prev_1day);
          console.log(prev_4day);
              console.log(prev_9day);
  var x, y;
  var test = [x, y];
  var j = 0;
  var str;
  var y, m, d;
  var visitDatelist = new Array();

  for(var i=0;i<listLen;i++){
    str = data[i]['VisitDate'].split('T');
    y = str[0].substr(0,4);
    m = str[0].substr(5,2);
    d = str[0].substr(8,2);
    strdate = new Date(y, m-1, d);
    visitDatelist[i] = strdate; //console.log(test);  // 어떻게 저장되는지 확인
  }
  //24시간미만
  for(var i=0;i<listLen;i++){
    if(prev_1day < visitDatelist[i] && visitDatelist[i] <= today) {
      console.log(i);
      test = [data[i]['Lat'], data[i]['Lon']];
      t1[i] = test;
    }
  }
   //24시간 이상 ~ 4일 미만
  for(var i=0;i<listLen;i++){
    if(prev_4day < visitDatelist[i] && visitDatelist[i] <= prev_1day) {
      test = [data[i]['Lat'], data[i]['Lon']];
      t2[i] = test;
    }
  }
  //4일 이상 ~ 9일 이하
  for(var i=0;i<listLen;i++){
    if(prev_9day <= visitDatelist[i] && visitDatelist[i] <= prev_4day) {
      console.log(i);
      test = [data[i]['Lat'], data[i]['Lon']];
      t3[i] = test;
    }
  }
  // startDate 이후 endDate 이전

/*  for(var i=0;i<listLen;i++){
    if(data[i]['VisitDate'] <= "2020-06-03" && data[i]['VisitDate'] > "2020-05-27") {
      test = [data[i]['Lat'], data[i]['Lon']];
      t3[j++] = test;
    }
  }*/
  // 격리 중 (빨강)
  dotmap_t1 = new naver.maps.visualization.DotMap({
    map: map,
    data: t1,
    fillColor: '#FF0000',
    radius: 3
  });
  dotmap_t2 = new naver.maps.visualization.DotMap({
    map: map,
    data: t2,
    fillColor: '#000000',
    radius: 3
  });
  dotmap_t3 = new naver.maps.visualization.DotMap({
    map: map,
    data: t3,
    fillColor: '#0000FF',
    radius: 3
  });
  return result;
}
