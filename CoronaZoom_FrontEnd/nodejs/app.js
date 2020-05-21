var express = require('express');
var dbConObj = require('./dbConn.js');
var dbconn = dbConObj.init();
var app = express();

app.get('/', function(req, res){
  res.send('Root');
});

/**************************** API ****************************/

// 국내 코로나 현황 가져오기
app.get('/api/CoronaTotalStatus', function(req, res){
  dbconn.query('SELECT * from CoronaTotalStatus', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 지역별 코로나 현황 가져오기
app.get('/api/CoronaCityStatus', function(req, res){
  dbconn.query('SELECT * from CoronaCityStatus', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 확진자 정보 가져오기
app.get('/api/ConfirmerInfo', function(req, res){
  dbconn.query('SELECT * from ConfirmerInfo', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 지역 정보 가져오기
app.get('/api/RegionInfo', function(req, res){
  dbconn.query('SELECT * from RegionInfo', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 확진자 방문 장소 정보 가져오기
app.get('/api/ConfirmerVisitedPlaces', function(req, res){
  dbconn.query('SELECT * from ConfirmerVisitedPlaces', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 근처 선별진료소 정보 가져오기
app.get('/api/HospitalInfo', function(req, res){
  dbconn.query('SELECT * from HospitalInfo', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
});


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
