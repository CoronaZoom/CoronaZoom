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

var datalist = new Array();
var listLen;
var loc;
var address = '';
var address2 = '';
var htmlAddresses = [];
var sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
    var marker = new naver.maps.Marker({
      position: location,
      map: map});
    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(15); // 지도의 줌 레벨을 변경합니다.
    marker.setPosition(location);
    loc = location;
    //console.log(loc['_lat']);

    var contentString = [
            '<div class="iw_inner">',
            '   <br><h5>　현재위치　</h5>',
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

    jb5.ajax({
       url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/RegionInfo',
       type: 'GET',
       crossOrigin: true,
       //async:false,
       success: findRegion
    });
}

function findRegion(data){
  listLen = data.length;
  datalist = data;
  console.log("지역번호찾기");

  var x, y;
  x = parseFloat(location.x);
  y = parseFloat(location.y);

  ToAddress(loc);
}

function onErrorGeolocation() {
    var center = map.getCenter();
}

getLocation();

var r_id = new Array();

function getr_id(data){
  var listLen = data.length;
  console.log("id받아오기")
  //var nowlocation = locationReturn();

  r_id = data['sig_cd'];
  var r_idlist = new Array();
  r_idlist = r_idReturn();

}

function getr(a){
  r_id = a;
}

function r_idReturn(){
  return r_id;
}

function ToAddress(latlng) {
    naver.maps.Service.reverseGeocode({
        coords: latlng,
        orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ].join(',')
    }, function(status, response) {
      console.log("주소로 변환");
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        var items = response.v2.results;
        var s, g;

        for (var i=0, ii=items.length, item, addrType; i<ii; i++) {
            item = items[i];
            address = strAddress(item) || '';
            s = address.split(' ', 4);
            //console.log(s);
            addrType = item.name === 'roadaddr' ? '[도로명 주소]' : '[지번 주소]';

            htmlAddresses.push(address);
            //console.log(htmlAddresses);
        }

        var arr = s[0] + ' ' + s[1];
        //console.log(arr);
        //console.log(datalist);
        for(var i=0;i<listLen;i++){
          if(datalist[i]['City'] == arr){
            //console.log(arr);
            r_id = datalist[i]['R_id'];
          }
        }
        //console.log(r_id);
        hospitalprint(r_id);
    });
}

function strAddress(item) {
    if (!item) {
        return;
    }

    var name = item.name,
        region = item.region,
        land = item.land,
        isRoadAddress = name === 'roadaddr';


    if (hasArea(region.area1)) {
        sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === '2') {
                rest += '산';
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += ('-' + land.number2);
            }
        }

        if (isRoadAddress === true) {
            if (checkLastString(dongmyun, '면')) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = '';
            }

            if (hasAddition(land.addition0)) {
                rest += ' ' + land.addition0.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(' ');
}


var hsdatalist, hslistLen;

jb5(document).ready(function(){
  jb5.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/HospitalInfo',
     type: 'GET',
     crossOrigin: true,
     //async:false,
     success: starthospital
  });
});

function starthospital(data){
  hslistLen = data.length;
  hsdatalist = data;
}

function hospitalprint(r_id){
  console.log("hospital 파싱성공");

  var name = new Array();
  var phone = new Array();
  var p;

  var r_idlist = new Array();

  var j = 0;
  //console.log(hsdatalist);

  //console.log(r_id);
  for(var i=0;i<hslistLen;i++){
    if(r_id == hsdatalist[i]['R_id']){
      name[j] = hsdatalist[i]['H_name'];
      p = hsdatalist[i]['Phone'];
      if(p[0] == '-')
      {
        p = p.substr(1,);
      }
      phone[j++] = p;
    }
  }
  //console.log(name);  // 어떻게 저장되는지 확인

  var hospitallist = new Array(2);
  hospitallist[0] = name;
  hospitallist[1] = phone;

  var resultlist = "";

  for(var i=0;i<hospitallist[0].length;i++){
    resultlist += (i+1) + '. ' + hospitallist[0][i] + ' (전화번호: ' + hospitallist[1][i] + ')' + '<br/>' + '<br/>';
  }

  //console.log(resultlist);

  document.getElementById("hospitallist").innerHTML = resultlist;

}

function r_idReturn(){
  return r_idlist;
}
