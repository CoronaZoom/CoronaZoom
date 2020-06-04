jb1(document).ready(function(){
  jb1.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/TotalCase',
     type: 'GET',
     crossOrigin: true,
     //dataType: 'json',
     //async: false,
     //cache: false,
     success: function(data){
       //alert("성공!");
         jb1("#totalnum").append(data[0]['SUM(TotalCase)']);
     },
     error: function(request,status,error){
             alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
     }
   });
});

jb1(document).ready(function(){
   /*$.getJSON('http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/NowCase',
     function(data){
       console.log(data[0]['NowCase']);
       $("#nownum").append(data[0]['NowCase']);
     }
   );*/
   jb1.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/NowCase',
      type: 'GET',
      crossOrigin: true,
      //dataType: 'json',
      //async: false,
      //cache: false,
      success: function(data){
        //alert("성공!");
          //var obj = JSON.stringify(data);
          //console.log("요청 성공시 호출") ;

          //$.parseJSON
        //  var list = JSON.parse(data);
        //  var listLen = list.length;
        //  var contentStr = "";
        //  for(var i=0; i<listLen; i++){
        //    contentStr += list[i].NowCase+"</br>";
        //  }
          jb1("#nownum").append(data[0]['NowCase']);

          //$('#totalnum').append(obj.getArray("NowCase"));
          //});
          },
          error: function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          }
        });
      });

jb1(document).ready(function(){
 jb1.ajax({
   url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/TotalRecovered',
    type: 'GET',
    crossOrigin: true,
    //dataType: 'json',
    //async: false,
    //cache: false,
    success: function(data){
      //alert("성공!");
        jb1("#totalrecov").append(data[0]['SUM(TotalRecovered)']);
        },
        error: function(request,status,error){
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
      });
});

jb1(document).ready(function(){
  jb1.ajax({
    url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/NowChecking',
     type: 'GET',
     crossOrigin: true,
     //dataType: 'json',
     //async: false,
     //cache: false,
     success: function(data){
       //alert("성공!");
       jb1("#nowchecking").append(data[0]['NowChecking']);
         },
         error: function(request,status,error){
           alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
         }
       });
});

jb1(document).ready(function(){
   jb1.ajax({
     url: 'http://ec2-13-125-253-144.ap-northeast-2.compute.amazonaws.com:3000/api/CoronaTotalStatus/TotalDeath',
      type: 'GET',
      crossOrigin: true,
      //dataType: 'json',
      //async: false,
      //cache: false,
      success: function(data){
        //alert("성공!");
        jb1("#death").append(data[0]['SUM(TotalDeath)']);
          },
          error: function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          }
        });
 });
