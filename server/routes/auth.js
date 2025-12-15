const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/init');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// 로그인
router.post('/login', [
  body('username').notEmpty().withMessage('사용자명을 입력하세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력하세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDb();

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (!user) {
      return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    });
  });
});

// 현재 사용자 정보 조회
router.get('/me', require('../middleware/auth').authenticateToken, (req, res) => {
  const db = getDb();
  db.get('SELECT id, username, name, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  });
});

module.exports = router;

