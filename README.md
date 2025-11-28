# 보드게임 출석체크 및 통계 관리 웹앱

보드게임 모임의 출석 관리, 게임 결과 기록, 통계 분석을 제공하는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: Naver OAuth, Kakao OAuth
- **Deployment**: Local (Docker Compose)

## 프로젝트 구조

```
boardGame/
├── frontend/          # React 프론트엔드
├── backend/           # Node.js 백엔드
├── database/          # DB 스키마 및 마이그레이션
│   └── schema.sql
├── docker-compose.yml # Docker 설정
└── README.md
```

## 시작하기

### 1. Docker 컨테이너 실행

```bash
# PostgreSQL 및 Redis 시작
docker-compose up -d

# 컨테이너 상태 확인
docker-compose ps
```

### 2. 데이터베이스 초기화

```bash
# PostgreSQL 컨테이너에 접속
docker exec -it boardgame_postgres psql -U postgres -d boardgame_db

# 또는 스키마 직접 실행
docker exec -i boardgame_postgres psql -U postgres -d boardgame_db < database/schema.sql
```

### 3. 백엔드 설정

```bash
cd backend
npm install
cp .env.example .env
# .env 파일에 OAuth 키 입력
npm run dev
```

### 4. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

## OAuth 설정

### Naver 개발자 센터
1. https://developers.naver.com/apps/#/register 접속
2. 애플리케이션 등록
3. Callback URL: `http://localhost:3000/auth/callback/naver`
4. Client ID, Client Secret 복사

### Kakao 개발자 센터
1. https://developers.kakao.com/ 접속
2. 애플리케이션 추가
3. Redirect URI: `http://localhost:3000/auth/callback/kakao`
4. REST API 키 복사

## 주요 기능

- ✅ 출석 체크 및 포인트 시스템
- ✅ 게임 등록 및 관리
- ✅ 게임 세션 기록
- ✅ 참여자 결과 입력 (개인전/팀전)
- ✅ 통계 및 랭킹 시스템
- ✅ 배지 및 성취 시스템
- ✅ 출석 캘린더 UI

## 개발 일정

자세한 개발 계획은 [implementation_plan.md](./docs/implementation_plan.md)를 참고하세요.

## 라이선스

MIT