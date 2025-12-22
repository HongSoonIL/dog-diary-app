# 강아지 그림 일기 
> "강아지의 환경을 반영해, 주인에게 AI 그림 일기를 제공하는 서비스"


## 프로젝트 개요

- 개발 기간: 2025.09.01 ~ 2025.12.22
- 개발 목적: 그림 일기 제공


## 🚀 주요 기능

- 📡 선이 필요없는 블루투스 연동 지원
- 🔍 강아지 환경 정보 실시간 측정: 온도, 습도, 미세먼지, 수위(수분섭취), 무게(사료섭취)
- 🌐 측정한 데이터 기반 그림 일기 작성
- 📊 강아지 데이터 저장



## 👥 팀원

| 이름 | 역할 |
| --- | --- |
| 김영지　<br/> (팀장) | PM, 웹 디자인, 프론트엔드 UI 구현, 프로토타입 제작 |
| 이다원 | 그림 생성 프롬프트 작성 |
| 최지혜 | 웹 디자인, 프론트엔드 UI 구현 |
| 홍순일 | Tech Lead, 프론트엔드 UI 구현, 블루투스 연동 구현, 환경 데이터 출력 구현, 그림 및 일기 작성 알고리즘 구현, Gemini API 연동 및 기능 구현, 강아지 데이터 저장 기능 구현, 하드웨어 설계 및 제작, Git 관리 |


## 📂 프로젝트 구조

### 1. 리포지토리

[**dog-daily-app**](https://github.com/HongSoonIL/dog-diary-app.git)


### 2. 파일구조

```markdown
📂 dog-daily-app
 ┗ 📂 air_buletooth
  ┗ 📜 air_bluetooth.ino
 ┗ 📂 src
  ┣ 📜 App.css
  ┣ 📜 App.js
  ┣ 📜 Icons.js
  ┗ ...
┣ 🔒 .env
```


## ⚙️ 로컬 실행 방법

### 1. 아두이노 파일 실행

```
air_bluetooth.ino 컴파일 및 업로드 후 실행
```

### 2. 프로젝트 파일 실행

```bash
cd dog-daily-app
npm start
```

### 3. `.env` 파일 설정

```makefile
REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY              # Gemini API 키
```
