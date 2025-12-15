# 실행 가이드 (PowerShell 실행 정책 문제 해결)

## ✅ 해결 방법

PowerShell에서 `npm` 명령어 대신 **`npm.cmd`**를 사용하세요!

---

## 🚀 실행 단계

### 1단계: 환경 변수 파일 생성

```powershell
# server/.env 파일 생성
Copy-Item server\.env.example server\.env
```

또는 직접 생성:
```powershell
Set-Content server\.env "JWT_SECRET=soosan-safety-system-secret-key`nPORT=5000"
```

### 2단계: 의존성 설치

```powershell
npm.cmd run install-all
```

### 3단계: 개발 서버 실행

```powershell
npm.cmd run dev
```

---

## 📝 명령어 요약

```powershell
# 환경 변수 파일 생성 (처음 한 번만)
Copy-Item server\.env.example server\.env

# 의존성 설치 (처음 한 번만)
npm.cmd run install-all

# 개발 서버 실행
npm.cmd run dev
```

---

## 🔧 npm 별칭 설정 (선택사항)

매번 `npm.cmd`를 입력하는 것이 번거롭다면, PowerShell 프로필에 별칭을 추가할 수 있습니다:

```powershell
# 현재 프로필 경로 확인
$PROFILE

# 별칭 추가 (한 번만 실행)
Add-Content $PROFILE "`nSet-Alias -Name npm -Value npm.cmd"
```

별칭 추가 후 PowerShell을 재시작하면 `npm` 명령어를 그대로 사용할 수 있습니다.

---

## 🌐 접속 주소

서버 실행 후:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5000

---

## 🔑 로그인 정보

- **관리자**: `admin` / `admin123`
- **일반 사용자**: `user` / `user123`

---

## 💡 참고사항

- `npm.cmd`는 PowerShell 실행 정책과 관계없이 항상 작동합니다
- `package.json`의 스크립트는 자동으로 `npm.cmd`를 찾아서 실행하므로 문제없습니다
- 다른 npm 명령어도 모두 `npm.cmd`로 사용 가능합니다:
  - `npm.cmd install`
  - `npm.cmd start`
  - `npm.cmd run build`
  등등...


