const fs = require('fs');
const path = require('path');
const { getDb } = require('./init');

const dbPath = path.join(__dirname, '..', 'database.db');
const backupDir = path.join(__dirname, '..', 'backups');
const backupPath = path.join(backupDir, 'database.db.backup');

// 백업 디렉토리 생성
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * 데이터베이스 백업
 */
const backupDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(dbPath)) {
        console.log('백업할 데이터베이스 파일이 없습니다.');
        return resolve(false);
      }

      // 기존 백업이 있으면 타임스탬프 추가
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const timestampedBackup = path.join(backupDir, `database-${timestamp}.db.backup`);
      
      // 최신 백업 복사
      fs.copyFileSync(dbPath, backupPath);
      fs.copyFileSync(dbPath, timestampedBackup);
      
      console.log(`✅ 데이터베이스 백업 완료: ${backupPath}`);
      console.log(`✅ 타임스탬프 백업 완료: ${timestampedBackup}`);
      
      // 오래된 백업 파일 정리 (최근 10개만 유지)
      const backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('database-') && f.endsWith('.db.backup'))
        .map(f => ({
          name: f,
          path: path.join(backupDir, f),
          time: fs.statSync(path.join(backupDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      if (backupFiles.length > 10) {
        backupFiles.slice(10).forEach(file => {
          fs.unlinkSync(file.path);
          console.log(`🗑️ 오래된 백업 삭제: ${file.name}`);
        });
      }
      
      resolve(true);
    } catch (error) {
      console.error('❌ 데이터베이스 백업 실패:', error);
      reject(error);
    }
  });
};

/**
 * 데이터베이스 복원
 */
const restoreDatabase = (backupFile = null) => {
  return new Promise((resolve, reject) => {
    try {
      const sourceBackup = backupFile || backupPath;
      
      if (!fs.existsSync(sourceBackup)) {
        console.log('복원할 백업 파일이 없습니다.');
        return resolve(false);
      }

      // 현재 데이터베이스가 있으면 백업
      if (fs.existsSync(dbPath)) {
        const currentBackup = path.join(backupDir, `database-before-restore-${Date.now()}.db.backup`);
        fs.copyFileSync(dbPath, currentBackup);
        console.log(`📦 현재 데이터베이스를 백업했습니다: ${currentBackup}`);
      }

      // 백업에서 복원
      fs.copyFileSync(sourceBackup, dbPath);
      console.log(`✅ 데이터베이스 복원 완료: ${sourceBackup} → ${dbPath}`);
      
      resolve(true);
    } catch (error) {
      console.error('❌ 데이터베이스 복원 실패:', error);
      reject(error);
    }
  });
};

/**
 * 백업 목록 조회
 */
const listBackups = () => {
  try {
    if (!fs.existsSync(backupDir)) {
      return [];
    }

    const backups = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.db.backup'))
      .map(f => {
        const filePath = path.join(backupDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified - a.modified);

    return backups;
  } catch (error) {
    console.error('백업 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 최신 백업 파일 경로 반환
 */
const getLatestBackup = () => {
  const backups = listBackups();
  return backups.length > 0 ? backups[0].path : null;
};

module.exports = {
  backupDatabase,
  restoreDatabase,
  listBackups,
  getLatestBackup,
  backupPath,
  backupDir
};

