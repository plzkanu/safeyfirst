const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const adminRoutes = require('./routes/admin');
const documentRoutes = require('./routes/documents');
const backupRoutes = require('./routes/backup');
const { initDatabase } = require('./database/init');
const { restoreDatabase, backupDatabase } = require('./database/backup');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 초기화 및 복원
(async () => {
  // 서버 시작 시 백업에서 복원 시도
  try {
    const restored = await restoreDatabase();
    if (restored) {
      console.log('✅ 백업에서 데이터베이스를 복원했습니다.');
    }
  } catch (error) {
    console.log('ℹ️ 백업 파일이 없거나 복원할 수 없습니다. 새 데이터베이스를 생성합니다.');
  }
  
  // 데이터베이스 초기화
  initDatabase();
  
  // 주기적 자동 백업 (1시간마다)
  setInterval(async () => {
    try {
      await backupDatabase();
    } catch (error) {
      console.error('자동 백업 실패:', error);
    }
  }, 60 * 60 * 1000); // 1시간 = 60분 * 60초 * 1000ms
  
  // 서버 종료 시 백업
  process.on('SIGTERM', async () => {
    console.log('서버 종료 중... 데이터베이스 백업 중...');
    await backupDatabase();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('서버 종료 중... 데이터베이스 백업 중...');
    await backupDatabase();
    process.exit(0);
  });
})();

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/backup', backupRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 프로덕션 모드: React 빌드 파일 서빙
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));
  
  // 모든 라우트를 React 앱으로 전달 (SPA 라우팅)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  if (process.env.NODE_ENV === 'production') {
    console.log('프로덕션 모드: React 빌드 파일을 서빙합니다.');
  }
});

