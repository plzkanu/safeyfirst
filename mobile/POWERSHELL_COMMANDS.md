# PowerShell 명령어 가이드

Windows PowerShell에서 사용할 수 있는 명령어입니다.

## 🗑️ 캐시 삭제

### .expo 폴더 삭제
```powershell
Remove-Item -Recurse -Force .expo
```

또는 짧게:
```powershell
rm -r -fo .expo
```

### node_modules 캐시 삭제
```powershell
Remove-Item -Recurse -Force node_modules\.cache
```

## 🔄 완전 재설치

```powershell
# node_modules 삭제
Remove-Item -Recurse -Force node_modules

# .expo 삭제
Remove-Item -Recurse -Force .expo

# 재설치
npm install

# 서버 시작
npm run web
```

## 🚀 서버 실행

### 웹 개발 서버
```powershell
npm run web
```

### 캐시 클리어 후 웹 서버
```powershell
Remove-Item -Recurse -Force .expo
npm run web
```

## 📝 주요 차이점

| Linux/Mac | PowerShell |
|-----------|------------|
| `rm -rf` | `Remove-Item -Recurse -Force` 또는 `rm -r -fo` |
| `rm -r` | `Remove-Item -Recurse` 또는 `rm -r` |
| `rm -f` | `Remove-Item -Force` 또는 `rm -fo` |

## 💡 팁

PowerShell에서 `rm`은 `Remove-Item`의 별칭입니다:
- `-Recurse` 또는 `-r`: 하위 폴더 포함
- `-Force` 또는 `-fo`: 강제 삭제







