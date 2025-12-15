# SOOSAN 로고 이미지 추가 방법

## 이미지 파일 위치

SOOSAN 로고 이미지를 다음 위치에 추가하세요:

- `mobile/assets/images/soosan-logo.png` (권장)
- `mobile/assets/images/logo.png`

## 지원 형식

- PNG (권장, 투명 배경)
- JPG/JPEG
- SVG (제한적 지원)

## 권장 사양

- **크기**: 높이 50-100px (비율 유지)
- **배경**: 투명 배경 (PNG 권장)
- **해상도**: 고해상도 (Retina 디스플레이 대응)

## 이미지 추가 후

`mobile/components/Logo.tsx` 파일에서 이미지 경로를 설정하세요:

```typescript
const logoImage = require('@/assets/images/soosan-logo.png');
```

또는

```typescript
const logoImage = require('../assets/images/soosan-logo.png');
```

이미지가 없거나 로드에 실패하면 텍스트 로고로 자동 대체됩니다.

## 현재 텍스트 로고 스타일

- **S, 첫 번째 O, S, A, N**: 진한 파란색 (#1e40af)
- **두 번째 O**: 청록색 (#06b6d4) - 그라데이션 효과 시뮬레이션
- **세 번째 O**: 녹색 (#22c55e) - 그라데이션 효과 시뮬레이션

