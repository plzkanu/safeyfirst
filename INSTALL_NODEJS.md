# Node.js 설치 가이드

현재 시스템에 Node.js가 설치되어 있지 않습니다. 다음 단계를 따라 Node.js를 설치하세요.

## Windows에서 Node.js 설치 방법

### 방법 1: 공식 웹사이트에서 설치 (권장)

1. **Node.js 공식 웹사이트 방문**
   - https://nodejs.org/ 접속
   - LTS (Long Term Support) 버전 다운로드 (권장)
   - 최소 버전: v14.0.0 이상

2. **설치 프로그램 실행**
   - 다운로드한 `.msi` 파일 실행
   - 설치 마법사 따라하기
   - **중요**: "Add to PATH" 옵션이 체크되어 있는지 확인

3. **설치 확인**
   - PowerShell 또는 명령 프롬프트를 **새로 열기**
   - 다음 명령어 실행:
     ```powershell
     node --version
     npm --version
     ```

### 방법 2: Chocolatey를 사용한 설치

Chocolatey가 설치되어 있다면:

```powershell
choco install nodejs-lts
```

### 방법 3: winget을 사용한 설치 (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## 설치 후 확인

PowerShell을 **새로 열고** 다음 명령어로 확인:

```powershell
node --version
npm --version
```

두 명령어 모두 버전 번호를 출력하면 정상적으로 설치된 것입니다.

## 설치 후 프로젝트 실행

Node.js 설치가 완료되면:

1. **의존성 설치**
   ```powershell
   npm run install-all
   ```

2. **개발 서버 실행**
   ```powershell
   npm run dev
   ```

## 문제 해결

### PATH에 추가되지 않은 경우

1. Node.js 설치 경로 확인 (보통 `C:\Program Files\nodejs\`)
2. 시스템 환경 변수에 PATH 추가:
   - Windows 설정 > 시스템 > 정보 > 고급 시스템 설정
   - 환경 변수 클릭
   - 시스템 변수에서 Path 선택 > 편집
   - `C:\Program Files\nodejs\` 추가
   - PowerShell 재시작

### 설치 후에도 인식되지 않는 경우

PowerShell을 **완전히 종료하고 다시 열어보세요**. 환경 변수 변경사항이 적용되려면 새 세션이 필요합니다.

