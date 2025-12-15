# 빠른 명령어 참조

자주 사용하는 명령어를 빠르게 참조할 수 있는 치트시트입니다.

---

## 🔧 로컬 개발 (Cursor)

### 개발 서버 실행
```powershell
npm.cmd run dev
```

### 개발 서버 중지
```
Ctrl + C
```

### 의존성 재설치 (필요시)
```powershell
npm.cmd run install-all
```

---

## 📤 GitHub 푸시

### 변경사항 확인
```powershell
git status
```

### 모든 변경사항 추가
```powershell
git add .
```

### 커밋 생성
```powershell
git commit -m "변경 내용 설명"
```

### GitHub에 푸시
```powershell
git push
```

### 한 번에 실행 (빠른 푸시)
```powershell
git add . && git commit -m "업데이트" && git push
```

---

## 🚀 Replit 배포

### 최신 코드 가져오기
```bash
git pull origin main
```

### 프론트엔드 빌드
```bash
npm run build
```

### 서버 실행
```bash
npm run start:prod
```

### 한 번에 실행 (빠른 배포)
```bash
git pull && npm run build
# 그 다음 Run 버튼 클릭
```

---

## 🔍 확인 명령어

### Git 상태 확인
```powershell
git status
```

### Git 로그 확인
```powershell
git log --oneline
```

### 원격 저장소 확인
```powershell
git remote -v
```

### 브랜치 확인
```powershell
git branch
```

---

## 🛠️ 문제 해결 명령어

### Git 충돌 해결
```powershell
git pull
# 충돌 해결 후
git add .
git commit -m "충돌 해결"
git push
```

### Replit 빌드 오류 해결
```bash
cd client
rm -rf node_modules build
npm install
npm run build
cd ..
```

### Replit 의존성 재설치
```bash
npm run install-all
```

---

## 📋 체크리스트

### 개발 전
- [ ] `git pull` - 최신 코드 가져오기

### 개발 중
- [ ] 코드 수정
- [ ] 로컬에서 테스트

### 개발 후
- [ ] `git status` - 변경사항 확인
- [ ] `git add .` - 변경사항 추가
- [ ] `git commit -m "..."` - 커밋 생성
- [ ] `git push` - GitHub에 푸시

### 배포 전
- [ ] Replit에서 `git pull` - 최신 코드 가져오기
- [ ] `npm run build` - 프론트엔드 빌드
- [ ] Run 버튼 클릭 - 서버 재시작
- [ ] Webview에서 확인 - 배포 확인

---

이 명령어들을 북마크하거나 인쇄해서 빠르게 참조하세요! 📌

