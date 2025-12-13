# 강아지 그림 일기 
> "강아지의 환경을 반영해, 주인에게 AI 그림 일기를 제공하는 서비스"


## 프로젝트 개요

- 개발 기간: 2025.09.01 ~
- 개발 목적: 그림 일기 제공


## 🚀 주요 기능

- 🔍 강아지 환경 정보 실시간 측정: 온도, 습도, 미세먼지, 수위(수분섭취), 무게(사료섭취)
- 🌐 측정한 데이터 기반 그림 일기 작성
- 📊 날짜별 그림일기 데이터 저장



## 👥 팀원

| 이름 | 역할 |
| --- | --- |
| 김영지　<br/> (팀장) | PM, 웹 디자인 |
| 이다원 | 웹 개발 |
| 최지혜 | 웹 디자인 |
| 홍순일 | 웹 개발, 하드웨어 제작 |


## 📂 프로젝트 구조

### 1. 리포지토리

[**dog-daily-app**](https://github.com/HongSoonIL/dog-diary-app.git)


### 2. 파일구조

```markdown
📂 dog-daily-app
 ┗ 📂 src
  ┣ 🔒 .env
  ┣ 📜 App.css
  ┣ 📜 App.js
  ┣ 📜 Icons.js
  ┗ ...
```


## ⚙️ 로컬 실행 방법

### 1. 프로젝트 파일 실행

```bash
cd dog-daily-app
npm start
```

### 2. `.env` 파일 설정

```makefile
GEMINI_API_KEY=YOUR_GEMINI_API_KEY              # Gemini API 키
```
