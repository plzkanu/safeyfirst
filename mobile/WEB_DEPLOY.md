# 웹 배포 가이드

SOOSAN 안전 관리 시스템을 웹으로 배포하는 방법입니다.

## 🚀 로컬에서 웹 실행

### 개발 모드
```bash
cd mobile
npm install
npm run web
```

브라우저에서 `http://localhost:8081` (또는 표시된 포트)로 접속합니다.

## 📦 웹 빌드

### 정적 파일 생성
```bash
cd mobile
npm run build:web
```

빌드된 파일은 `mobile/dist/` 디렉토리에 생성됩니다.

### 로컬에서 빌드 결과 확인
```bash
npm run preview:web
```

또는 다른 정적 파일 서버 사용:
```bash
# Python 사용
cd dist
python -m http.server 8000

# Node.js serve 사용
npx serve dist
```

## 🌐 배포 옵션

### 1. Vercel (추천)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd mobile
vercel
```

또는 GitHub 연동:
1. [Vercel](https://vercel.com)에 가입
2. GitHub 리포지토리 연결
3. 프로젝트 루트: `mobile`
4. 빌드 명령: `npm run build:web`
5. 출력 디렉토리: `dist`

### 2. Netlify
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
cd mobile
netlify deploy --prod --dir=dist
```

또는 `netlify.toml` 파일 생성:
```toml
[build]
  command = "npm run build:web"
  publish = "dist"
```

### 3. GitHub Pages
```bash
# gh-pages 브랜치에 배포
npm install --save-dev gh-pages

# package.json에 추가:
# "deploy": "gh-pages -d dist"

npm run build:web
npm run deploy
```

### 4. 일반 웹 호스팅
빌드된 `dist` 폴더의 모든 파일을 웹 서버에 업로드합니다.

## ⚙️ 환경 변수 설정

웹 배포 시 필요한 환경 변수가 있다면 `.env.production` 파일을 생성하세요:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

## 📝 주의사항

1. **이미지 업로드**: 웹에서는 `expo-image-picker`가 제한적으로 작동할 수 있습니다. 
   - 파일 입력을 사용하도록 폴백 구현이 필요할 수 있습니다.

2. **라우팅**: Expo Router는 클라이언트 사이드 라우팅을 사용합니다.
   - 서버에서 모든 경로를 `index.html`로 리다이렉트해야 합니다.

3. **PWA 지원**: `app.json`의 `web` 설정으로 PWA 기능이 활성화됩니다.

## 🔧 문제 해결

### 빌드 오류
```bash
# 캐시 클리어
rm -rf .expo
rm -rf node_modules
npm install
npm run build:web
```

### 라우팅 문제
서버 설정에서 모든 경로를 `index.html`로 리다이렉트:
- **Apache**: `.htaccess` 파일 추가
- **Nginx**: `try_files $uri /index.html;` 추가

## 📚 참고 자료

- [Expo Web 문서](https://docs.expo.dev/workflow/web/)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Netlify 배포 가이드](https://docs.netlify.com/)







