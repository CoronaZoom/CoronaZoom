var HOME_PATH = window.HOME_PATH || '.';

var mapDiv = document.getElementById('map');
var map = new naver.maps.Map(mapDiv, {
  zoom: 8,
  center: new naver.maps.LatLng(36.0207091, 127.9204629)
});

var datalist = new Array();
//var dotmap;
var dotmap_i;
var dotmap_ui;
var dotmap_d;

var total = new Array();
var isolated = new Array();
var un_isolated = new Array();
var death = new Array();

var idx_i = new Array();
var idx_ui = new Array();
var idx_d = new Array();

//ajax...
naver.maps.Event.once(map, 'init_stylemap', function() {
  jb2.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/ConfirmerInfo',
     type: 'GET',
     crossOrigin: true,
     //async:false,
     success: startDotMap
  });
});

// 전체: 격리 중 + 격리 해제 + 사망
// 처음 세팅: 전체 상태 출력
function startDotMap(data) {
  var listLen = data.length; // ConfirmerInfo 길이
  datalist = data;
  console.log("파싱성공");

  var x, y;
  var test = [x, y];
  var j = 0;

  for(var i=0;i<listLen;i++){
    test = [data[i]['Latitude'], data[i]['Longitude']];
    total[i] = test;
    //console.log(test);  // 어떻게 저장되는지 확인
  }

  // idx: 검색 옵션 비교 인덱스로 사용
  for(var i=0;i<listLen;i++){
    if(data[i]['Status'] == "격리중") {
      test = [data[i]['Latitude'], data[i]['Longitude']];
      isolated[j++] = test;
      idx_i[i] = 1;
    }
    else {
      idx_i[i] = 0;
    }
  }

  j = 0;
  for(var i=0;i<listLen;i++){
    if(data[i]['Status'] == "격리해제") {
      test = [data[i]['Latitude'], data[i]['Longitude']];
      un_isolated[j++] = test;
      idx_ui[i] = 1;
    }
    else {
      idx_ui[i] = 0;
    }
  }

  j = 0;
  for(var i=0;i<listLen;i++){
    if(data[i]['Status'] == "사망") {
      test = [data[i]['Latitude'], data[i]['Longitude']];
      death[j++] = test;
      idx_d[i] = 1;
    }
    else {
      idx_d[i] = 0;
    }
  }

  // 격리 중 (빨강)
  dotmap_i = new naver.maps.visualization.DotMap({
    map: map,
    data: isolated,
    fillColor: '#FF0000',
    radius: 3
  });
  // 격리 해제 (파랑)
  dotmap_ui = new naver.maps.visualization.DotMap({
    map: map,
    data: un_isolated,
    fillColor: '#0000FF',
    radius: 3
  });
  // 사망 (검정)
  dotmap_d = new naver.maps.visualization.DotMap({
    map: map,
    data: death,
    fillColor: '#000000',
    radius: 3
  });
}

// 버튼 눌릴 때마다 호출되어 점찍기
function reDotMap() {
  console.log("다시 점찍기");

  var arr = new Array();
  arr = optionSelect(datalist);

  var chk = document.getElementsByName("chk");
  var statusValue = new Array();

  // 어떤 상태가 체크됐는지 확인
  for(var i=0;i<4;i++) {
    statusValue[i] = chk[i].value;
    if(chk[i].checked == true) {
      console.log(statusValue[i]);
      if(statusValue[i] == '0') {
        dotmap_i.setData(arr[0]);
        dotmap_i.setMap(map);
        dotmap_ui.setData(arr[1]);
        dotmap_ui.setMap(map);
        dotmap_d.setData(arr[2]);
        dotmap_d.setMap(map);
        break;
      }
      if(statusValue[i] == '1') {
        dotmap_i.setData(arr[0]);
        dotmap_i.setMap(map);
      }
      if(statusValue[i] == '2') {
        dotmap_ui.setData(arr[1]);
        dotmap_ui.setMap(map);
      }
      if(statusValue[i] == '3') {
        dotmap_d.setData(arr[2]);
        dotmap_d.setMap(map);
      }
    }
    // 선택 안된 건 지도에서 지우기
    if(chk[i].checked == false) {
      if(statusValue[i] == '0') {
        dotmap_i.setMap(null);
        dotmap_ui.setMap(null);
        dotmap_d.setMap(null);
      }
      if(statusValue[i] == '1') {
        dotmap_i.setMap(null);
      }
      if(statusValue[i] == '2') {
        dotmap_ui.setMap(null);
      }
      if(statusValue[i] == '3') {
        dotmap_d.setMap(null);
      }
    }
  }
  //dotmap.redraw();
}

// 검색 옵션에 맞는 데이터 저장
function optionSelect(data) {
  var listLen = data.length; // ConfirmerInfo 길이

  var x, y;
  var test = [x, y];
  var arr1 = new Array(); // age
  var arr2 = new Array(); // sex

  var age = document.getElementById("age");
  var sex = document.getElementById("sex");

  ////////// 검색 옵션: 나이 //////////
  // 선택된 option의 value가 저장된다.
  var ageValue = age.options[age.selectedIndex].value;
  // 선택된 option의 text가 저장된다.
  var ageText = age.options[age.selectedIndex].text;

  // 현재 년도로부터 확진자 나이 계산
  let today = new Date();
  let year = today.getFullYear(); // current year

  switch(ageValue){ // 2020 - confirmer_Birthyear + 1 로 계산
    case '0': // 1~10세 / 2020~2011생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 1 && year - data[i]['Birthyear'] + 1 <= 10) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '1': // 11~20세 / 2010~2001생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 11 && year - data[i]['Birthyear'] + 1 <= 20) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '2': // 21~30세 / 2000~1991생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 21 && year - data[i]['Birthyear'] + 1 <= 30) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '3': // 31~40세 / 1990~1981생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 31 && year - data[i]['Birthyear'] + 1 <= 40) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '4': // 41~50세 / 1980~1971생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 41 && year - data[i]['Birthyear'] + 1 <= 50) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '5': // 51~60세 / 1970~1961생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 51 && year - data[i]['Birthyear'] + 1 <= 60) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '6': // 61세 이상 / 1960~생
      for(var i=0;i<listLen;i++){
        if(year - data[i]['Birthyear'] + 1 >= 61) {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr1[i] = test;
        }
        else {
          arr1[i] = 0;
        }
      }
      break;
    case '7': // 전체
      arr1 = total;
      break;
  }

  ////////// 검색 옵션: 성별 //////////
  // 선택된 option의 value가 저장된다.
  var sexValue = sex.options[sex.selectedIndex].value;
  // 선택된 option의 text가 저장된다.
  var sexText = sex.options[sex.selectedIndex].text;

  switch(sexValue){
    case '0': // male
      for(var i=0;i<listLen;i++){
        if(data[i]['Sex'] == "M") {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr2[i] = test;
        }
        else {
          arr2[i] = 0;
        }
      }
      break;
    case '1': // female
      for(var i=0;i<listLen;i++){
        if(data[i]['Sex'] == "F") {
          test = [data[i]['Latitude'], data[i]['Longitude']];
          arr2[i] = test;
        }
        else {
          arr2[i] = 0;
        }
      }
      break;
    case '2': // 전체
      arr2 = total;
      break;
  }

  ////////// 검색 옵션: 기간 //////////
  //var dateControl = document.querySelector('input[type="date"]');

  // 옵션 적용된 최종 상태별 데이터 저장
  var result_i = new Array();
  var result_ui = new Array();
  var result_d = new Array();

  var ii = 0, iui = 0, id = 0;

  for(var i=0;i<listLen;i++){
    // age와 sex 조건 + 격리중 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && idx_i[i] != 0){
      result_i[ii++] = arr1[i];
    }
    // age와 sex 조건 + 격리해제 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && idx_ui[i] != 0){
      result_ui[iui++] = arr1[i];
    }
    // age와 sex 조건 + 사망 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && idx_d[i] != 0){
      result_d[id++] = arr1[i];
    }
  }

  // 배열로 넘겨주기
  var result = new Array();
  result[0] = result_i;
  result[1] = result_ui;
  result[2] = result_d;

  return result;
}
