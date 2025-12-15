# SOOSAN 안전 관리 시스템 - 모바일 앱

Expo Router를 사용한 React Native 모바일 애플리케이션입니다.

## 📱 기능

- **홈 (Dashboard)**: 대시보드 및 주요 정보 표시
- **점검 (Inspection)**: 안전 점검 및 설비 점검 기록
- **신고 (Report)**: 안전 사고 및 이상 상황 신고
- **설정 (Settings)**: 애플리케이션 설정 관리

## 🚀 실행 방법

### 개발 서버 시작

```bash
# 모바일 앱 실행
npm start
# 또는
cd mobile && npm start
```

### 플랫폼별 실행

```bash
# Android
npm run mobile:android
# 또는
cd mobile && npm run android

# iOS (macOS 필요)
npm run mobile:ios
# 또는
cd mobile && npm run ios

# Web
npm run mobile:web
# 또는
cd mobile && npm run web
```

## 📂 프로젝트 구조

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx    # 탭 네비게이션 레이아웃
│   │   ├── index.tsx      # 홈 (Dashboard)
│   │   ├── inspection.tsx # 점검
│   │   ├── report.tsx     # 신고
│   │   └── settings.tsx   # 설정
│   └── _layout.tsx        # 루트 레이아웃
├── components/            # 재사용 컴포넌트
├── constants/             # 상수 정의
└── assets/                # 이미지 및 폰트
```

## 🎨 사용된 라이브러리

- **Expo Router**: 파일 기반 라우팅
- **lucide-react-native**: 아이콘 라이브러리
- **React Navigation**: 네비게이션 라이브러리

## 📝 다음 단계

1. 백엔드 API 연동
2. 인증 기능 구현
3. 각 탭의 기능 구현
4. 데이터 동기화

## 🔗 관련 문서

- [Expo Router 문서](https://docs.expo.dev/router/introduction/)
- [React Native 문서](https://reactnative.dev/)

