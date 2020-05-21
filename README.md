### :point_right: 프로젝트 변경 사항 및 진행 상황 :point_left:
* [변경 사항](https://github.com/4z7l/CoronaZoom_WEB/issues/1) 은 여기서!
<hr/>

CoronaZoom_WEB
===================
#### :mask:호흡기 전염병(COVID-19):mask: 역학조사를 위한 시각화 웹 플랫폼 REPOSITORY

## Team Member
###### 세종대학교 소프트웨어학과 캡스톤디자인 (Sejong University Dept. of Software Capstone Design 2020)
|이름|github ID|역할|
|------|---|---|
|김슬기|[@4z7l](https://github.com/4z7l)||
|전승현|@jsh5408||
|박세원|@bigwon9999||
|황준철|@JJunCH014||

코로나줌(CoronaZoom)
===================

:purple_heart: [코로나줌]() 구경하기

#### 메인 페이지 미리보기
<img width="80%" src="./CoronaZoom_FrontEnd/Resources/images/ReadMe/index.png" title="index page" alt="index page"></img>

1.상세 설계
------------------------------------
* [상세 설계 Wiki](https://github.com/4z7l/CoronaZoom_WEB/wiki/%EC%83%81%EC%84%B8-%EC%84%A4%EA%B3%84)
  - 아키텍쳐 설계 (Architecture Design)
  - UI 설계 (UI Design)
  - 데이터베이스 설계 (Database Design)


### 1-1.개발 환경(Development Environment)
* AWS EC2 - Ubuntu
* MySQL

<hr/>

2.시작
------------------------------------
### 2-1. 환경변수 설정
<pre><code>
ENV_MYSQL_HOST = "DB 호스트 이름"
ENV_MYSQL_USER = "DB 사용자 이름"
ENV_MYSQL_PASSWORD = "DB 비밀번호"
ENV_HOSP_API_KEY = "공공데이터포털 코로나 선별진료소 OPEN API 키"
ENV_REGION_API_KEY = "VWORLD 시군구 행정구역 OPEN API 키"
</code></pre>
