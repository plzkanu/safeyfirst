# Replit 프로젝트 업데이트 가이드

기존 Replit 프로젝트를 GitHub의 최신 변경사항으로 업데이트하는 방법입니다.

---

## 🎯 방법 1: Git Pull 사용 (권장)

가장 간단하고 안전한 방법입니다. Replit 터미널에서 직접 실행합니다.

### 1단계: Replit 프로젝트 열기

1. https://replit.com 접속
2. 기존 프로젝트 선택하여 열기

### 2단계: Git 원격 저장소 확인

터미널에서 다음 명령어로 원격 저장소가 연결되어 있는지 확인:

```bash
git remote -v
```

**출력 예시:**
```
origin  https://github.com/plzkanu/soosan_safe.git (fetch)
origin  https://github.com/plzkanu/soosan_safe.git (push)
```

**원격 저장소가 없는 경우:**
```bash
git remote add origin https://github.com/plzkanu/soosan_safe.git
```

### 3단계: 최신 코드 가져오기

```bash
git pull origin main
```

또는 간단히:
```bash
git pull
```

### 4단계: 충돌 해결 (필요시)

만약 로컬에서 수정한 파일이 있어서 충돌이 발생하면:

```bash
# 현재 변경사항 확인
git status

# 방법 1: 로컬 변경사항 버리고 GitHub 버전 사용
git checkout -- 파일명

# 방법 2: 로컬 변경사항 임시 저장 후 Pull
git stash
git pull origin main
git stash pop  # 필요시 로컬 변경사항 다시 적용
```

### 5단계: 의존성 업데이트 (필요시)

새로운 패키지가 추가되었거나 `package.json`이 변경된 경우:

```bash
npm run install-all
```

### 6단계: 프론트엔드 재빌드

```bash
npm run build
```

### 7단계: 서버 재시작

1. Replit에서 **"Stop"** 버튼 클릭
2. **"Run"** 버튼 클릭

또는 터미널에서:
```bash
npm run start:prod
```

---

## 🎯 방법 2: Replit Git 패널 사용

Replit의 GUI를 사용하는 방법입니다.

### 1단계: Git 패널 열기

1. Replit 왼쪽 사이드바에서 **"Version control"** 아이콘 클릭
   - 또는 `Ctrl+Shift+G` (Windows/Linux) / `Cmd+Shift+G` (Mac)

### 2단계: Pull 실행

1. Git 패널에서 **"Pull"** 버튼 클릭
2. 또는 **"..."** 메뉴에서 **"Pull from origin"** 선택

### 3단계: 나머지 단계

방법 1의 5-7단계와 동일하게 진행

---

## 🎯 방법 3: 수동 파일 업로드

Git을 사용하지 않는 경우, 변경된 파일만 수동으로 업데이트합니다.

### 1단계: 변경된 파일 확인

로컬에서 변경된 파일 목록 확인:
```powershell
git status
```

### 2단계: 파일 업로드

1. Replit 파일 탐색기에서 해당 파일/폴더 찾기
2. 로컬에서 변경된 파일을 드래그 앤 드롭
3. 기존 파일 덮어쓰기 확인

### 3단계: 의존성 및 빌드

```bash
npm run install-all
npm run build
```

### 4단계: 서버 재시작

**"Stop"** → **"Run"** 클릭

---

## 📋 전체 업데이트 명령어 (빠른 참조)

Replit 터미널에서 한 번에 실행:

```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 의존성 업데이트
npm run install-all

# 3. 프론트엔드 빌드
npm run build

# 4. 서버 재시작 (Run 버튼 클릭 또는)
npm run start:prod
```

---

## ✅ 업데이트 확인

### 1. 파일 확인

Replit 파일 탐색기에서 다음 파일들이 최신 버전인지 확인:
- 새로 추가된 파일들 (예: `GITHUB_DEPLOY.md`, `DocumentSubmission.js` 등)
- 수정된 파일들

### 2. 서버 실행 확인

터미널에서 다음 메시지 확인:
```
서버가 포트 XXXX에서 실행 중입니다.
프로덕션 모드: React 빌드 파일을 서빙합니다.
```

### 3. 웹뷰 확인

1. **"Webview"** 탭 클릭
2. 새로운 기능이 정상적으로 작동하는지 확인
3. 로그인 테스트

---

## 🔄 자동 업데이트 스크립트

Replit에서 자주 업데이트하는 경우, 스크립트를 만들어 사용할 수 있습니다:

### `update.sh` 파일 생성

```bash
#!/bin/bash
echo "🔄 GitHub에서 최신 코드 가져오는 중..."
git pull origin main

echo "📦 의존성 업데이트 중..."
npm run install-all

echo "🏗️ 프론트엔드 빌드 중..."
npm run build

echo "✅ 업데이트 완료! Run 버튼을 클릭하여 서버를 재시작하세요."
```

**사용 방법:**
```bash
chmod +x update.sh
./update.sh
```

---

## 🛠️ 문제 해결

### "fatal: not a git repository" 오류

Git 저장소가 초기화되지 않은 경우:

```bash
git init
git remote add origin https://github.com/plzkanu/soosan_safe.git
git pull origin main --allow-unrelated-histories
```

### "Your local changes would be overwritten" 오류

로컬 변경사항이 있어서 충돌하는 경우:

**방법 1: 로컬 변경사항 버리기**
```bash
git reset --hard origin/main
git pull origin main
```

**방법 2: 로컬 변경사항 임시 저장**
```bash
git stash
git pull origin main
git stash pop  # 필요시
```

### "Permission denied" 오류

GitHub 인증이 필요한 경우:

```bash
# Personal Access Token 사용
git pull origin main
# Username: plzkanu
# Password: Personal Access Token 입력
```

### 빌드 오류

```bash
# 클라이언트 캐시 삭제 후 재빌드
cd client
rm -rf node_modules build
npm install
npm run build
cd ..
```

### 의존성 설치 오류

```bash
# 각 폴더에서 개별 설치
cd server
rm -rf node_modules
npm install
cd ../client
rm -rf node_modules
npm install
cd ../mobile
rm -rf node_modules
npm install
cd ..
```

---

## 💡 업데이트 팁

### 1. 정기적인 업데이트

로컬에서 개발 후 GitHub에 푸시할 때마다 Replit도 업데이트:

```bash
# 로컬에서
git add .
git commit -m "업데이트"
git push origin main

# Replit에서
git pull origin main
npm run build
# Run 버튼 클릭
```

### 2. 변경사항 확인

업데이트 전에 어떤 파일이 변경될지 확인:

```bash
git fetch origin
git diff HEAD origin/main
```

### 3. 백업

중요한 데이터가 있다면 업데이트 전 백업:

```bash
# 데이터베이스 백업
cp server/database.db server/database.db.backup
```

### 4. 브랜치 사용

개발 중인 기능이 있다면 브랜치로 관리:

```bash
# 개발 브랜치 생성
git checkout -b develop

# 개발 후 main에 병합
git checkout main
git merge develop
```

---

## 📚 관련 문서

- `GITHUB_DEPLOY.md` - GitHub 배포 가이드
- `REPLIT_IMPORT.md` - Replit 초기 Import 가이드
- `REPLIT_QUICK_START.md` - Replit 빠른 시작
- `DEPLOY_REPLIT.md` - Replit 배포 상세 가이드

---

## ⚠️ 주의사항

1. **환경 변수 확인**
   - 업데이트 후 Secrets 탭에서 환경 변수가 유지되는지 확인
   - `JWT_SECRET`, `NODE_ENV` 등

2. **데이터베이스**
   - `server/database.db`는 업데이트 시 덮어쓰지 않도록 주의
   - 필요시 백업 후 업데이트

3. **빌드 파일**
   - `client/build/` 폴더는 업데이트 후 재빌드 필요
   - `.gitignore`에 포함되어 있어 자동으로 업데이트되지 않음

---

## 🎉 완료!

업데이트가 완료되면 Replit의 공개 URL을 통해 최신 버전의 애플리케이션을 사용할 수 있습니다!

