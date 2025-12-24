# 개발 워크플로우 가이드

Cursor에서 개발 → GitHub 푸시 → Replit 배포까지의 전체 워크플로우입니다.

---

## 📋 전체 워크플로우 개요

```
[Cursor에서 개발] 
    ↓
[GitHub에 푸시] 
    ↓
[Replit에서 Pull 및 배포]
```

---

## 🔧 1단계: Cursor에서 개발

### 1.1 로컬 개발 환경 실행

프로젝트 루트 디렉토리(`d:\prj\safe`)에서:

```powershell
# 의존성 설치 (처음 한 번만)
npm.cmd run install-all

# 개발 서버 실행 (프론트엔드 + 백엔드)
npm.cmd run dev
```

**실행 결과:**
- 백엔드: http://localhost:5000
- 프론트엔드: http://localhost:3000 (자동으로 브라우저 열림)

### 1.2 개발 중 확인사항

- 코드 수정 시 자동으로 재시작/리로드됨
- 브라우저에서 실시간으로 변경사항 확인
- 터미널에서 오류 메시지 확인

### 1.3 개발 완료 후

변경사항이 정상 작동하는지 확인 후 다음 단계로 진행

---

## 📤 2단계: GitHub에 푸시

### 2.1 변경사항 확인

```powershell
# 현재 상태 확인
git status
```

### 2.2 변경사항 추가

```powershell
# 모든 변경사항 추가
git add .

# 또는 특정 파일만 추가
git add 파일명
```

### 2.3 커밋 생성

```powershell
# 의미있는 커밋 메시지 작성
git commit -m "변경 내용 설명"

# 예시:
# git commit -m "로그인 페이지 UI 개선"
# git commit -m "관리자 통계 기능 추가"
# git commit -m "버그 수정: 활동 목록 필터링 오류"
```

**좋은 커밋 메시지 예시:**
- `feat: 새로운 기능 추가`
- `fix: 버그 수정`
- `style: UI/스타일 변경`
- `refactor: 코드 리팩토링`
- `docs: 문서 수정`

### 2.4 GitHub에 푸시

```powershell
# main 브랜치에 푸시
git push origin main

# 또는 간단하게
git push
```

**푸시 확인:**
- GitHub 저장소에서 변경사항 확인: https://github.com/plzkanu/soosan_safe

---

## 🚀 3단계: Replit에서 배포

### 3.1 Replit 접속

1. https://replit.com 접속
2. 프로젝트 선택 (이미 생성되어 있어야 함)

### 3.2 최신 코드 가져오기

Replit 터미널에서:

```bash
# GitHub에서 최신 변경사항 가져오기
git pull origin main
```

### 3.3 의존성 확인 및 재설치 (필요시)

변경된 `package.json`이 있다면:

```bash
# 의존성 재설치
npm run install-all
```

**일반적으로는 생략 가능** (변경사항이 없으면)

### 3.4 프론트엔드 재빌드

```bash
# 프론트엔드 빌드
npm run build
```

**중요**: 코드 변경 시 반드시 실행해야 합니다!

### 3.5 서버 재시작

**방법 A: Run 버튼 사용 (권장)**
1. Replit 상단의 **"Stop"** 버튼 클릭 (실행 중인 경우)
2. **"Run"** 버튼 클릭

**방법 B: 터미널에서 실행**
```bash
# 서버 중지 (Ctrl+C)
# 그 다음
npm run start:prod
```

### 3.6 배포 확인

1. **Webview** 탭 클릭
2. 변경사항이 반영되었는지 확인
3. 기능 테스트

---

## 📝 전체 워크플로우 요약

### 로컬 개발 (Cursor)

```powershell
# 1. 개발 서버 실행
npm.cmd run dev

# 2. 코드 수정 및 테스트
# ... 개발 작업 ...

# 3. 개발 완료 후 서버 중지 (Ctrl+C)
```

### GitHub 푸시

```powershell
# 1. 변경사항 확인
git status

# 2. 변경사항 추가
git add .

# 3. 커밋 생성
git commit -m "변경 내용 설명"

# 4. GitHub에 푸시
git push
```

### Replit 배포

```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 프론트엔드 빌드
npm run build

# 3. 서버 재시작
# Run 버튼 클릭 또는
npm run start:prod
```

---

## 🔄 빠른 업데이트 워크플로우

작은 변경사항의 경우:

### 로컬
```powershell
git add .
git commit -m "작은 수정"
git push
```

### Replit
```bash
git pull
npm run build
# Run 버튼 클릭
```

---

## ⚠️ 주의사항

### 1. 환경 변수

- 로컬: `server/.env` 파일 사용
- Replit: Secrets 탭에서 환경 변수 설정
- 환경 변수 변경 시 Replit Secrets도 업데이트 필요

### 2. 데이터베이스

- 로컬: `server/database.db` 파일
- Replit: 동일하게 `server/database.db` 파일
- **중요**: Replit의 데이터베이스는 프로젝트 삭제 시 함께 삭제됨
- 정기적인 백업 권장

### 3. 빌드 필수

- 프론트엔드 코드 변경 시 반드시 `npm run build` 실행
- 백엔드 코드만 변경 시 빌드 불필요 (서버 재시작만)

### 4. 커밋 메시지

- 의미있는 커밋 메시지 작성
- 나중에 변경 이력을 추적하기 쉽게

---

## 🐛 문제 해결

### Git 푸시 오류

```powershell
# 원격 저장소 상태 확인
git fetch

# 충돌 해결 후
git pull
git push
```

### Replit 빌드 오류

```bash
# 클라이언트 캐시 삭제 후 재빌드
cd client
rm -rf node_modules build
npm install
npm run build
cd ..
```

### Replit 서버 오류

```bash
# 로그 확인
# 터미널에서 오류 메시지 확인

# 환경 변수 확인
# Secrets 탭에서 변수들이 제대로 설정되었는지 확인
```

---

## 💡 팁

### 1. 개발 전 확인

```powershell
# 최신 코드로 시작
git pull
```

### 2. 커밋 전 확인

```powershell
# 변경사항 확인
git status
git diff
```

### 3. 배포 전 테스트

- 로컬에서 충분히 테스트 후 푸시
- 작은 변경사항도 테스트 필수

### 4. 정기적인 백업

- Replit 데이터베이스 정기 백업
- 중요한 데이터는 별도로 보관

---

## 📚 관련 문서

- `QUICK_START.md` - 로컬 개발 환경 설정
- `REPLIT_QUICK_START.md` - Replit 빠른 배포
- `REPLIT_DEPLOY_STEPS.md` - Replit 상세 배포 가이드
- `REPLIT_IMPORT.md` - Replit에 프로젝트 Import 가이드
- `GIT_SETUP.md` - Git 설정 가이드

---

이제 이 워크플로우를 따라 개발 → 푸시 → 배포를 반복하세요! 🚀

