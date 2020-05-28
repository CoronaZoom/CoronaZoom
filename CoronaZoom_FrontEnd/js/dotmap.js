var HOME_PATH = window.HOME_PATH || '.';

var mapDiv = document.getElementById('map');
var map = new naver.maps.Map(mapDiv, {
  zoom: 8,
  center: new naver.maps.LatLng(36.0207091, 127.9204629)
});
//ajax...
naver.maps.Event.once(map, 'init_stylemap', function() {
  $.ajax({
    url: 'https://raw.githubusercontent.com/4z7l/CoronaZoom_WEB/master/CoronaZoom_FrontEnd/testdata/earthquake.json',                                                    dataType: 'json',
    method:"get",
    success: startDotMap
  });
});
function startDotMap(data) {
  var dotmap = new naver.maps.visualization.DotMap({
    map: map,
    data: data.coordinates
    });
  }
