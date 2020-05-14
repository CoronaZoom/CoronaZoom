var mysql = require('mysql');
var os = require('os');

var dbconnInfo = {
	test:{
		host: 'localhost',
		user: 'root',
		password: '0000',
		database: 'test0514',
	},
	develop:{
		host     : process.env.ENV_MYSQL_HOST,
		user     : process.env.ENV_MYSQL_USER,
		password : process.env.ENV_MYSQL_PASSWORD,
		database : 'testDB',
	}
};

var dbconnection = {
	init : function(){
		var hostname = os.hostname();
		if(hostname === 'DESKTOP-JMPL7B7'){ //슬기 컴퓨터
			console.log("Local Database Connect Succesfully!");
			return mysql.createConnection(dbconnInfo.test);	//Local Server
		}else{
			console.log("Develop Database Connect Succesfully!");
			return mysql.createConnection(dbconnInfo.develop);	//CoronaZoom Server\
		}
	},

	dbopen : function(con){
		con.connect(function(err){
			if(err){
				console.error("mysql connection error : " + err);
			}else{
				console.info("mysql connection successfully.");
			}
		});
	}
};

module.exports = dbconnection;
