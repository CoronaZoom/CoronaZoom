var HOME_PATH = window.HOME_PATH || '.',
    urlPrefix = HOME_PATH +'/data/region',
    urlSuffix = '.json',
    regionGeoJson = [],
    loadCount = 0;

var map = new naver.maps.Map(document.getElementById('map'), {
    zoom: 7,
    mapTypeId: 'normal',
    center: new naver.maps.LatLng(36.4203004, 128.317960)
});

// alert('성공');

naver.maps.Event.once(map, 'init_stylemap', function () {
    for (var i = 1; i < 18; i++) {
        var keyword = i +'';

        if (keyword.length === 1) {
            keyword = '0'+ keyword;
        }
        //시도를 각각 저장한 region.json 파일 각각 받아와서
        $.ajax({
            url: 'https://raw.githubusercontent.com/4z7l/CoronaZoom_WEB/master/CoronaZoom_FrontEnd/testdata/region'+keyword+urlSuffix,   //urlPrefix + keyword + urlSuffix
            dataType: 'json',
            success: function(idx) {
                return function(geojson) {
                    regionGeoJson[idx] = geojson;

                    loadCount++;

                    if (loadCount === 17) {
                        startDataLayer();
                    }
                }
            }(i - 1)
        });
    }
});

var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');

tooltip.appendTo(map.getPanes().floatPane);
//폴리곤 그리기
function startDataLayer() {
    map.data.setStyle(function(feature) {
        var styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };

        if (feature.getProperty('focus')) {
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#0f0';
            styleOptions.strokeColor = '#0f0';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        }

        return styleOptions;
    });

    regionGeoJson.forEach(function(geojson) {
        map.data.addGeoJson(geojson);
    });
    //지역 클릭시에
    map.data.addListener('click', function(e) {
        var feature = e.feature;
        //클릭한 지역의 json파일에 저장해둔 region id와 region name을 변수에 저장
        var regionName = feature.getProperty('area1');
        var region_Id = feature.getProperty('r_id');
        //초기에 클릭안된 지역을 클릭시에
        if (feature.getProperty('focus') !== true) {
            feature.setProperty('focus', true);
            //각각의 id에 저장해서 카드 4개에 출력
            $("#regionname1").append(regionName);
            $("#regionname2").append(regionName);
            $("#regionname3").append(regionName);
            $("#regionname4").append(regionName);
            //지역코로나상태 api 불러오기
            $(document).ready(function(){
              $.ajax({
                url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaCityStatus',
                 type: 'GET',
                 crossOrigin: true,
                 //dataType: 'json',
                 //async: false,
                 //cache: false,
                 success: function(data){
                  // alert("성공!");
                   var listLen = data.length;
                   for(var i=0;i<listLen;i++) //데이터 길이만큼 돌리기
                   {
                     if(region_Id==data[i]['R_id']) 
                     //아까 받아온 클릭 지역의 아이디를 저장한 변수 region_id와
                     //지역코로나상태 api의 데이터의 R_id 값을 비교해 같은 값의
                     //확진자 수, 격리중 수, 격리해제 수, 사망 수를 각각 출력 
                     {
                       $("#totalnum").empty();
                       $("#totalnum").append(data[i]['RegionCase']);
                       $("#nownum").empty();
                       $("#nownum").append(data[i]['RegionNow']);
                       $("#totalrecov").empty();
                       $("#totalrecov").append(data[i]['RegionRecovered']);
                       $("#death").empty();
                       $("#death").append(data[i]['RegionDeath']);
                     }
                   }
                  },
                     error: function(request,status,error){
                       alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                     }
                   });
                 });
        }
        //클릭되어있는 지역을 다시 클릭시
         else {
            feature.setProperty('focus', false); 
            //각각의 카드 변수들을 지워줌
            $("#totalnum").empty();
            $("#nownum").empty();
            $("#totalrecov").empty();
            $("#death").empty();
            $("#regionname1").empty();
            $("#regionname2").empty();
            $("#regionname3").empty();
            $("#regionname4").empty();
            }
    });
    map.data.addListener('mouseover', function(e) {
        var feature = e.feature,
            regionName = feature.getProperty('area1');
        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);

        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    map.data.addListener('mouseout', function(e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });
}
