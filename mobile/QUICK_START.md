# 빠른 시작 가이드

로컬에서 웹으로 실행하여 수정하는 방법입니다.

## 🚀 실행 방법

### 1단계: 의존성 설치 (처음 한 번만)
```bash
cd mobile
npm install
```

### 2단계: 웹 개발 서버 실행
```bash
npm run web
```

또는

```bash
npm start
# 그 다음 'w' 키를 눌러 웹 실행
```

### 3단계: 브라우저에서 확인
- 자동으로 브라우저가 열립니다
- 또는 터미널에 표시된 URL로 접속 (보통 `http://localhost:8081`)

## 📝 수정 방법

1. **코드 수정**: `mobile/app/`, `mobile/components/` 등의 파일을 수정
2. **자동 새로고침**: 파일을 저장하면 브라우저가 자동으로 새로고침됩니다 (Hot Reload)
3. **변경사항 확인**: 브라우저에서 즉시 확인 가능

## 🛠️ 주요 명령어

```bash
# 웹 개발 서버 시작
npm run web

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행 (macOS만)
npm run ios

# 일반 개발 서버 (플랫폼 선택 가능)
npm start
```

## 📂 주요 디렉토리

- `mobile/app/` - 화면 파일들
  - `(tabs)/` - 탭 화면들 (홈, 점검, 신고, 설정)
  - `login.tsx` - 로그인 화면
  - `notifications.tsx` - 알림 센터
- `mobile/components/` - 재사용 컴포넌트
- `mobile/contexts/` - Context API (상태 관리)
- `mobile/types/` - TypeScript 타입 정의

## 🔧 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# 다른 포트로 실행
npx expo start --web --port 3000
```

### 캐시 문제
```bash
# 캐시 클리어 후 재시작
rm -rf .expo
npm start
```

### 의존성 문제
```bash
# node_modules 재설치
rm -rf node_modules
npm install
```

## 💡 개발 팁

1. **Hot Reload**: 파일 저장 시 자동 새로고침
2. **개발자 도구**: 브라우저 F12로 개발자 도구 열기
3. **콘솔 로그**: `console.log()`로 디버깅
4. **TypeScript**: 타입 오류는 에디터에서 바로 확인 가능

## 📱 테스트 계정

로그인 화면에서 사용할 수 있는 테스트 계정:

- **관리자**: 
  - 이메일: `admin@soosan.com`
  - 비밀번호: `admin123`

- **일반 사용자**:
  - 이메일: `user@soosan.com`
  - 비밀번호: `user123`







