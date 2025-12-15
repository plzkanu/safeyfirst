const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 안전 활동 기록 생성
router.post('/', [
  body('activity_type').notEmpty().withMessage('활동 유형을 선택하세요.'),
  body('description').notEmpty().withMessage('설명을 입력하세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { activity_type, location, description, status, date_time, images } = req.body;
  const db = getDb();

  db.run(
    `INSERT INTO safety_activities (user_id, activity_type, location, description, status, date_time, images)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, activity_type, location || null, description, status || 'completed', date_time || new Date().toISOString(), images || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '활동 기록 저장 중 오류가 발생했습니다.' });
      }

      db.get('SELECT * FROM safety_activities WHERE id = ?', [this.lastID], (err, activity) => {
        if (err) {
          return res.status(500).json({ error: '기록 조회 중 오류가 발생했습니다.' });
        }
        res.status(201).json(activity);
      });
    }
  );
});

// 내 활동 기록 조회
router.get('/my', (req, res) => {
  const db = getDb();
  const { page = 1, limit = 20, activity_type, start_date, end_date } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM safety_activities WHERE user_id = ?';
  const params = [req.user.id];

  if (activity_type) {
    query += ' AND activity_type = ?';
    params.push(activity_type);
  }

  if (start_date) {
    query += ' AND date_time >= ?';
    params.push(start_date);
  }

  if (end_date) {
    query += ' AND date_time <= ?';
    params.push(end_date);
  }

  query += ' ORDER BY date_time DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, activities) => {
    if (err) {
      return res.status(500).json({ error: '활동 기록 조회 중 오류가 발생했습니다.' });
    }

    // 전체 개수 조회
    let countQuery = 'SELECT COUNT(*) as total FROM safety_activities WHERE user_id = ?';
    const countParams = [req.user.id];

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

// 특정 활동 기록 조회
router.get('/:id', (req, res) => {
  const db = getDb();
  db.get('SELECT * FROM safety_activities WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, activity) => {
    if (err) {
      return res.status(500).json({ error: '활동 기록 조회 중 오류가 발생했습니다.' });
    }
    if (!activity) {
      return res.status(404).json({ error: '활동 기록을 찾을 수 없습니다.' });
    }
    res.json(activity);
  });
});

// 활동 기록 수정
router.put('/:id', [
  body('description').notEmpty().withMessage('설명을 입력하세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { activity_type, location, description, status, date_time, images } = req.body;
  const db = getDb();

  db.run(
    `UPDATE safety_activities 
     SET activity_type = ?, location = ?, description = ?, status = ?, date_time = ?, images = ?
     WHERE id = ? AND user_id = ?`,
    [activity_type, location, description, status, date_time, images, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '활동 기록 수정 중 오류가 발생했습니다.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: '활동 기록을 찾을 수 없습니다.' });
      }

      db.get('SELECT * FROM safety_activities WHERE id = ?', [req.params.id], (err, activity) => {
        if (err) {
          return res.status(500).json({ error: '기록 조회 중 오류가 발생했습니다.' });
        }
        res.json(activity);
      });
    }
  );
});

// 활동 기록 삭제
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.run('DELETE FROM safety_activities WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: '활동 기록 삭제 중 오류가 발생했습니다.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '활동 기록을 찾을 수 없습니다.' });
    }
    res.json({ message: '활동 기록이 삭제되었습니다.' });
  });
});

module.exports = router;

