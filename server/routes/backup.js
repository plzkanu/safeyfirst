const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { backupDatabase, restoreDatabase, listBackups, getLatestBackup } = require('../database/backup');

const router = express.Router();

// 관리자 전용 백업 라우트

/**
 * 데이터베이스 백업 실행
 */
router.post('/backup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await backupDatabase();
    res.json({ 
      success: true, 
      message: '데이터베이스 백업이 완료되었습니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('백업 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '백업 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

/**
 * 데이터베이스 복원
 */
router.post('/restore', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { backupFile } = req.body;
    
    await restoreDatabase(backupFile);
    
    res.json({ 
      success: true, 
      message: '데이터베이스 복원이 완료되었습니다. 서버를 재시작해주세요.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('복원 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '복원 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

/**
 * 백업 목록 조회
 */
router.get('/backups', authenticateToken, requireAdmin, (req, res) => {
  try {
    const backups = listBackups();
    res.json({ 
      success: true, 
      backups: backups.map(b => ({
        name: b.name,
        size: b.size,
        created: b.created,
        modified: b.modified
      }))
    });
  } catch (error) {
    console.error('백업 목록 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '백업 목록 조회 중 오류가 발생했습니다.' 
    });
  }
});

/**
 * 최신 백업 정보 조회
 */
router.get('/backup/latest', authenticateToken, requireAdmin, (req, res) => {
  try {
    const latestBackup = getLatestBackup();
    if (!latestBackup) {
      return res.json({ 
        success: false, 
        message: '백업 파일이 없습니다.' 
      });
    }
    
    const backups = listBackups();
    const latest = backups[0];
    
    res.json({ 
      success: true, 
      backup: {
        name: latest.name,
        path: latest.path,
        size: latest.size,
        created: latest.created,
        modified: latest.modified
      }
    });
  } catch (error) {
    console.error('최신 백업 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '최신 백업 조회 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;

