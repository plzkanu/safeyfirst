# GitHub 배포 가이드

현재 프로젝트를 GitHub에 배포하는 방법을 안내합니다.

## 📋 현재 상태

✅ Git 저장소 초기화 완료  
✅ 원격 저장소 연결 완료: `https://github.com/plzkanu/soosan_safe.git`  
✅ 브랜치: `main`

---

## 🚀 GitHub에 배포하는 방법

### 1단계: 변경사항 확인

현재 변경된 파일들을 확인합니다:

```powershell
git status
```

### 2단계: 변경사항 추가

모든 변경사항을 스테이징 영역에 추가합니다:

```powershell
# 모든 변경사항 추가
git add .

# 또는 특정 파일만 추가
git add 파일명
```

### 3단계: 커밋 생성

변경사항을 커밋합니다:

```powershell
git commit -m "프로젝트 업데이트"
```

**커밋 메시지 예시:**
- `"기능 추가: 문서 제출 기능 구현"`
- `"버그 수정: 로그인 오류 해결"`
- `"프로젝트 초기 배포"`

### 4단계: GitHub에 푸시

GitHub에 코드를 푸시합니다:

```powershell
git push origin main
```

또는 처음 푸시하는 경우:

```powershell
git push -u origin main
```

---

## 🔐 인증 방법

GitHub에 푸시하려면 인증이 필요합니다. 다음 중 하나를 선택하세요:

### 방법 1: Personal Access Token (권장)

**가장 간단하고 안전한 방법입니다.**

1. **Personal Access Token 생성**
   - GitHub 웹사이트 접속: https://github.com
   - 우측 상단 프로필 아이콘 클릭 → **Settings**
   - 왼쪽 메뉴에서 **Developer settings** 클릭
   - **Personal access tokens** → **Tokens (classic)** 클릭
   - **Generate new token** → **Generate new token (classic)** 클릭
   - **Note**: "Replit Deployment" 등 설명 입력
   - **Expiration**: 원하는 기간 선택 (예: 90 days, 1 year)
   - **Scopes**: `repo` 체크박스 선택 (모든 권한)
   - **Generate token** 클릭
   - **⚠️ 중요**: 생성된 토큰을 복사해두세요! (다시 볼 수 없습니다)

2. **푸시 실행**
   ```powershell
   git push origin main
   ```
   
   프롬프트가 나타나면:
   - **Username**: `plzkanu` (또는 본인의 GitHub 사용자명)
   - **Password**: **Personal Access Token** 입력 (비밀번호가 아님!)

### 방법 2: GitHub CLI 사용

```powershell
# GitHub CLI 설치 (선택사항)
winget install --id GitHub.cli

# 인증
gh auth login

# 푸시
git push origin main
```

### 방법 3: SSH 키 사용

```powershell
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키 확인
cat ~/.ssh/id_ed25519.pub
# 또는 Windows에서:
type ~\.ssh\id_ed25519.pub
```

**GitHub에 SSH 키 추가:**
1. GitHub > Settings > SSH and GPG keys
2. **New SSH key** 클릭
3. 위에서 복사한 공개 키 붙여넣기
4. **Add SSH key** 클릭

**원격 저장소 URL을 SSH로 변경:**
```powershell
git remote set-url origin git@github.com:plzkanu/soosan_safe.git
```

**푸시:**
```powershell
git push origin main
```

---

## 📝 전체 명령어 순서 (빠른 참조)

```powershell
# 1. 현재 상태 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋 생성
git commit -m "프로젝트 업데이트"

# 4. GitHub에 푸시
git push origin main
```

---

## ✅ 푸시 성공 확인

푸시가 성공하면 다음과 같은 메시지가 표시됩니다:

```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/plzkanu/soosan_safe.git
   abc1234..def5678  main -> main
```

그리고 GitHub 저장소에서 파일들을 확인할 수 있습니다:
**https://github.com/plzkanu/soosan_safe**

---

## 🛠️ 문제 해결

### "Authentication failed" 오류

- Personal Access Token을 사용했는지 확인
- 토큰에 `repo` 권한이 있는지 확인
- 토큰이 만료되지 않았는지 확인
- 비밀번호가 아닌 **토큰**을 입력했는지 확인

### "Permission denied" 오류

- 저장소에 대한 쓰기 권한이 있는지 확인
- 저장소 소유자이거나 Collaborator로 추가되어 있는지 확인

### "Repository not found" 오류

- 저장소 URL이 올바른지 확인: `git remote -v`
- 저장소가 존재하는지 확인
- Private 저장소인 경우 인증이 필요합니다

### "Nothing to commit" 메시지

- 모든 변경사항이 이미 커밋되어 있습니다
- 새로운 변경사항이 있는지 확인: `git status`

### 커밋 메시지 편집기 문제

PowerShell에서 커밋 메시지를 직접 입력하려면:

```powershell
git commit -m "커밋 메시지"
```

---

## 🔄 이후 업데이트 방법

코드를 수정한 후 GitHub에 업데이트하려면:

```powershell
# 1. 변경사항 추가
git add .

# 2. 커밋
git commit -m "변경사항 설명"

# 3. 푸시
git push origin main
```

---

## 📦 다음 단계: Replit 배포

GitHub에 푸시가 완료되면 Replit에서 배포할 수 있습니다:

1. **Replit 접속**: https://replit.com
2. **Create Repl** 클릭
3. **Import from GitHub** 선택
4. 저장소 URL 입력: `https://github.com/plzkanu/soosan_safe`
5. 나머지 배포 단계 진행 (`REPLIT_QUICK_START.md` 참고)

---

## 💡 유용한 Git 명령어

```powershell
# 현재 상태 확인
git status

# 변경된 파일 확인
git diff

# 커밋 히스토리 확인
git log

# 원격 저장소 확인
git remote -v

# 브랜치 확인
git branch

# 최신 변경사항 가져오기
git pull origin main
```

---

## ⚠️ 주의사항

1. **민감한 정보는 커밋하지 마세요**
   - `.env` 파일은 `.gitignore`에 포함되어 있습니다
   - API 키, 비밀번호 등은 환경 변수로 관리하세요

2. **큰 파일은 제외하세요**
   - `node_modules/`는 자동으로 제외됩니다
   - 데이터베이스 파일(`database.db`)도 제외됩니다

3. **커밋 전에 확인하세요**
   - `git status`로 추가될 파일 확인
   - 불필요한 파일은 `.gitignore`에 추가

---

## 📚 관련 문서

- `GIT_SETUP.md` - Git 초기 설정
- `GITHUB_PUSH.md` - GitHub 푸시 상세 가이드
- `REPLIT_QUICK_START.md` - Replit 배포 가이드
- `REPLIT_IMPORT.md` - Replit GitHub 연동

