# Replit 배포 가이드

이 문서는 SOOSAN 안전 관리 시스템을 Replit.com에 배포하는 방법을 설명합니다.

## 📋 사전 준비

### 1. Replit 계정 생성
- https://replit.com 에서 계정 생성
- 무료 플랜으로도 배포 가능

### 2. 프로젝트 업로드 방법

#### 방법 A: GitHub 연동 (권장)
1. 로컬 프로젝트를 GitHub에 푸시
2. Replit에서 "Import from GitHub" 선택
3. 저장소 URL 입력

#### 방법 B: 직접 업로드
1. Replit에서 "Create Repl" 클릭
2. "Node.js" 템플릿 선택
3. 파일들을 직접 업로드하거나 Git 클론

---

## 🚀 배포 단계

### 1단계: 프로젝트 파일 확인

다음 파일들이 Replit 프로젝트 루트에 있는지 확인:
- `.replit` (Replit 설정 파일)
- `replit.nix` (환경 설정)
- `package.json`
- `server/` 폴더
- `client/` 폴더

### 2단계: 환경 변수 설정

Replit의 **Secrets** 탭에서 다음 환경 변수를 설정:

1. Replit 대시보드에서 프로젝트 선택
2. 왼쪽 사이드바에서 **"Secrets"** 클릭
3. 다음 변수들을 추가:

```
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=production
```

**중요**: `JWT_SECRET`은 강력한 랜덤 문자열로 변경하세요!

### 3단계: 의존성 설치

Replit 터미널에서 실행:

```bash
npm run install-all
```

이 명령어는 다음을 실행합니다:
- 루트 디렉토리 의존성 설치
- 서버 의존성 설치
- 클라이언트 의존성 설치

### 4단계: 프론트엔드 빌드

```bash
npm run build
```

이 명령어는 `client/build` 폴더에 프로덕션 빌드를 생성합니다.

### 5단계: 서버 실행

#### 개발 모드 (테스트용)
```bash
npm run dev
```

#### 프로덕션 모드 (배포용)
```bash
npm run start:prod
```

또는 `.replit` 파일의 `run` 명령어를 수정:
```
run = "npm run start:prod"
```

---

## 🔧 Replit 설정

### `.replit` 파일 설정

`.replit` 파일이 이미 생성되어 있습니다. 필요시 수정:

```toml
language = "nodejs"
run = "npm run start:prod"
entrypoint = "server/index.js"

[deploy]
run = ["sh", "-c", "npm run build && npm run start:prod"]

[env]
NODE_ENV=production
```

### 포트 설정

Replit은 자동으로 포트를 할당합니다. 서버 코드에서 `0.0.0.0`으로 리스닝하도록 설정되어 있습니다.

환경 변수 `PORT`는 Replit이 자동으로 설정하므로, 코드에서 `process.env.PORT`를 사용합니다.

---

## 📝 배포 후 확인 사항

### 1. 서버 실행 확인

Replit 터미널에서 다음 메시지가 보여야 합니다:
```
서버가 포트 XXXX에서 실행 중입니다.
프로덕션 모드: React 빌드 파일을 서빙합니다.
```

### 2. 웹뷰 확인

Replit의 **"Webview"** 탭을 클릭하여 애플리케이션이 정상적으로 로드되는지 확인합니다.

### 3. API 테스트

웹뷰에서 로그인 페이지가 표시되고, 로그인 기능이 작동하는지 확인합니다.

---

## 🌐 공개 URL 설정

### Always On 설정 (유료 플랜)

1. Replit 대시보드에서 프로젝트 선택
2. **"Always On"** 옵션 활성화
3. 공개 URL이 생성됩니다

### 무료 플랜

- 무료 플랜에서는 Replit 세션이 비활성화되면 앱이 중지됩니다
- 외부 접근을 위해서는 Replit의 공개 URL을 사용하거나
- 다른 호스팅 서비스(Heroku, Railway 등)를 고려하세요

---

## 🔄 업데이트 배포

### 로컬에서 개발 후 배포

1. **변경사항 커밋 및 푸시** (GitHub 사용 시)
   ```bash
   git add .
   git commit -m "업데이트 내용"
   git push
   ```

2. **Replit에서 Pull**
   - Replit 터미널에서:
   ```bash
   git pull
   ```

3. **의존성 재설치** (필요시)
   ```bash
   npm run install-all
   ```

4. **프론트엔드 재빌드**
   ```bash
   npm run build
   ```

5. **서버 재시작**
   - Replit에서 "Stop" 후 "Run" 클릭

---

## 🐛 문제 해결

### 포트 오류

Replit은 자동으로 포트를 할당합니다. `server/index.js`에서 `0.0.0.0`으로 리스닝하도록 설정되어 있습니다.

### 빌드 오류

```bash
# 클라이언트 캐시 삭제 후 재빌드
cd client
rm -rf node_modules build
npm install
npm run build
cd ..
```

### 데이터베이스 오류

SQLite 데이터베이스는 `server/database.db`에 저장됩니다. Replit의 파일 시스템은 영구적이지만, 프로젝트를 삭제하면 데이터도 삭제됩니다.

**백업 권장**: 중요한 데이터는 정기적으로 백업하세요.

### 환경 변수 오류

Secrets 탭에서 환경 변수가 제대로 설정되었는지 확인:
- `JWT_SECRET`
- `PORT` (선택사항, Replit이 자동 설정)
- `NODE_ENV=production`

---

## 📦 프로젝트 구조 (Replit)

```
safe/
├── .replit              # Replit 설정
├── replit.nix           # 환경 설정
├── package.json         # 루트 패키지
├── server/              # 백엔드
│   ├── index.js
│   ├── routes/
│   ├── database/
│   └── package.json
├── client/             # 프론트엔드
│   ├── src/
│   ├── public/
│   ├── build/          # 빌드 결과물 (배포 시 생성)
│   └── package.json
└── README.md
```

---

## ✅ 배포 체크리스트

- [ ] `.replit` 파일 생성 확인
- [ ] `replit.nix` 파일 생성 확인
- [ ] 환경 변수 설정 (Secrets)
- [ ] 의존성 설치 완료 (`npm run install-all`)
- [ ] 프론트엔드 빌드 완료 (`npm run build`)
- [ ] 서버 실행 확인
- [ ] 웹뷰에서 로그인 페이지 확인
- [ ] 로그인 기능 테스트
- [ ] API 엔드포인트 테스트

---

## 🔐 보안 권장사항

1. **JWT_SECRET 강화**
   - 최소 32자 이상의 랜덤 문자열 사용
   - 예: `openssl rand -hex 32`

2. **기본 비밀번호 변경**
   - 배포 후 즉시 기본 계정 비밀번호 변경
   - 관리자 계정: `admin/admin123` → 변경 필수

3. **HTTPS 사용**
   - Replit의 공개 URL은 HTTPS를 지원합니다

---

## 📚 추가 리소스

- [Replit 공식 문서](https://docs.replit.com)
- [Node.js 배포 가이드](https://docs.replit.com/hosting/deployments/overview)

---

## 💡 팁

1. **개발과 배포 분리**
   - 로컬에서 개발
   - Replit은 배포 및 테스트용으로 사용

2. **Git 사용**
   - GitHub와 연동하여 버전 관리
   - 변경사항을 쉽게 배포

3. **로깅 확인**
   - Replit 터미널에서 서버 로그 확인
   - 오류 발생 시 즉시 확인 가능

4. **데이터 백업**
   - 정기적으로 `server/database.db` 파일 백업
   - 또는 데이터베이스 마이그레이션 스크립트 작성

---

배포가 완료되면 Replit의 공개 URL을 통해 어디서나 접속할 수 있습니다! 🎉


