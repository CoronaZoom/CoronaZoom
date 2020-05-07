// size 옵션이 생략되면 map DOM 요소의 HTML 렌더링 크기로 자동으로 조정됩니다.
var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5666805, 126.9784147),
    zoom: 13,
    minZoom: 6,
    mapTypeId: naver.maps.MapTypeId.HYBRID,
    zoomControl: true,
    zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
    },
    mapDataControl: false,
    logoControlOptions: {
        position: naver.maps.Position.LEFT_BOTTOM
    },
    disableKineticPan: false
});

var semaphore = false;

naver.maps.Event.once(map, 'init_stylemap', function() {
    map.setOptions({
        mapTypeControl: true,
        scaleControl: false,
        logoControl: false
    });

    // 미니 맵이 들어갈 HTML 요소를 controls 객체에 추가합니다. 가장 오른쪽 아래에 위치하도록 다른 옵션들을 잠시 끕니다.
    map.controls[naver.maps.Position.BOTTOM_RIGHT].push($("#minimap")[0]);
    map.setOptions({
        scaleControl: true,
        logoControl: true,
    });

    var minimap = new naver.maps.Map('minimap', { //미니 맵 지도를 생성합니다.
        bounds: map.getBounds(),
        scrollWheel: false,
        scaleControl: false,
        mapDataControl: false,
        logoControl: false
    });

    naver.maps.Event.addListener(map, 'bounds_changed', function(bounds) {
        if (semaphore) return;

        minimap.fitBounds(bounds);
    });
    naver.maps.Event.addListener(map, 'mapTypeId_changed', function(mapTypeId) {
        var toTypes = {
            "normal": "hybrid",
            "terrain": "satellite",
            "satellite": "terrain",
            "hybrid": "normal"
        };

        minimap.setMapTypeId(toTypes[mapTypeId]);
    });
    naver.maps.Event.addListener(minimap, 'drag', function() {
        semaphore = true;
        map.panTo(minimap.getCenter());
        naver.maps.Event.once(map, 'idle', function() {
            semaphore = false;
        });

    });
});
