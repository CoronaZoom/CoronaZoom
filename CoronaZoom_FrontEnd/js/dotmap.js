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
      //console.log(statusValue[i]);
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
  var arr3 = new Array(); // calendar

  var age = document.getElementById("age");
  var sex = document.getElementById("sex");
  var startDate = document.getElementById("startDate");
  var endDate = document.getElementById("endDate");

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
  var str;
  var y, m, d;
  var strdate;
  var start, end;
  var confirmDatelist = new Array();
  for(var i=0;i<listLen;i++) {
    // ConfirmDate 형식: 2020-05-09T00:00:00.000Z
    // T 기준으로 날짜만 받아오기
    str = data[i]['ConfirmDate'].split('T');
    y = str[0].substr(0,4);
    m = str[0].substr(5,2);
    d = str[0].substr(8,2);
    strdate = new Date(y, m-1, d);
    confirmDatelist[i] = strdate;
  }

  y = startDate.value.substr(0,4);
  m = startDate.value.substr(5,2);
  d = startDate.value.substr(8,2);
  start = new Date(y, m-1, d);

  y = endDate.value.substr(0,4);
  m = endDate.value.substr(5,2);
  d = endDate.value.substr(8,2);
  end = new Date(y, m-1, d);

  // startDate 이후 endDate 이전
  for(var i=0;i<listLen;i++) {
    if(start <= confirmDatelist[i] && end >= confirmDatelist[i]) {
      test = [data[i]['Latitude'], data[i]['Longitude']];
      arr3[i] = test;
      continue;
    }
    else{
      arr3[i] = 0;
    }
  }


  // 옵션 적용된 최종 상태별 데이터 저장
  var result_i = new Array();
  var result_ui = new Array();
  var result_d = new Array();

  var ii = 0, iui = 0, id = 0;

  for(var i=0;i<listLen;i++){
    // age와 sex 조건 + 캘린더 기간 + 격리중 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && arr3[i] != 0 && idx_i[i] != 0){
      result_i[ii++] = arr1[i];
    }
    // age와 sex 조건 + 캘린더 기간 + 격리해제 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && arr3[i] != 0 && idx_ui[i] != 0){
      result_ui[iui++] = arr1[i];
    }
    // age와 sex 조건 + 캘린더 기간 + 사망 상태의 교집합만 저장
    if(arr1[i] != 0 && arr2[i] != 0 && arr3[i] != 0 && idx_d[i] != 0){
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


////////// 타임라인바용 reDotMap //////////

// 슬라이더가 움직일 때마다 호출되어 점찍음
function timelinereDotMap() {
  console.log("탐라 점찍기");

  var arr = new Array();
  // 타임라인바에 맞는 데이터 세팅
  arr = timelinebar(datalist);

  var chk = document.getElementsByName("chk");
  var statusValue = new Array();

  // 어떤 상태가 체크됐는지 확인
  for(var i=0;i<4;i++) {
    statusValue[i] = chk[i].value;
    if(chk[i].checked == true) {
      //console.log(statusValue[i]);
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

// 오늘을 기준으로 31일 전까지의 데이터를 보여줌
// 타임라인바에 맞는 데이터 저장
function timelinebar(data) {
  var listLen = data.length; // ConfirmerInfo 길이

  var x, y;
  var test = [x, y];
  var arr3 = new Array(); // slider

  var startDate = document.getElementById("startDate");
  var endDate = document.getElementById("endDate");

  ////////// 슬라이더 값 //////////
  var str;
  var y, m, d;
  var strdate;
  var date, tltoday;
  var confirmDatelist = new Array();
  for(var i=0;i<listLen;i++) {
    // ConfirmDate 형식: 2020-05-09T00:00:00.000Z
    // T 기준으로 날짜만 받아오기
    str = data[i]['ConfirmDate'].split('T');
    y = str[0].substr(0,4);
    m = str[0].substr(5,2);
    d = str[0].substr(8,2);
    strdate = new Date(y, m-1, d);
    confirmDatelist[i] = strdate;
  }

  // timeline.js에서 점이 찍힐 날짜의 범위를 받아옴
  end = tldateReturn();
  start = tlstartReturn();
  //console.log("date: "+end);

  // startDate 이후 endDate 이전
  for(var i=0;i<listLen;i++) {
    if(start <= confirmDatelist[i] && end >= confirmDatelist[i]) {
      test = [data[i]['Latitude'], data[i]['Longitude']];
      arr3[i] = test;
      continue;
    }
    else{
      arr3[i] = 0;
    }
  }
  // 하루씩만: if(+date == +confirmDatelist[i]) {


  // 옵션 적용된 최종 상태별 데이터 저장
  var result_i = new Array();
  var result_ui = new Array();
  var result_d = new Array();

  var ii = 0, iui = 0, id = 0;

  for(var i=0;i<listLen;i++){
    // 타임라인바 + 격리중 상태의 교집합만 저장
    if(arr3[i] != 0 && idx_i[i] != 0){
      result_i[ii++] = arr3[i];
    }
    // 타임라인바 + 격리해제 상태의 교집합만 저장
    if(arr3[i] != 0 && idx_ui[i] != 0){
      result_ui[iui++] = arr3[i];
    }
    // 타임라인바 + 사망 상태의 교집합만 저장
    if(arr3[i] != 0 && idx_d[i] != 0){
      result_d[id++] = arr3[i];
    }
  }

  // 배열로 넘겨주기
  var result = new Array();
  result[0] = result_i;
  result[1] = result_ui;
  result[2] = result_d;
  //console.log(result);

  return result;
}


///////////// 상태버튼, 검색옵션 실행 시 작동하는 함수
function status(){
  // 타임라인바 사용시엔 timelinebar에 상태 적용
  if(usableReturn() == 1)
  {
    timelinereDotMap();
  }
  // 타임라인바 사용X시엔 검색옵션에 상태 적용
  else {
    reDotMap();
  }
}

function searchoption(){
  // 타임라인바 사용시엔 검색옵션 적용X
  if(usableReturn() == 1)
  {
  }
  else {
    reDotMap();
  }
}

// 검색옵션 초기화
function optionreset(){
  jb2('#age').val('7');
  jb2('#sex').val('2');
  jb2('#startDate').datepicker("setDate", new Date("2020-01-01"));
  jb1('#endDate').datepicker("setDate", new Date());
  if(usableReturn() == 1)
  {
  }
  else {
    reDotMap();
  }
}
