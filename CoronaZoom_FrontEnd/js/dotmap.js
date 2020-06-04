var HOME_PATH = window.HOME_PATH || '.';

var mapDiv = document.getElementById('map');
var map = new naver.maps.Map(mapDiv, {
  zoom: 8,
  center: new naver.maps.LatLng(36.0207091, 127.9204629)
});
//ajax...
naver.maps.Event.once(map, 'init_stylemap', function() {
  jb2.ajax({
    url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/ConfirmerInfo',                                                    dataType: 'json',
    method:"get",
    crossOrigin: true,
    success: startDotMap
  });
});
function startDotMap(data) {
  var listLen = data.length;
  console.log("파싱성공");  // 디버깅 용

  // 네이버 earthquake.js의 coordinates 형태랑 같게 저장하기 위해 2차원 배열 arr 사용
  // arr[][x,y] 형태
  var x, y;
  var arr = new Array();
  var test = [x, y];
  for(var i=0;i<listLen;i++){
    test = [data[i]['Latitude'], data[i]['Longitude']];
    arr[i] = test;
    //console.log(test);  // 어떻게 저장되는지 확인
  }
  var dotmap = new naver.maps.visualization.DotMap({
    map: map,
    data: arr
  });
}
