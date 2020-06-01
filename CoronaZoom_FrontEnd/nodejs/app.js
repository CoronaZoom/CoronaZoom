var express = require('express');
var dbConObj = require('./dbConn.js');
var dbconn = dbConObj.init();
var cors = require('cors');

var app = express();

app.use(cors());

app.get('/', function(req, res){
  res.send('Root');
});

function handleDisconnect() {
  dbconn.connect(function(err){
    if(err) {
      console.log('error when connection to db:',err);
      setTimeout(handleDisconnect,2000);
    }
  });

  dbconn.on('error',function(err){
    console.log('db error',error);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    }else {
      throw err;
    }
  });
}

handleDisconnect();

/**************************** API ****************************/

// 국내 코로나 현황 가져오기
app.get('/api/CoronaTotalStatus', function(req, res){
  dbconn.query('SELECT * from CoronaTotalStatus;', function(err, rows) {
    if(err) throw err;

    //console.log('The solution is: ', rows);
    res.send(rows);
  });
});

//총 확진자 수
app.get('/api/CoronaTotalStatus/TotalCase', function(req, res){
  dbconn.query('SELECT SUM(TotalCase) from CoronaTotalStatus;', function(err, rows) {
    if(err) throw err;
    res.send(rows);
  });
});

//현재(최근) 격리자 수
app.get('/api/CoronaTotalStatus/NowCase', function(req, res){
  dbconn.query('SELECT NowCase from CoronaTotalStatus ORDER BY UpdateDateTime DESC LIMIT 1;', function(err, rows) {
    if(err) throw err;
    res.send(rows);
  });
});

//격리 해제 수
app.get('/api/CoronaTotalStatus/TotalRecovered', function(req, res){
  dbconn.query('SELECT SUM(TotalRecovered) from CoronaTotalStatus;', function(err, rows) {
    if(err) throw err;
    res.send(rows);
  });
});

//검사 진행
app.get('/api/CoronaTotalStatus/NowChecking', function(req, res){
  dbconn.query('SELECT NowChecking from CoronaTotalStatus ORDER BY UpdateDateTime DESC LIMIT 1;', function(err, rows) {
    if(err) throw err;
    res.send(rows);
  });
});

//총 사망자 수
app.get('/api/CoronaTotalStatus/TotalDeath', function(req, res){
  dbconn.query('SELECT SUM(TotalDeath) from CoronaTotalStatus;', function(err, rows) {
    if(err) throw err;
    res.send(rows);
  });
});

// 지역별 코로나 현황 가져오기
app.get('/api/CoronaCityStatus', function(req, res){
  const r_id = req.query.R_id;
  var param = ' WHERE R_id='+r_id+';';

  if(r_id!=null) {
    dbconn.query('SELECT * from CoronaCityStatus'+param, function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }
  else {
    dbconn.query('SELECT * from CoronaCityStatus;', function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }
});

// 확진자 정보 가져오기
//  /api/ConfirmerInfo?Sex=F&MinBirth=1970&MaxBirth=2000&MinDate=2020-03-01&MaxDate=2020-05-31&Status=격리중
app.get('/api/ConfirmerInfo', function(req, res){
  const sex = req.query.Sex;
  const minBirth = req.query.MinBirth;
  const maxBirth = req.query.MaxBirth;
  const minDate = req.query.MinDate;
  const maxDate = req.query.MaxDate;
  const status = req.query.Status;

  var param = ' WHERE ';
  var param_cnt=0;

  if(sex != null) {
    param += 'Sex = "' + sex +'"';
    param_cnt ++;
  }

  if(minBirth != null && maxBirth != null) {
    if(param_cnt>=1) {
      param += ' AND';
    }
    param += ' (BirthYear BETWEEN '+ minBirth + ' AND ' + maxBirth + ')';
    param_cnt ++;
  }

  if(minDate != null && maxDate != null) {
    if(param_cnt>=1) {
      param += ' AND';
    }
    param += ' (ConfirmDate BETWEEN "'+ minDate + '" AND "' + maxDate + '")';
    param_cnt ++;
  }

  if(status!= null) {
    if(param_cnt>=1) {
      param += ' AND';
    }
    param += ' Status = "'+ status + '"';
    param_cnt ++;
  }

  //res.send(req.query);
  param+=";";

  if(param_cnt>0) {
    dbconn.query('SELECT * from ConfirmerInfo'+param, function(err, rows) {
      if(err) throw err;

      //console.log('The solution is: ', rows);
      res.send(rows);
    });
  }
  else {
    dbconn.query('SELECT * from ConfirmerInfo', function(err, rows) {
      if(err) throw err;

      //console.log('The solution is: ', rows);
      res.send(rows);
    });
  }
});

// 지역 정보 가져오기
app.get('/api/RegionInfo', function(req, res){
  dbconn.query('SELECT * from RegionInfo;', function(err, rows) {
    if(err) throw err;

    //console.log('The solution is: ', rows);
    res.send(rows);
  });
});

// 확진자 방문 장소 정보 가져오기
app.get('/api/ConfirmerVisitedPlaces', function(req, res){
  const c_id = req.query.C_id;
  var param = ' WHERE C_id='+c_id+';';

  if(c_id!=null) {
    dbconn.query('SELECT * from ConfirmerVisitedPlaces'+param, function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }
  else {
    dbconn.query('SELECT * from ConfirmerVisitedPlaces;', function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }

});

// 근처 선별진료소 정보 가져오기
app.get('/api/HospitalInfo', function(req, res){
  const r_id = req.query.R_id;
  var param = ' WHERE R_id='+r_id+';';

  if(r_id!=null) {
    dbconn.query('SELECT * from HospitalInfo'+param, function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }
  else {
    dbconn.query('SELECT * from HospitalInfo;', function(err, rows) {
      if(err) throw err;
      res.send(rows);
    });
  }
});

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
