# PowerShell 실행 정책 문제 해결

## 문제 상황

PowerShell에서 npm 명령어 실행 시 다음과 같은 오류가 발생합니다:

```
npm : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Program Files\nodejs\npm.ps1 파일을 로드할 수 없습니다.
```

이는 PowerShell의 실행 정책(Execution Policy) 때문에 발생하는 문제입니다.

---

## 해결 방법

### 방법 1: 실행 정책 변경 (권장)

PowerShell을 **관리자 권한으로 실행**한 후:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

확인 메시지가 나오면 `Y`를 입력하세요.

**설명:**
- `RemoteSigned`: 로컬에서 만든 스크립트는 실행 가능, 인터넷에서 다운로드한 스크립트는 서명된 것만 실행
- `CurrentUser`: 현재 사용자에게만 적용 (시스템 전체에 영향 없음)

### 방법 2: 임시로 실행 정책 우회

현재 세션에서만 실행 정책을 우회:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

이 방법은 PowerShell을 닫으면 원래대로 돌아갑니다.

### 방법 3: cmd(명령 프롬프트) 사용

PowerShell 대신 **명령 프롬프트(cmd)**를 사용:

1. `Win + R` 키 누르기
2. `cmd` 입력 후 Enter
3. 프로젝트 디렉토리로 이동:
   ```cmd
   cd d:\prj\safe
   ```
4. npm 명령어 실행:
   ```cmd
   npm --version
   npm run install-all
   npm run dev
   ```

### 방법 4: npx 사용 (일부 명령어)

일부 npm 명령어는 npx로 우회 가능:

```powershell
npx --version
```

---

## 실행 정책 확인

현재 실행 정책을 확인하려면:

```powershell
Get-ExecutionPolicy -List
```

---

## 권장 설정

개발 환경에서는 다음 설정을 권장합니다:

```powershell
# 관리자 권한 PowerShell에서 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

이 설정은:
- ✅ 안전함 (서명되지 않은 원격 스크립트는 차단)
- ✅ 로컬 스크립트 실행 가능
- ✅ 현재 사용자에게만 적용 (다른 사용자에게 영향 없음)

---

## 빠른 해결 (복사해서 실행)

PowerShell을 **관리자 권한으로 열고** 다음 명령어를 실행:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

`-Force` 옵션으로 확인 메시지 없이 바로 적용됩니다.

---

## 확인

설정 후 다음 명령어로 확인:

```powershell
npm --version
```

정상적으로 버전이 출력되면 성공입니다!

---

## 추가 정보

- 실행 정책에 대한 자세한 내용: https://go.microsoft.com/fwlink/?LinkID=135170
- 실행 정책은 보안을 위한 것이므로, 신뢰할 수 있는 환경에서만 변경하세요


