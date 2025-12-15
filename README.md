# 발전소 안전 활동 관리 시스템

모바일에서 발전소의 안전과 관련한 활동을 기록, 저장하고 관리자가 통계 및 관리를 할 수 있는 웹 프로그램입니다.

## 주요 기능

- 🔐 로그인 및 권한 관리
- 📱 모바일 친화적 UI
- 📝 안전 활동 기록 및 저장
- 📊 관리자 통계 및 관리 대시보드
- 🏢 SOOSAN 브랜드 아이덴티티 통합

## 기술 스택

### 프론트엔드
- React
- React Router
- Axios
- Material-UI (모바일 친화적)

### 백엔드
- Node.js
- Express
- SQLite (데이터베이스)
- JWT (인증)
- bcrypt (비밀번호 암호화)

## 설치 방법

```bash
# 모든 의존성 설치
npm run install-all

# 개발 서버 실행 (프론트엔드 + 백엔드)
npm run dev
```

## 프로젝트 구조

```
safe/
├── client/          # React 프론트엔드
├── server/          # Node.js 백엔드
├── package.json
└── README.md
```

## 기본 계정

- 관리자: admin / admin123
- 일반 사용자: user / user123

## 환경 변수

서버 실행을 위해 `server/.env` 파일을 생성하고 다음을 설정하세요:

```
JWT_SECRET=your-secret-key-here
PORT=5000
```

또는 `server/.env.example` 파일을 복사하여 사용하세요:

```bash
cp server/.env.example server/.env
```

## SOOSAN 로고 추가

SOOSAN 로고 이미지를 추가하려면:

1. `client/public/logo.png` 파일에 로고 이미지를 추가하세요
2. `client/src/components/Logo.js` 파일에서 이미지 사용 부분의 주석을 해제하세요

## 사용 방법

1. **로그인**: 기본 관리자 계정(admin/admin123) 또는 일반 사용자 계정(user/user123)으로 로그인
2. **활동 기록**: "활동 추가" 메뉴에서 안전 활동을 기록
3. **활동 조회**: "활동 목록"에서 자신이 기록한 활동을 조회, 수정, 삭제
4. **관리자 기능**:
   - 전체 활동 조회 및 통계 분석
   - 사용자 관리
   - 다양한 차트와 그래프를 통한 데이터 시각화

## 모바일 지원

이 애플리케이션은 모바일 기기에서도 최적화되어 있습니다:
- 반응형 디자인
- 터치 친화적 UI
- 모바일 브라우저에서 PWA로 설치 가능

