import pymysql
import urllib.request
import urllib.parse
import ast
import os

env_host = os.environ['ENV_MYSQL_HOST']
env_user = os.environ['ENV_MYSQL_USER']
env_pw = os.environ['ENV_MYSQL_PASSWORD']
env_reg_api_key = os.environ['ENV_REGION_API_KEY']

url = 'http://www.coronazoom.kr/Region.html'


##http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&
##                   key=인증키&domain=인증키 URL&[요청파라미터]

apiurl = 'http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key='+env_reg_api_key+'&domain='+url+'&'

# MySQL Connection 연결
conn = pymysql.connect(host=env_host, user=env_user, password=env_pw,
                       db='zoom', charset='utf8')

curs = conn.cursor(pymysql.cursors.DictCursor)

parameter = { 'attrFilter' : 'sig_cd:>:0',
              'geometry' : 'false',
              'size' : 1000}

param = urllib.parse.urlencode(parameter)
api = apiurl + param

req = urllib.request.Request(api)
res = urllib.request.urlopen(req)

data = res.read().decode('UTF-8')

regionlist = ast.literal_eval(data)

for region in regionlist['response']['result']['featureCollection']['features']:
    code = region['properties']['sig_cd']
    full = region['properties']['full_nm']
    part = region['properties']['sig_kor_nm']
    sql = 'INSERT INTO RegionInfo(City, County,R_id) VALUES(%s, %s, %s);'
    value = (full,part,code)
    curs.execute(sql,value)

conn.commit()

# Connection 닫기
conn.close()
