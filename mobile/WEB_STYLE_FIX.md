# 웹 스타일 문제 해결 가이드

웹에서 NativeWind 스타일이 적용되지 않는 경우 다음 단계를 따라주세요.

## 🔧 해결 방법

### 1. 캐시 클리어 및 재시작

```bash
cd mobile

# 캐시 삭제
rm -rf .expo
rm -rf node_modules/.cache

# 서버 재시작
npm run web
```

### 2. Metro bundler 캐시 클리어

```bash
cd mobile
npx expo start --web --clear
```

### 3. 완전 재설치 (필요한 경우)

```bash
cd mobile
rm -rf node_modules
rm -rf .expo
npm install
npm run web
```

## ✅ 확인 사항

1. **global.css가 import 되고 있는지 확인**
   - `mobile/app/_layout.tsx` 파일에 `import '../global.css';`가 있는지 확인

2. **Metro config 확인**
   - `mobile/metro.config.js`에 NativeWind 설정이 있는지 확인

3. **Tailwind config 확인**
   - `mobile/tailwind.config.js`의 content 경로가 올바른지 확인

## 🐛 문제가 계속되면

브라우저 개발자 도구(F12)를 열고:
1. Console 탭에서 에러 확인
2. Network 탭에서 CSS 파일이 로드되는지 확인
3. Elements 탭에서 className이 적용되는지 확인

## 📝 참고

NativeWind v4는 웹에서 자동으로 작동해야 합니다. 
문제가 계속되면 NativeWind GitHub 이슈를 확인하세요.







