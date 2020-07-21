import pymysql
import requests
import pandas as pd
from bs4 import BeautifulSoup
import os

env_host = os.environ['ENV_MYSQL_HOST']
env_user = os.environ['ENV_MYSQL_USER']
env_pw = os.environ['ENV_MYSQL_PASSWORD']
env_hos_api_key = os.environ['ENV_HOSP_API_KEY']

def rename_region(text):
    if text == '전남':
        return '전라남도'
    elif text == '전북':
        return '전라북도'
    elif text == '경남':
        return '경상남도'
    elif text == '경북':
        return '경상북도'
    elif text == '충남':
        return '충청남도'
    elif text == '충북':
        return '충청북도'
    else :
        return text

# MySQL Connection 연결
conn = pymysql.connect(host=env_host, user=env_user, password=env_pw,
                       db='zoom', charset='utf8')

curs = conn.cursor(pymysql.cursors.DictCursor)

#Open api 연결
key = env_hos_api_key
url = 'http://apis.data.go.kr/B551182/pubReliefHospService/getpubReliefHospList?ServiceKey='+key+'&'

pagenum = 1
parameter = 'numOfRows=1200&pageNo=1'
#{'pageNo' : 1,'numOfRows' : 1200}

api = url + parameter

res = requests.get(api)

soup = BeautifulSoup(res.content,'html.parser')

hosplist = soup.find_all('item')
#print(hosplist)
i=0
error=0
for hosp in hosplist:
    city = hosp.find('sidonm').get_text() #부산
    county = hosp.find('sggunm').get_text() #부산진구
    hname = hosp.find('yadmnm').get_text()
    phone = hosp.find('telno').get_text()
    signcode = hosp.find('spcladmtycd').get_text()
    city = rename_region(city)

    selectQuery = "SELECT R_id FROM RegionInfo WHERE City LIKE '%"+city+"%' and (County LIKE '"+county+"' OR County LIKE '"+county.replace(" ","")+"');"
    curs.execute(selectQuery)

    #select 결과가 1개가 아닌 경우 예외처리
    row_num = curs.rowcount
    if(row_num!=1):
        print(hname+' '+str(row_num)+' ')
        error+=1
    
    resultCode = curs.fetchall()
    i+=1
    
    #삽입
    insertQuery = "INSERT INTO HospitalInfo(H_name,R_id,Phone,SignCode) VALUES(%s,%s,%s,%s);"
    value=(hname,resultCode[0]['R_id'],phone,signcode)
    #print(hname,resultCode[0]['R_id'],phone,signcode)
    curs.execute(insertQuery,value)
    

print(i,error)
conn.commit()
# Connection 닫기
conn.close()
