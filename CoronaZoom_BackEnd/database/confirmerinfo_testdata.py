from random import *

MAX = 20000
tmp = 1
status = ["격리중", "격리해제", "사망"]
status_ratio1 = ["격리중"]*70 + ["격리해제"]*25 + ["사망"]*5
sex = ["M", "F"]
Seoul = [11110, 11140, 11170, 11200, 11215, 11230, 11260, 11290, 11305, 11320, 11350, 11380, 11410, 11440, 11470, 11500, 11530, 11545, 11560, 11590, 11620, 11650, 11680, 11710, 11740]
Busan = [26110, 26140, 26170, 26200, 26230, 26260, 26290, 26320, 26350, 26380, 26410, 26440, 26470, 26500, 26530, 26710]
DaeGu = [27110, 27140, 27170, 27200, 27230, 27260, 27290, 27710]
Incheon = [28110, 28140, 28177, 28185, 28200, 28237, 28245, 28260, 28710, 28720]
Gwangju = [29110, 29140, 29155, 29170, 29200]
Daejeon = [30110, 30140, 30170, 30200, 30230]
Ulsan = [31110, 31140, 31170, 31200, 31710]
Sejong = [36110]
Gyeonggi = [41111, 41113, 41115, 41117, 41131, 41133, 41135, 41150, 41171, 41173, 41190, 41210, 41220, 41250, 41271, 41273, 41281, 41285, 41287, 41290, 41310, 41360, 41370, 41390, 41410, 41430, 41450, 41461, 41463, 41465, 41480, 41500, 41550, 41570, 41590, 41610, 41630, 41650, 41670, 41800, 41820, 41830]
Gangwon = [42110, 42130, 42150, 42170, 42190, 42210, 42230, 42720, 42730, 42750, 42760, 42770, 42780, 42790, 42800, 42810, 42820, 42830]
Chungbuk = [43111, 43112, 43113, 43114, 43130, 43150, 43720, 43730, 43740, 43745, 43750, 43760, 43770, 43800]
Chungnam = [44131, 44133, 44150, 44180, 44200, 44210, 44230, 44250, 44270, 44710, 44760, 44770, 44790, 44800, 44810, 44825]
Jeonbuk = [45111, 45113, 45130, 45140, 45180, 45190, 45210, 45710, 45720, 45730, 45740, 45750, 45770, 45790, 45800]
Jeonnam = [46110, 46130, 46150, 46170, 46230, 46710, 46720, 46730, 46770, 46780, 46790, 46800, 46810, 46820, 46830, 46840, 46860, 46870, 46880, 46890, 46900, 46910]
Gyeongbuk = [47111, 47113, 47130, 47150, 47170, 47190, 47210, 47230, 47250, 47280, 47290, 47720, 47730, 47750, 47760, 47770, 47820, 47830, 47840, 47850, 47900, 47920, 47930, 47940]
Gyeongnam = [48121, 48123, 48125, 48127, 48129, 48170, 48220, 48240, 48250, 48270, 48310, 48330, 48720, 48730, 48740, 48820, 48840, 48850, 48860, 48870, 48880, 48890]
Jeju = [50110, 50130]
region_ratio = DaeGu * 120 + Gyeongbuk * 10 + Busan + Incheon + Gwangju + Daejeon + Ulsan + Sejong + Gangwon + Chungbuk + Chungnam + Jeonbuk + Jeonnam + Gyeongnam + Jeju + Gyeonggi * 2 + Seoul * 3
date = []

m = 2
while m < 6:
    if m == 5:
        for j in range(1, 18):
            tmp_s = "2020-05-"
            if j < 10:
                tmp_s += "0"
            tmp_s += str(j)
            date.append(tmp_s)
    elif m == 4:
        for j in range(1, 31):
            tmp_s = "2020-04-"
            if j < 10:
                tmp_s += "0"
            tmp_s += str(j)
            date.append(tmp_s)
    elif m == 1 or m == 3:
        for j in range(1, 32):
            if m == 1:
                tmp_s = "2020-01-"
            else:
                tmp_s = "2020-03-"

            if j < 10:
                tmp_s += "0"
            tmp_s += str(j)
            date.append(tmp_s)
    elif m == 2:
        for j in range(1, 30):
            tmp_s = "2020-02-"
            if j < 10:
                tmp_s += "0"
            tmp_s += str(j)
            date.append(tmp_s)

    m += 1

print(date)


f = open("confirmerinfo_testdata.txt", 'a')

while tmp < 10001:
    c_id = tmp
    select_status = choice(status_ratio1)
    birthyear = randint(1930, 2020)
    select_sex = choice(sex)
    select_region = choice(region_ratio)
    select_date = choice(date)

    insert_sent = "INSERT INTO ConfirmerInfo (C_id, Status, Birthyear, Sex, R_id, UpperRegId, ConfirmDate) VALUES (" + str(c_id) + ", '" + select_status + "', " + str(birthyear) + ", '" + select_sex + "', " + str(select_region) + ", " + str(select_region//1000) + ', "' + select_date + '");\n'

    print(insert_sent)

    f.write(insert_sent)

    tmp += 1

f.close()
