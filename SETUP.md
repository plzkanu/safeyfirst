# 설치 및 실행 가이드

## 1. 사전 요구사항

- Node.js (v14 이상)
- npm 또는 yarn

## 2. 설치 단계

### 2.1 루트 디렉토리에서 의존성 설치

```bash
npm install
```

### 2.2 서버 의존성 설치

```bash
cd server
npm install
cd ..
```

### 2.3 클라이언트 의존성 설치

```bash
cd client
npm install
cd ..
```

또는 한 번에 설치:

```bash
npm run install-all
```

## 3. 환경 설정

### 3.1 서버 환경 변수 설정

`server/.env.example` 파일을 복사하여 `server/.env` 파일을 생성:

```bash
cd server
copy .env.example .env
```

또는 직접 생성:

```bash
cd server
echo JWT_SECRET=your-secret-key-here > .env
echo PORT=5000 >> .env
```

**중요**: 프로덕션 환경에서는 `JWT_SECRET`을 강력한 랜덤 문자열로 변경하세요.

## 4. 실행

### 4.1 개발 모드 (프론트엔드 + 백엔드 동시 실행)

루트 디렉토리에서:

```bash
npm run dev
```

이 명령은 다음을 실행합니다:
- 백엔드 서버: http://localhost:5000
- 프론트엔드 개발 서버: http://localhost:3000

### 4.2 개별 실행

**백엔드만 실행:**
```bash
cd server
npm start
```

**프론트엔드만 실행:**
```bash
cd client
npm start
```

## 5. 기본 계정

시스템이 처음 실행되면 다음 기본 계정이 자동으로 생성됩니다:

- **관리자 계정**
  - 사용자명: `admin`
  - 비밀번호: `admin123`
  - 권한: 관리자

- **일반 사용자 계정**
  - 사용자명: `user`
  - 비밀번호: `user123`
  - 권한: 일반 사용자

**보안**: 프로덕션 환경에서는 반드시 기본 비밀번호를 변경하세요!

## 6. SOOSAN 로고 추가

1. SOOSAN 로고 이미지 파일을 준비하세요 (PNG 형식 권장)
2. `client/public/logo.png`에 파일을 복사하세요
3. `client/src/components/Logo.js` 파일을 열고 이미지 사용 부분의 주석을 해제하세요

## 7. 문제 해결

### 포트가 이미 사용 중인 경우

서버 포트를 변경하려면 `server/.env` 파일에서 `PORT` 값을 변경하세요.

프론트엔드 포트를 변경하려면 `client/.env` 파일을 생성하고 다음을 추가:

```
PORT=3001
```

### 데이터베이스 초기화

데이터베이스를 초기화하려면 `server/database.db` 파일을 삭제하고 서버를 재시작하세요.

## 8. 프로덕션 빌드

### 프론트엔드 빌드

```bash
cd client
npm run build
```

빌드된 파일은 `client/build` 폴더에 생성됩니다.

### 프로덕션 서버 실행

프로덕션 환경에서는 정적 파일 서빙을 위해 Express에서 빌드된 파일을 제공하도록 설정하거나, 별도의 웹 서버(Nginx 등)를 사용하세요.

