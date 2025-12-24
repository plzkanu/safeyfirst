# Replit에 프로젝트 Import 가이드

Cursor에서 개발한 코드를 Replit에 가져오는 방법입니다.

---

## 🎯 방법 1: GitHub에서 Import (권장)

이미 GitHub에 푸시되어 있으므로 이 방법이 가장 간단합니다.

### 1단계: Replit 접속

1. https://replit.com 접속
2. 로그인 (계정이 없으면 회원가입)

### 2단계: 새 프로젝트 생성

1. 왼쪽 상단 **"Create Repl"** 버튼 클릭
   - 또는 **"+"** 아이콘 클릭

2. **"Import from GitHub"** 탭 선택
   - 여러 옵션 중에서 "Import from GitHub" 찾기

### 3단계: GitHub 저장소 정보 입력

**방법 A: 저장소 URL 입력**
```
https://github.com/plzkanu/soosan_safe
```

**방법 B: 저장소 이름만 입력**
```
plzkanu/soosan_safe
```

### 4단계: Import 실행

1. **"Import"** 또는 **"Import from GitHub"** 버튼 클릭
2. Replit이 자동으로 프로젝트를 가져옵니다
3. 몇 분 정도 소요될 수 있습니다

### 5단계: 프로젝트 이름 설정 (선택사항)

- 프로젝트 이름을 원하는 대로 변경 가능
- 예: "soosan-safe", "안전관리시스템" 등

### 6단계: Import 완료 확인

- 파일들이 정상적으로 표시되는지 확인
- `.replit`, `replit.nix`, `package.json` 등이 보여야 합니다

---

## 🎯 방법 2: 직접 파일 업로드

GitHub를 사용하지 않는 경우:

### 1단계: 새 프로젝트 생성

1. Replit에서 **"Create Repl"** 클릭
2. **"Node.js"** 템플릿 선택
3. 프로젝트 이름 입력

### 2단계: 파일 업로드

**방법 A: 드래그 앤 드롭**
1. 로컬 파일 탐색기에서 다음 파일/폴더 선택:
   - `.replit` 파일
   - `replit.nix` 파일
   - `package.json` 파일
   - `server/` 폴더 전체
   - `client/` 폴더 전체
   - 기타 설정 파일들
2. Replit 파일 탐색기로 드래그 앤 드롭

**방법 B: 파일 탐색기에서 업로드**
1. Replit 파일 탐색기에서 우클릭
2. **"Upload file"** 또는 **"Upload folder"** 선택
3. 파일 선택

### 3단계: 업로드 확인

- 모든 파일이 정상적으로 업로드되었는지 확인

---

## 🎯 방법 3: ZIP 파일로 업로드

### 1단계: 프로젝트 압축

로컬에서:
1. 프로젝트 폴더(`d:\prj\safe`) 선택
2. 우클릭 > **"압축"** 또는 **"Send to > Compressed folder"**
3. `node_modules` 폴더는 제외 (용량이 큼)

### 2단계: Replit에 업로드

1. Replit에서 **"Create Repl"** 클릭
2. **"Node.js"** 템플릿 선택
3. 파일 탐색기에서 ZIP 파일 업로드
4. Replit이 자동으로 압축 해제

---

## ✅ Import 후 필수 작업

### 1. 환경 변수 설정 (Secrets)

1. 왼쪽 사이드바에서 **"Secrets"** 클릭
2. 다음 변수 추가:

```
JWT_SECRET=your-super-secret-key-here-min-32-chars
NODE_ENV=production
```

### 2. 의존성 설치

터미널에서:
```bash
npm run install-all
```

### 3. 프론트엔드 빌드

```bash
npm run build
```

### 4. 서버 실행

**Run** 버튼 클릭 또는:
```bash
npm run start:prod
```

---

## 🔄 이미 Import된 프로젝트 업데이트

이미 Replit에 프로젝트가 있는 경우:

### 방법 1: Git Pull (권장)

Replit 터미널에서:
```bash
# 최신 코드 가져오기
git pull origin main

# 프론트엔드 빌드
npm run build

# 서버 재시작
# Run 버튼 클릭
```

### 방법 2: 수동 파일 업로드

1. 변경된 파일만 선택
2. Replit 파일 탐색기로 드래그 앤 드롭
3. 기존 파일 덮어쓰기

---

## 📋 Import 체크리스트

- [ ] Replit 계정 생성/로그인
- [ ] "Create Repl" 클릭
- [ ] "Import from GitHub" 선택
- [ ] 저장소 URL 입력: `https://github.com/plzkanu/soosan_safe`
- [ ] Import 완료 대기
- [ ] 파일들이 정상적으로 표시되는지 확인
- [ ] 환경 변수 설정 (Secrets)
- [ ] 의존성 설치 (`npm run install-all`)
- [ ] 프론트엔드 빌드 (`npm run build`)
- [ ] 서버 실행 확인

---

## 🐛 문제 해결

### Import가 안 되는 경우

1. **GitHub 저장소가 Public인지 확인**
   - Private 저장소는 GitHub 인증 필요

2. **저장소 URL이 정확한지 확인**
   - `https://github.com/plzkanu/soosan_safe` 형식 확인

3. **Replit 계정과 GitHub 연동**
   - Replit 설정에서 GitHub 계정 연동

### 파일이 누락된 경우

1. **파일 탐색기에서 확인**
   - 모든 파일이 업로드되었는지 확인

2. **수동으로 누락된 파일 업로드**
   - 드래그 앤 드롭으로 추가

### 의존성 설치 오류

```bash
# 각 폴더에서 개별 설치
cd server
npm install
cd ../client
npm install
cd ..
```

---

## 💡 팁

### 1. GitHub Import가 가장 편리

- 자동으로 모든 파일 가져오기
- Git 히스토리도 함께 가져오기
- 나중에 `git pull`로 쉽게 업데이트 가능

### 2. 파일 구조 확인

Import 후 다음 파일들이 있는지 확인:
- `.replit` - Replit 설정
- `replit.nix` - 환경 설정
- `package.json` - 루트 패키지
- `server/` - 백엔드 폴더
- `client/` - 프론트엔드 폴더

### 3. 첫 Import 후 설정

- 환경 변수 설정 필수
- 의존성 설치 필수
- 빌드 필수

---

## 🎉 완료!

Import가 완료되면 `REPLIT_DEPLOY_STEPS.md`를 참고하여 배포를 진행하세요!

