# Git 설치 가이드

현재 시스템에 Git이 설치되어 있지 않습니다. Replit 배포를 위해 Git을 설치하거나, 다른 방법을 사용할 수 있습니다.

## 방법 1: Git 설치 (권장)

### Windows에서 Git 설치

1. **공식 웹사이트에서 다운로드**
   - https://git-scm.com/download/win 접속
   - 자동으로 다운로드 시작 (64-bit Git for Windows Setup)

2. **설치 프로그램 실행**
   - 다운로드한 `.exe` 파일 실행
   - 설치 마법사 따라하기
   - 기본 설정으로 설치해도 됩니다
   - **중요**: "Add Git to PATH" 옵션이 체크되어 있는지 확인

3. **설치 확인**
   - PowerShell을 **새로 열기** (중요!)
   - 다음 명령어 실행:
     ```powershell
     git --version
     ```

### Chocolatey를 사용한 설치

Chocolatey가 설치되어 있다면:

```powershell
choco install git
```

### winget을 사용한 설치 (Windows 10/11)

```powershell
winget install --id Git.Git -e --source winget
```

---

## 방법 2: Git 없이 Replit에 배포

Git이 없어도 Replit에 직접 배포할 수 있습니다!

### Replit에 직접 업로드

1. **Replit에서 프로젝트 생성**
   - https://replit.com 접속
   - "Create Repl" 클릭
   - "Node.js" 템플릿 선택

2. **파일 업로드**
   - Replit 파일 탐색기에서 파일들을 드래그 앤 드롭
   - 또는 직접 파일 생성

3. **필수 파일 확인**
   - `.replit` 파일
   - `replit.nix` 파일
   - `package.json` 파일
   - `server/` 폴더
   - `client/` 폴더

---

## 방법 3: ZIP 파일로 업로드

1. **프로젝트 압축**
   - 프로젝트 폴더를 ZIP으로 압축
   - `node_modules` 폴더는 제외 (용량이 큼)

2. **Replit에 업로드**
   - Replit 파일 탐색기에서 ZIP 파일 업로드
   - Replit이 자동으로 압축 해제

---

## 설치 후 확인

PowerShell을 **새로 열고** 다음 명령어로 확인:

```powershell
git --version
```

버전 번호가 출력되면 정상적으로 설치된 것입니다.

---

## Git 설치 후 프로젝트 초기화

Git 설치가 완료되면:

```powershell
# Git 초기화
git init

# .gitignore 파일이 이미 있으므로 자동으로 적용됨

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"
```

---

## 문제 해결

### PATH에 추가되지 않은 경우

1. Git 설치 경로 확인 (보통 `C:\Program Files\Git\cmd\`)
2. 시스템 환경 변수에 PATH 추가:
   - Windows 설정 > 시스템 > 정보 > 고급 시스템 설정
   - 환경 변수 클릭
   - 시스템 변수에서 Path 선택 > 편집
   - `C:\Program Files\Git\cmd\` 추가
   - PowerShell 재시작

### 설치 후에도 인식되지 않는 경우

PowerShell을 **완전히 종료하고 다시 열어보세요**. 환경 변수 변경사항이 적용되려면 새 세션이 필요합니다.

---

## Replit 배포 (Git 없이)

Git이 없어도 Replit에 배포할 수 있습니다:

1. Replit에서 "Create Repl" 클릭
2. "Node.js" 템플릿 선택
3. 파일들을 직접 업로드
4. 환경 변수 설정 (Secrets 탭)
5. `npm run install-all` 실행
6. `npm run build` 실행
7. `npm run start:prod` 실행

자세한 내용은 `REPLIT_QUICK_START.md`를 참고하세요!


