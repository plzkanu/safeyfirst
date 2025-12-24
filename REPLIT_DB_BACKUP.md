# Replit 데이터베이스 백업 가이드

Replit에서 데이터베이스가 초기화되는 문제를 해결하기 위한 가이드입니다.

---

## 🔍 문제 원인

Replit에서 데이터베이스가 초기화되는 주요 원인:

1. **프로젝트 재시작**: Replit 프로젝트를 재시작하면 일부 파일이 초기화될 수 있습니다
2. **코드 업데이트**: `git pull` 후 서버 재시작 시 데이터베이스 파일이 덮어씌워질 수 있습니다
3. **파일 시스템 제한**: Replit의 무료 플랜에서는 파일 시스템이 일시적일 수 있습니다
4. **데이터베이스 파일 위치**: `.gitignore`에 포함되어 있어 배포 시 포함되지 않습니다

---

## ✅ 해결 방법

### 방법 1: 자동 백업/복원 시스템 (권장)

프로젝트에 자동 백업 시스템이 포함되어 있습니다.

#### 자동 기능

1. **서버 시작 시 자동 복원**
   - 서버가 시작될 때 최신 백업 파일에서 자동으로 복원합니다
   - 백업 파일이 없으면 새 데이터베이스를 생성합니다

2. **주기적 자동 백업**
   - 1시간마다 자동으로 백업합니다
   - 최근 10개의 백업 파일을 유지합니다

3. **서버 종료 시 백업**
   - 서버가 종료될 때 자동으로 백업합니다

#### 백업 파일 위치

```
server/
├── database.db          # 현재 데이터베이스
└── backups/            # 백업 디렉토리
    ├── database.db.backup              # 최신 백업
    ├── database-2024-01-15T10-30-00.db.backup
    └── database-2024-01-15T11-30-00.db.backup
```

---

### 방법 2: 관리자 API를 통한 수동 백업/복원

#### 백업 실행

**API 호출:**
```bash
POST /api/backup/backup
Authorization: Bearer {관리자_토큰}
```

**응답:**
```json
{
  "success": true,
  "message": "데이터베이스 백업이 완료되었습니다.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 복원 실행

**API 호출:**
```bash
POST /api/backup/restore
Authorization: Bearer {관리자_토큰}
Content-Type: application/json

{
  "backupFile": "server/backups/database-2024-01-15T10-30-00.db.backup"
}
```

**응답:**
```json
{
  "success": true,
  "message": "데이터베이스 복원이 완료되었습니다. 서버를 재시작해주세요."
}
```

#### 백업 목록 조회

**API 호출:**
```bash
GET /api/backup/backups
Authorization: Bearer {관리자_토큰}
```

**응답:**
```json
{
  "success": true,
  "backups": [
    {
      "name": "database-2024-01-15T11-30-00.db.backup",
      "size": 245760,
      "created": "2024-01-15T11:30:00.000Z",
      "modified": "2024-01-15T11:30:00.000Z"
    }
  ]
}
```

---

### 방법 3: Replit Secrets에 백업 저장 (작은 데이터베이스용)

데이터베이스가 작은 경우(1MB 미만), Replit Secrets에 Base64로 인코딩하여 저장할 수 있습니다.

#### 백업 스크립트

Replit 터미널에서:

```bash
# 데이터베이스를 Base64로 인코딩
base64 server/database.db > db_backup.txt

# 내용을 복사하여 Replit Secrets에 저장
# Secrets 탭 → 새 Secret 추가
# Key: DB_BACKUP
# Value: (db_backup.txt의 내용)
```

#### 복원 스크립트

```bash
# Secrets에서 가져와서 복원
echo $DB_BACKUP | base64 -d > server/database.db
```

---

### 방법 4: 외부 데이터베이스 서비스 사용 (장기 해결책)

Replit의 파일 시스템 제한을 피하기 위해 외부 데이터베이스 서비스를 사용하는 것이 좋습니다.

#### 옵션 1: Supabase (PostgreSQL) - 무료 플랜 제공

1. **Supabase 계정 생성**: https://supabase.com
2. **프로젝트 생성**
3. **연결 문자열 가져오기**
4. **환경 변수 설정**:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
5. **코드 수정**: SQLite → PostgreSQL 마이그레이션

#### 옵션 2: PlanetScale (MySQL) - 무료 플랜 제공

1. **PlanetScale 계정 생성**: https://planetscale.com
2. **데이터베이스 생성**
3. **연결 문자열 설정**
4. **환경 변수 설정**

#### 옵션 3: Railway (PostgreSQL) - 무료 크레딧 제공

1. **Railway 계정 생성**: https://railway.app
2. **PostgreSQL 서비스 추가**
3. **연결 정보 가져오기**
4. **환경 변수 설정**

---

## 🛠️ Replit에서 백업 설정

### 1. 백업 디렉토리 확인

Replit 터미널에서:

```bash
# 백업 디렉토리 확인
ls -la server/backups/

# 백업 파일 목록 확인
ls -lh server/backups/
```

### 2. 수동 백업 실행

```bash
# Node.js 스크립트로 백업
node -e "const {backupDatabase} = require('./server/database/backup'); backupDatabase().then(() => console.log('백업 완료')).catch(console.error);"
```

### 3. 수동 복원 실행

```bash
# Node.js 스크립트로 복원
node -e "const {restoreDatabase} = require('./server/database/backup'); restoreDatabase().then(() => console.log('복원 완료')).catch(console.error);"
```

---

## 📋 정기 백업 체크리스트

### 매일 확인

- [ ] 백업 파일이 생성되고 있는지 확인
- [ ] 최신 백업 파일의 크기가 0이 아닌지 확인

### 매주 확인

- [ ] 백업 파일 목록 확인
- [ ] 오래된 백업 파일 정리 (자동으로 최근 10개만 유지)

### 업데이트 전

- [ ] 수동 백업 실행
- [ ] 백업 파일 다운로드 (선택사항)

### 업데이트 후

- [ ] 데이터베이스가 정상적으로 복원되었는지 확인
- [ ] 데이터 무결성 확인

---

## 🔄 업데이트 시 백업 프로세스

### 1. 업데이트 전 백업

```bash
# Replit 터미널에서
POST /api/backup/backup
# 또는
node -e "const {backupDatabase} = require('./server/database/backup'); backupDatabase();"
```

### 2. 코드 업데이트

```bash
git pull origin main
npm run install-all
npm run build
```

### 3. 업데이트 후 확인

```bash
# 데이터베이스가 정상적으로 복원되었는지 확인
# 서버 로그에서 "✅ 백업에서 데이터베이스를 복원했습니다." 메시지 확인
```

---

## 🐛 문제 해결

### 백업 파일이 생성되지 않는 경우

1. **백업 디렉토리 권한 확인**
   ```bash
   ls -la server/backups/
   chmod 755 server/backups/
   ```

2. **디스크 공간 확인**
   ```bash
   df -h
   ```

3. **수동으로 백업 실행**
   ```bash
   node -e "const {backupDatabase} = require('./server/database/backup'); backupDatabase();"
   ```

### 복원이 안 되는 경우

1. **백업 파일 존재 확인**
   ```bash
   ls -la server/backups/
   ```

2. **백업 파일 크기 확인** (0이면 안 됨)
   ```bash
   ls -lh server/backups/database.db.backup
   ```

3. **수동으로 복원**
   ```bash
   cp server/backups/database.db.backup server/database.db
   ```

### 데이터베이스가 계속 초기화되는 경우

1. **자동 복원 기능 확인**
   - `server/index.js`에 복원 코드가 포함되어 있는지 확인

2. **백업 파일 위치 확인**
   - `server/backups/database.db.backup` 파일이 있는지 확인

3. **외부 데이터베이스 서비스 사용 고려**
   - Supabase, PlanetScale, Railway 등

---

## 💡 권장 사항

### 1. 정기적인 수동 백업

자동 백업 외에도 중요한 작업 전후에 수동 백업을 실행하세요:

```bash
# 관리자 API 호출
POST /api/backup/backup
```

### 2. 백업 파일 다운로드

Replit 파일 탐색기에서 `server/backups/` 폴더의 백업 파일을 다운로드하여 로컬에 보관하세요.

### 3. 외부 저장소 활용

중요한 데이터는 다음 중 하나를 사용하세요:
- GitHub Releases (작은 파일)
- Google Drive / Dropbox
- AWS S3
- 외부 데이터베이스 서비스

### 4. 프로덕션 환경

프로덕션 환경에서는 반드시 외부 데이터베이스 서비스를 사용하세요:
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- Railway (PostgreSQL)
- MongoDB Atlas

---

## 📚 관련 문서

- `REPLIT_UPDATE.md` - Replit 업데이트 가이드
- `DEPLOY_REPLIT.md` - Replit 배포 가이드
- `GITHUB_DEPLOY.md` - GitHub 배포 가이드

---

## ✅ 완료!

이제 Replit에서 데이터베이스가 자동으로 백업되고 복원됩니다. 서버를 재시작해도 데이터가 유지됩니다!

