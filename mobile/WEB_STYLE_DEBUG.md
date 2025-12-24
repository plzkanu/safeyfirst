# 웹 스타일 디버깅 가이드

웹에서 스타일이 적용되지 않는 문제를 해결하는 단계별 가이드입니다.

## 🔍 1단계: 브라우저 개발자 도구 확인

브라우저에서 F12를 눌러 개발자 도구를 열고:

1. **Console 탭**: 에러 메시지 확인
2. **Network 탭**: 
   - CSS 파일이 로드되는지 확인
   - `web.css` 또는 유사한 파일이 있는지 확인
3. **Elements 탭**: 
   - 요소를 선택하고 `className` 속성이 있는지 확인
   - 스타일이 적용되어 있는지 확인

## 🔧 2단계: 완전한 캐시 클리어

```powershell
cd mobile

# 모든 캐시 삭제
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue

# 서버 재시작
npm run web
```

## 🔄 3단계: 완전 재설치

```powershell
cd mobile

# 모든 것 삭제
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 재설치
npm install

# 서버 시작
npm run web
```

## ✅ 4단계: 설정 확인

다음 파일들이 올바르게 설정되어 있는지 확인:

1. **metro.config.js**: `withNativeWind` 설정 확인
2. **global.css**: `@tailwind` 지시어 확인
3. **app/_layout.tsx**: `import '../global.css'` 확인
4. **tailwind.config.js**: `content` 경로 확인

## 🐛 5단계: 대안 방법

만약 위 방법들이 작동하지 않으면:

1. **인라인 스타일 사용**: 일시적으로 `style` prop 사용
2. **StyleSheet 사용**: React Native의 `StyleSheet.create` 사용
3. **웹 전용 CSS 파일**: 웹에서만 사용할 별도 CSS 파일 생성

## 📝 참고

NativeWind v4는 웹을 지원하지만, 때로는 추가 설정이 필요할 수 있습니다.
문제가 계속되면 NativeWind GitHub 이슈를 확인하세요.







