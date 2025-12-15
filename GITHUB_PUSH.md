# GitHub 푸시 가이드

## 현재 상태

✅ Git 사용자 정보 설정 완료
✅ 초기 커밋 생성 완료
✅ 브랜치를 main으로 변경 완료
✅ GitHub 원격 저장소 추가 완료

---

## 다음 단계: GitHub에 푸시

### 방법 1: Personal Access Token 사용 (권장)

GitHub에 푸시하려면 인증이 필요합니다.

1. **Personal Access Token 생성**
   - GitHub 웹사이트 접속
   - 우측 상단 프로필 클릭 > Settings
   - 왼쪽 메뉴에서 "Developer settings" 클릭
   - "Personal access tokens" > "Tokens (classic)" 클릭
   - "Generate new token" > "Generate new token (classic)" 클릭
   - Note: "Replit Deployment" 등 설명 입력
   - Expiration: 원하는 기간 선택
   - Scopes: `repo` 체크 (모든 권한)
   - "Generate token" 클릭
   - **토큰을 복사해두세요!** (다시 볼 수 없습니다)

2. **푸시 실행**
   ```powershell
   git push -u origin main
   ```
   
   - Username: GitHub 사용자명 입력
   - Password: **Personal Access Token** 입력 (비밀번호가 아님!)

### 방법 2: GitHub CLI 사용

```powershell
# GitHub CLI 설치 (선택사항)
winget install --id GitHub.cli

# 인증
gh auth login

# 푸시
git push -u origin main
```

### 방법 3: SSH 키 사용

```powershell
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키 확인
cat ~/.ssh/id_ed25519.pub

# GitHub에 SSH 키 추가
# 1. GitHub > Settings > SSH and GPG keys
# 2. "New SSH key" 클릭
# 3. 위에서 복사한 공개 키 붙여넣기

# 원격 저장소 URL을 SSH로 변경
git remote set-url origin git@github.com:plzkanu/soosan_safe.git

# 푸시
git push -u origin main
```

---

## 빠른 푸시 (Personal Access Token 사용)

```powershell
git push -u origin main
```

프롬프트가 나타나면:
- **Username**: `plzkanu`
- **Password**: Personal Access Token (비밀번호 아님!)

---

## 푸시 확인

푸시가 성공하면 다음 메시지가 표시됩니다:

```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/plzkanu/soosan_safe.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

그리고 GitHub 저장소에서 파일들을 확인할 수 있습니다:
https://github.com/plzkanu/soosan_safe

---

## 문제 해결

### "Authentication failed" 오류

- Personal Access Token을 사용했는지 확인
- 토큰에 `repo` 권한이 있는지 확인
- 토큰이 만료되지 않았는지 확인

### "Permission denied" 오류

- 저장소에 대한 쓰기 권한이 있는지 확인
- 저장소 소유자이거나 Collaborator로 추가되어 있는지 확인

### "Repository not found" 오류

- 저장소 URL이 올바른지 확인
- 저장소가 존재하는지 확인
- Private 저장소인 경우 인증이 필요합니다

---

## 다음 단계

GitHub에 푸시가 완료되면:

1. Replit에서 "Create Repl" 클릭
2. "Import from GitHub" 선택
3. `https://github.com/plzkanu/soosan_safe` 입력
4. 나머지 배포 단계 진행 (`REPLIT_QUICK_START.md` 참고)

