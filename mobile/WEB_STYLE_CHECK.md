# 웹 스타일 확인 체크리스트

브라우저에서 다음을 확인하세요:

## 🔍 브라우저 개발자 도구 확인 (F12)

### 1. Console 탭
- 에러 메시지가 있는지 확인
- NativeWind 관련 에러가 있는지 확인

### 2. Network 탭
- 페이지 새로고침 (F5)
- `web.css` 또는 `.css` 파일이 로드되는지 확인
- 파일이 404 에러인지 확인

### 3. Elements 탭
- `<div>` 요소를 선택
- `className` 속성이 있는지 확인
- 예: `className="flex-1 pb-6"`
- Styles 패널에서 스타일이 적용되어 있는지 확인

## ✅ 예상되는 결과

정상 작동 시:
- Elements에서 `className` 속성 확인 가능
- Styles 패널에 Tailwind 클래스가 CSS로 변환되어 표시
- 예: `className="text-3xl"` → `font-size: 1.875rem`

## 🐛 문제가 있는 경우

1. **className이 없는 경우**: NativeWind가 작동하지 않음
2. **CSS 파일이 로드되지 않는 경우**: Metro bundler 문제
3. **에러 메시지가 있는 경우**: 설정 문제

## 📝 다음 단계

문제를 확인한 후:
1. 에러 메시지를 복사
2. Network 탭의 스크린샷
3. Elements 탭의 className 확인 결과

이 정보를 공유해주시면 더 정확한 해결책을 제시할 수 있습니다.







