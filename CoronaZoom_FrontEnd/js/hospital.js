
var hsdatalist, listLen;

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
  listLen = data.length;
  hsdatalist = data;
}

function hospitalprint(r_id){
  console.log("hospital 파싱성공");

  var name = new Array();
  var phone = new Array();
  var p;

  var r_idlist = new Array();

  var j = 0;
  console.log(hsdatalist);

  for(var i=0;i<listLen;i++){
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

  console.log(resultlist);

  document.getElementById("hospitallist").innerHTML = resultlist;

}

function r_idReturn(){
  return r_idlist;
}
