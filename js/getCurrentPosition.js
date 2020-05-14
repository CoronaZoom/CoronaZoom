function getLocation() {
  if (navigator.geolocation) { // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      // 위도 경도 표시 창 alert(latitude + ' ' + longitude);
    }, function(error) {
      console.error(error);
    }, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: Infinity
    });
    navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
  } else {
    alert('GPS를 지원하지 않습니다');
  }
}

function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
    var marker = new naver.maps.Marker({
      position: location,
      map: map});
    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(15); // 지도의 줌 레벨을 변경합니다.
    marker.setPosition(location);

    var contentString = [
            '<div class="iw_inner">',
            '   <h5>현재위치</h5>',
            '   <p>~~~~<br />',
            '   </p>',
            '</div>'
        ].join('');

    var infowindow = new naver.maps.InfoWindow({
        content: contentString
    });

    naver.maps.Event.addListener(marker, "click", function(e) {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }
    });
    infowindow.open(map, marker);
}

function onErrorGeolocation() {
    var center = map.getCenter();
}

getLocation();
