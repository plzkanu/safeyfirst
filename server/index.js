const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const adminRoutes = require('./routes/admin');
const documentRoutes = require('./routes/documents');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 초기화
initDatabase();

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);

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

