# 산업 안전 테마 색상 팔레트

## 색상 시스템

### 주조색 (Primary) - Safety Orange
산업 안전을 상징하는 안전 오렌지 색상을 주조색으로 사용합니다.

- **primary-500**: `#ff8c00` - 메인 색상 (Safety Orange)
- **primary-400**: `#ffa333` - 밝은 버전
- **primary-600**: `#cc7000` - 어두운 버전

**사용 예시:**
- 활성 탭 아이콘
- 주요 버튼
- 강조 요소

### 보조색 (Secondary) - Safety Blue
신뢰와 안정을 상징하는 안전 블루 색상을 보조색으로 사용합니다.

- **secondary-500**: `#007dff` - 메인 색상 (Safety Blue)
- **secondary-400**: `#3397ff` - 밝은 버전
- **secondary-600**: `#0064cc` - 어두운 버전

**사용 예시:**
- 정보 카드
- 보조 버튼
- 링크

### 그레이 스케일 (Gray)
텍스트와 배경에 사용되는 중립 색상입니다.

- **gray-50**: `#f9fafb` - 가장 밝은 배경
- **gray-100**: `#f3f4f6` - 밝은 배경
- **gray-500**: `#6b7280` - 기본 텍스트
- **gray-900**: `#111827` - 어두운 배경

### 상태 색상

#### Success (성공)
- **success-500**: `#22c55e` - 성공 메시지, 완료 상태

#### Warning (경고)
- **warning-500**: `#f59e0b` - 경고 메시지, 주의 필요

#### Danger (위험)
- **danger-500**: `#ef4444` - 오류 메시지, 신고 항목

## 다크 모드 지원

모든 색상은 다크 모드를 지원합니다:
- `dark:` 접두사를 사용하여 다크 모드 색상 정의
- 예: `bg-white dark:bg-gray-900`

## 사용 가이드

### Tailwind CSS 클래스 예시

```tsx
// 주조색 사용
<View className="bg-primary-500">
<Text className="text-primary-600">

// 보조색 사용
<View className="bg-secondary-50 dark:bg-secondary-900/20">

// 그레이 사용
<Text className="text-gray-600 dark:text-gray-400">

// 상태 색상 사용
<View className="bg-success-50 dark:bg-success-900/20">
<View className="bg-danger-50 dark:bg-danger-900/20">
```

## 디자인 원칙

1. **가독성 우선**: 충분한 대비 확보
2. **일관성**: 전체 앱에서 동일한 색상 시스템 사용
3. **접근성**: 색맹 사용자도 구분 가능하도록 텍스트와 아이콘 병행
4. **산업 안전**: 안전을 상징하는 오렌지와 블루 중심

