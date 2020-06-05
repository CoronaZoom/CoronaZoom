## 확진자 방문 장소의 테스트 데이터 생성 & 테이블 삽입
## make confirmer visited places & insert to mysql table ConfirmerVisitedPlaces

##  EX)
##    1. 대구 내 확진자 정보를 ConfirmerInfo에서 가져오기 - mysql 접근
##    2. 확진자의 지역(R_id) POLYGON 가져오기 - 시군구 open api 접근
##    3. 지역 POLYGON 내 건물 중 RANDOM하게 3개의 건물 가져옴 - 건물 open api 두 번 접근
##    4. Visitdate 랜덤 생성
##    5. insert
##geomFilter=point(14132749.177031 4494202.5212524)
##attrFilter=sigungu:like:안양
##crs=EPSG:900913


import pymysql
import os
import socket
import urllib.request
import urllib.parse
import ast
import random
from datetime import datetime, timedelta


if socket.gethostname()=='DESKTOP-JMPL7B7':
    env_host = 'localhost'
    env_user = 'root'
    env_pw = '0000'
    database = 'test0519'
    env_reg_api_key = os.environ['ENV_REGION_API_KEY']
else:
    env_host = os.environ['ENV_MYSQL_HOST']
    env_user = os.environ['ENV_MYSQL_USER']
    env_pw = os.environ['ENV_MYSQL_PASSWORD']
    database = 'testDB';
    env_reg_api_key = os.environ['ENV_REGION_API_KEY']

url = 'http://www.coronazoom.kr/Region.html'
region_api_url = 'http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key='+env_reg_api_key +'&domain='+url+'&'
building_api_url = 'http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_SPBD&key='+env_reg_api_key + '&domain='+url+'&'


# MySQL Connection 연결
conn = pymysql.connect(host=env_host, user=env_user, password=env_pw,
                       db=database, charset='utf8')
curs = conn.cursor(pymysql.cursors.DictCursor)

#전체 확진자에 대해 방문 장소 삽입
#selectQuery = 'SELECT * FROM ConfirmerInfo'
#서울 확진자에 대해 방문 장소 삽입
#selectQuery = 'SELECT * FROM ConfirmerInfo WHERE UpperRegId=11'
#28일~3일 확진자에 대해 방문 장소 삽입
selectQuery = 'SELECT * FROM ConfirmerInfo WHERE ConfirmDate>="2020-05-28" AND ConfirmDate<="2020-06-03";'

curs.execute(selectQuery)
rows = curs.fetchall()

for row in rows :
    #UpperRegId = 서울 11 경기 41 대구 27
    print(row)
    R_id = row['R_id']
    C_id = row['C_id']
    ConfirmDate = row['ConfirmDate']
    
    #해당 지역의 BOX(경계) 찾기
    r_param = {'attrFilter' : 'sig_cd:=:'+str(R_id)}
    r_p = urllib.parse.urlencode(r_param)
    region_api = region_api_url + r_p
    req = urllib.request.Request(region_api)
    res = urllib.request.urlopen(req)
    region_data = res.read().decode('UTF-8')
    region = ast.literal_eval(region_data)

    region_name = region['response']['result']['featureCollection']['features'][0]['properties']['sig_kor_nm']
    region_bbox = region['response']['result']['featureCollection']['bbox']


    #지역 내 건물 찾기
    b_param = { 'geomFilter' : 'BOX('+str(region_bbox[0])+','+str(region_bbox[1])+','+str(region_bbox[2])+','+str(region_bbox[3])+')',
                'attrFilter' : 'sigungu:like:' + region_name+ ''
                }
    b_p = urllib.parse.urlencode(b_param)
    building_api = building_api_url + b_p
    #print(building_api)
    req = urllib.request.Request(building_api)
    res = urllib.request.urlopen(req)
    building_data = res.read().decode('UTF-8')
    buildings = ast.literal_eval(building_data)

    total_num = int(buildings['response']['record']['total'])

    if buildings['response']['status']=='OK':
        rd_list = []
        for i in range(1,4):
            rd_list.append(random.randrange(1,total_num))

        for i in rd_list:
            b_param_new = {'geomFilter' : 'BOX('+str(region_bbox[0])+','+str(region_bbox[1])+','+str(region_bbox[2])+','+str(region_bbox[3])+')',
                        'attrFilter' : 'sigungu:like:' + region_name+ '',
                       'page' : i, 'size' : 1}
            b_p = urllib.parse.urlencode(b_param_new)
            building_api = building_api_url + b_p

            req = urllib.request.Request(building_api)
            res = urllib.request.urlopen(req)
            building_data = res.read().decode('UTF-8')
            buildings = ast.literal_eval(building_data)

            #건물 Point
            r_point = buildings['response']['result']['featureCollection']['features'][0]['geometry']['coordinates'][0][0][0]
            point = 'Point('+str(r_point[0])+' '+str(r_point[1])+')'
            latitude = r_point[0]
            longitude = r_point[1]
            
            #random 날짜, 확진날짜 하루 전 방문 장소 3곳
            start = ConfirmDate-timedelta(days=1)
            end = ConfirmDate
            random_date = start + (end - start) * random.random()
            rd_datetime = random_date

            #INSERT INTO ConfirmerVisitedPlaces(C_id,VisitDate,Geom) VALUES(1,'2020-05-02 ',ST_GeomFromText('Point(1.0 1.0)'));
            insertQuery = 'INSERT INTO ConfirmerVisitedPlaces(C_id, VisitDate, Lat, Lon) VALUES(%s,%s,%s,%s);'
            values = (C_id, rd_datetime, latitude, longitude)

            curs.execute(insertQuery,values)
    else:
        print("C_id is "+(str)(C_id)+" "+building_api)

    conn.commit()

# Connection 닫기
conn.close()
