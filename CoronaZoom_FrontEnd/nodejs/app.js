var express = require('express');
var app = express();
var db = require('./dbConn.js');


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
