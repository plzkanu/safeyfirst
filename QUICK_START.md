# 빠른 시작 가이드

## 📋 사전 준비

### 1단계: Node.js 설치 확인

PowerShell에서 다음 명령어로 확인:

```powershell
node --version
npm --version
```

**설치되어 있지 않다면:**
- https://nodejs.org/ 에서 LTS 버전 다운로드 및 설치
- 설치 후 PowerShell을 **새로 열기** (중요!)

---

## 🚀 실행 방법

### 방법 1: 자동 실행 (권장)

프로젝트 루트 디렉토리(`d:\prj\safe`)에서:

```powershell
# 1. 모든 의존성 설치 (처음 한 번만)
npm run install-all

# 2. 개발 서버 실행 (프론트엔드 + 백엔드 동시 실행)
npm run dev
```

이 명령어는 다음을 자동으로 실행합니다:
- **백엔드 서버**: http://localhost:5000
- **프론트엔드**: http://localhost:3000

브라우저가 자동으로 열리며, http://localhost:3000 에서 애플리케이션을 사용할 수 있습니다.

---

### 방법 2: 개별 실행

#### 백엔드만 실행

```powershell
# 서버 디렉토리로 이동
cd server

# 의존성 설치 (처음 한 번만)
npm install

# 서버 실행
npm start
```

백엔드 서버가 http://localhost:5000 에서 실행됩니다.

#### 프론트엔드만 실행 (새 터미널 창에서)

```powershell
# 클라이언트 디렉토리로 이동
cd client

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm start
```

프론트엔드가 http://localhost:3000 에서 실행됩니다.

---

## 🔑 로그인 정보

시스템이 처음 실행되면 다음 계정이 자동으로 생성됩니다:

### 관리자 계정
- **사용자명**: `admin`
- **비밀번호**: `admin123`
- **권한**: 전체 관리 기능 사용 가능

### 일반 사용자 계정
- **사용자명**: `user`
- **비밀번호**: `user123`
- **권한**: 활동 기록 및 조회만 가능

---

## 📱 사용 방법

### 일반 사용자

1. **로그인**: `user` / `user123`으로 로그인
2. **활동 기록**: 
   - "활동 추가" 메뉴 클릭
   - 활동 유형, 위치, 설명 입력
   - 저장
3. **활동 조회**: 
   - "활동 목록"에서 자신이 기록한 활동 확인
   - 수정/삭제 가능

### 관리자

1. **로그인**: `admin` / `admin123`으로 로그인
2. **대시보드**: 전체 통계 확인
3. **통계 분석**: 
   - 활동 유형별, 사용자별, 일별 통계
   - 차트와 그래프로 시각화
4. **사용자 관리**: 새 사용자 생성
5. **전체 활동 조회**: 모든 사용자의 활동 기록 확인

---

## 🛠️ 문제 해결

### 포트가 이미 사용 중인 경우

**백엔드 포트 변경:**
1. `server/.env` 파일 열기
2. `PORT=5000`을 원하는 포트로 변경 (예: `PORT=5001`)

**프론트엔드 포트 변경:**
1. `client` 폴더에 `.env` 파일 생성
2. 다음 내용 추가:
   ```
   PORT=3001
   ```

### 데이터베이스 초기화

모든 데이터를 삭제하고 처음부터 시작하려면:

```powershell
# 서버 디렉토리에서
cd server
Remove-Item database.db
cd ..
npm run dev
```

### 의존성 설치 오류

각 디렉토리에서 개별적으로 설치:

```powershell
# 루트
npm install

# 서버
cd server
npm install
cd ..

# 클라이언트
cd client
npm install
cd ..
```

### 캐시 문제

```powershell
# 클라이언트 캐시 삭제
cd client
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📂 프로젝트 구조

```
safe/
├── client/              # React 프론트엔드
│   ├── src/
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── components/  # 재사용 컴포넌트
│   │   └── contexts/   # 상태 관리
│   └── public/         # 정적 파일
├── server/              # Node.js 백엔드
│   ├── routes/         # API 라우트
│   ├── database/       # 데이터베이스
│   └── middleware/     # 미들웨어
└── package.json        # 루트 설정
```

---

## ✅ 실행 확인 체크리스트

- [ ] Node.js 설치 확인 (`node --version`)
- [ ] npm 설치 확인 (`npm --version`)
- [ ] `server/.env` 파일 생성 (또는 `.env.example` 복사)
- [ ] 의존성 설치 완료 (`npm run install-all`)
- [ ] 서버 실행 (`npm run dev`)
- [ ] 브라우저에서 http://localhost:3000 접속
- [ ] 로그인 성공

---

## 🎯 다음 단계

1. **SOOSAN 로고 추가** (선택사항)
   - `client/public/logo.png`에 로고 이미지 추가
   - `client/src/components/Logo.js`에서 주석 해제

2. **프로덕션 빌드**
   ```powershell
   cd client
   npm run build
   ```

3. **보안 강화**
   - 기본 비밀번호 변경
   - JWT_SECRET 강화
   - HTTPS 설정

---

## 💡 팁

- 개발 중에는 `npm run dev`로 실행하면 코드 변경 시 자동으로 재시작됩니다
- 브라우저 개발자 도구(F12)에서 네트워크 오류 확인 가능
- 서버 로그는 터미널에서 실시간으로 확인 가능

