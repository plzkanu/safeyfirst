# Git 설정 및 GitHub 푸시 가이드

## 현재 문제 해결

터미널에서 발생한 문제들을 해결하는 방법입니다.

---

## 1단계: Git 사용자 정보 설정

Git 커밋을 위해 사용자 정보를 설정해야 합니다.

### 전역 설정 (모든 프로젝트에 적용)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 현재 프로젝트만 설정

```powershell
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**예시:**
```powershell
git config --global user.name "SOOSAN"
git config --global user.email "soosan@example.com"
```

---

## 2단계: 커밋 생성

사용자 정보를 설정한 후 커밋을 생성합니다:

```powershell
git commit -m "Initial commit"
```

---

## 3단계: 브랜치 확인 및 생성

GitHub 저장소의 기본 브랜치가 `main`인지 `master`인지 확인:

```powershell
# 현재 브랜치 확인
git branch

# main 브랜치가 없으면 생성
git branch -M main
```

또는 `master` 브랜치를 사용하는 경우:

```powershell
git branch -M master
git push -u origin master
```

---

## 4단계: GitHub에 푸시

### main 브랜치 사용 시

```powershell
git push -u origin main
```

### master 브랜치 사용 시

```powershell
git push -u origin master
```

---

## 전체 명령어 순서

```powershell
# 1. Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. 커밋 생성
git commit -m "Initial commit"

# 3. 브랜치 이름 확인/변경
git branch -M main

# 4. GitHub에 푸시
git push -u origin main
```

---

## 문제 해결

### "src refspec main does not match any" 오류

이 오류는 커밋이 없어서 발생합니다. 다음 순서로 해결:

1. 사용자 정보 설정
2. 커밋 생성
3. 브랜치 이름 확인
4. 푸시

### GitHub 인증 오류

GitHub에 푸시하려면 인증이 필요합니다:

**방법 1: Personal Access Token 사용 (권장)**
1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택 (repo)
4. 토큰 생성 후 복사
5. 푸시 시 비밀번호 대신 토큰 사용

**방법 2: GitHub CLI 사용**
```powershell
# GitHub CLI 설치 후
gh auth login
```

**방법 3: SSH 키 사용**
```powershell
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키를 GitHub에 추가
# GitHub > Settings > SSH and GPG keys > New SSH key
```

---

## 빠른 해결 (복사해서 실행)

```powershell
# 사용자 정보 설정 (본인 정보로 변경)
git config --global user.name "SOOSAN"
git config --global user.email "soosan@example.com"

# 커밋 생성
git commit -m "Initial commit"

# 브랜치 이름을 main으로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

---

## 확인

푸시가 성공하면 GitHub 저장소에서 파일들을 확인할 수 있습니다:
https://github.com/plzkanu/soosan_safe

---

## 다음 단계

GitHub에 푸시가 완료되면:

1. Replit에서 "Create Repl" 클릭
2. "Import from GitHub" 선택
3. `https://github.com/plzkanu/soosan_safe` 입력
4. 나머지 배포 단계 진행

