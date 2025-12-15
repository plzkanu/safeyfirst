const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 및 관리자 권한 미들웨어 적용
router.use(authenticateToken);
router.use(requireAdmin);

// 전체 활동 기록 조회
router.get('/activities', (req, res) => {
  const db = getDb();
  const { page = 1, limit = 50, user_id, activity_type, start_date, end_date } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT sa.*, u.username, u.name as user_name 
    FROM safety_activities sa
    JOIN users u ON sa.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (user_id) {
    query += ' AND sa.user_id = ?';
    params.push(user_id);
  }

  if (activity_type) {
    query += ' AND sa.activity_type = ?';
    params.push(activity_type);
  }

  if (start_date) {
    query += ' AND sa.date_time >= ?';
    params.push(start_date);
  }

  if (end_date) {
    query += ' AND sa.date_time <= ?';
    params.push(end_date);
  }

  query += ' ORDER BY sa.date_time DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, activities) => {
    if (err) {
      return res.status(500).json({ error: '활동 기록 조회 중 오류가 발생했습니다.' });
    }

    // 전체 개수 조회
    let countQuery = 'SELECT COUNT(*) as total FROM safety_activities WHERE 1=1';
    const countParams = [];

    if (user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(user_id);
    }

    if (activity_type) {
      countQuery += ' AND activity_type = ?';
      countParams.push(activity_type);
    }

    if (start_date) {
      countQuery += ' AND date_time >= ?';
      countParams.push(start_date);
    }

    if (end_date) {
      countQuery += ' AND date_time <= ?';
      countParams.push(end_date);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: '개수 조회 중 오류가 발생했습니다.' });
      }

      res.json({
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    });
  });
});

// 통계 데이터 조회
router.get('/statistics', (req, res) => {
  const db = getDb();
  const { start_date, end_date } = req.query;

  let dateFilter = '';
  const params = [];

  if (start_date && end_date) {
    dateFilter = 'WHERE date_time >= ? AND date_time <= ?';
    params.push(start_date, end_date);
  } else if (start_date) {
    dateFilter = 'WHERE date_time >= ?';
    params.push(start_date);
  } else if (end_date) {
    dateFilter = 'WHERE date_time <= ?';
    params.push(end_date);
  }

  // 활동 유형별 통계
  const activityTypeQuery = `
    SELECT activity_type, COUNT(*) as count 
    FROM safety_activities 
    ${dateFilter}
    GROUP BY activity_type
  `;

  // 일별 활동 통계
  const dailyQuery = `
    SELECT DATE(date_time) as date, COUNT(*) as count 
    FROM safety_activities 
    ${dateFilter}
    GROUP BY DATE(date_time)
    ORDER BY date DESC
    LIMIT 30
  `;

  // 사용자별 활동 통계
  const userQuery = `
    SELECT u.id, u.username, u.name, COUNT(sa.id) as count 
    FROM users u
    LEFT JOIN safety_activities sa ON u.id = sa.user_id
    ${dateFilter ? 'AND sa.' + dateFilter.replace('WHERE', '') : ''}
    GROUP BY u.id, u.username, u.name
    ORDER BY count DESC
  `;

  // 상태별 통계
  const statusQuery = `
    SELECT status, COUNT(*) as count 
    FROM safety_activities 
    ${dateFilter}
    GROUP BY status
  `;

  Promise.all([
    new Promise((resolve, reject) => {
      db.all(activityTypeQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(dailyQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(userQuery, dateFilter ? params : [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(statusQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ])
    .then(([byType, daily, byUser, byStatus]) => {
      res.json({
        byType,
        daily,
        byUser,
        byStatus
      });
    })
    .catch((err) => {
      console.error('통계 조회 오류:', err);
      res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
    });
});

// 모든 사용자 조회
router.get('/users', (req, res) => {
  const db = getDb();
  db.all('SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC', [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: '사용자 조회 중 오류가 발생했습니다.' });
    }
    res.json(users);
  });
});

// 사용자 생성
router.post('/users', (req, res) => {
  const { username, password, name, role } = req.body;
  const bcrypt = require('bcryptjs');

  if (!username || !password || !name) {
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  const db = getDb();
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, name, role || 'user'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: '이미 존재하는 사용자명입니다.' });
        }
        return res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
      }

      db.get('SELECT id, username, name, role FROM users WHERE id = ?', [this.lastID], (err, user) => {
        if (err) {
          return res.status(500).json({ error: '사용자 조회 중 오류가 발생했습니다.' });
        }
        res.status(201).json(user);
      });
    }
  );
});

module.exports = router;

