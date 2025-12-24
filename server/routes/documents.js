const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 업로드 디렉토리 생성
const uploadsDir = path.join(__dirname, '..', 'uploads');
const templatesDir = path.join(uploadsDir, 'templates');
const submissionsDir = path.join(uploadsDir, 'submissions');

[uploadsDir, templatesDir, submissionsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer 설정 - 템플릿 파일용
const templateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, templatesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'template-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer 설정 - 제출 파일용
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTemplate = multer({ 
  storage: templateStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadSubmission = multer({ 
  storage: submissionStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// ========== 사업소 관리 (관리자 전용) ==========

// 모든 사업소 조회
router.get('/business-offices', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM business_offices ORDER BY created_at DESC', [], (err, offices) => {
    if (err) {
      return res.status(500).json({ error: '사업소 조회 중 오류가 발생했습니다.' });
    }
    res.json(offices);
  });
});

// 사업소 생성
router.post('/business-offices', authenticateToken, requireAdmin, (req, res) => {
  const { name, code, address, contact_person, contact_phone, contact_email, description } = req.body;
  
  if (!name || !code) {
    return res.status(400).json({ error: '사업소명과 코드는 필수입니다.' });
  }

  const db = getDb();
  db.run(
    `INSERT INTO business_offices (name, code, address, contact_person, contact_phone, contact_email, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, code, address || null, contact_person || null, contact_phone || null, contact_email || null, description || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: '이미 존재하는 사업소 코드입니다.' });
        }
        return res.status(500).json({ error: '사업소 생성 중 오류가 발생했습니다.' });
      }

      db.get('SELECT * FROM business_offices WHERE id = ?', [this.lastID], (err, office) => {
        if (err) {
          return res.status(500).json({ error: '사업소 조회 중 오류가 발생했습니다.' });
        }
        res.status(201).json(office);
      });
    }
  );
});

// 사업소 수정
router.put('/business-offices/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, code, address, contact_person, contact_phone, contact_email, description, status } = req.body;

  const db = getDb();
  db.run(
    `UPDATE business_offices 
     SET name = ?, code = ?, address = ?, contact_person = ?, contact_phone = ?, contact_email = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, code, address, contact_person, contact_phone, contact_email, description, status || 'active', id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: '이미 존재하는 사업소 코드입니다.' });
        }
        return res.status(500).json({ error: '사업소 수정 중 오류가 발생했습니다.' });
      }

      db.get('SELECT * FROM business_offices WHERE id = ?', [id], (err, office) => {
        if (err) {
          return res.status(500).json({ error: '사업소 조회 중 오류가 발생했습니다.' });
        }
        res.json(office);
      });
    }
  );
});

// 사업소 삭제
router.delete('/business-offices/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  // 제출 요구사항이 있는지 확인
  db.get('SELECT COUNT(*) as count FROM document_requirements WHERE business_office_id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '확인 중 오류가 발생했습니다.' });
    }

    if (result.count > 0) {
      return res.status(400).json({ error: '제출 요구사항이 있는 사업소는 삭제할 수 없습니다.' });
    }

    db.run('DELETE FROM business_offices WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: '사업소 삭제 중 오류가 발생했습니다.' });
      }
      res.json({ message: '사업소가 삭제되었습니다.' });
    });
  });
});

// ========== 제출 요구사항 관리 (관리자 전용) ==========

// 모든 제출 요구사항 조회
router.get('/requirements', authenticateToken, (req, res) => {
  const db = getDb();
  const { business_office_id } = req.query;

  let query = `
    SELECT dr.*, bo.name as business_office_name, bo.code as business_office_code
    FROM document_requirements dr
    JOIN business_offices bo ON dr.business_office_id = bo.id
    WHERE 1=1
  `;
  const params = [];

  if (business_office_id) {
    query += ' AND dr.business_office_id = ?';
    params.push(business_office_id);
  }

  query += ' ORDER BY dr.deadline ASC, dr.created_at DESC';

  db.all(query, params, (err, requirements) => {
    if (err) {
      return res.status(500).json({ error: '제출 요구사항 조회 중 오류가 발생했습니다.' });
    }
    res.json(requirements);
  });
});

// 제출 요구사항 생성
router.post('/requirements', authenticateToken, requireAdmin, uploadTemplate.single('template'), (req, res) => {
  const { business_office_id, title, description, deadline, is_required } = req.body;

  if (!business_office_id || !title || !deadline) {
    return res.status(400).json({ error: '사업소, 제목, 기한은 필수입니다.' });
  }

  const db = getDb();
  const templateFilePath = req.file ? req.file.path : null;
  const templateFileName = req.file ? req.file.originalname : null;

  db.run(
    `INSERT INTO document_requirements (business_office_id, title, description, deadline, template_file_path, template_file_name, is_required) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [business_office_id, title, description || null, deadline, templateFilePath, templateFileName, is_required !== '0' ? 1 : 0],
    function(err) {
      if (err) {
        // 파일 업로드했는데 DB 저장 실패 시 파일 삭제
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: '제출 요구사항 생성 중 오류가 발생했습니다.' });
      }

      db.get(`
        SELECT dr.*, bo.name as business_office_name, bo.code as business_office_code
        FROM document_requirements dr
        JOIN business_offices bo ON dr.business_office_id = bo.id
        WHERE dr.id = ?
      `, [this.lastID], (err, requirement) => {
        if (err) {
          return res.status(500).json({ error: '제출 요구사항 조회 중 오류가 발생했습니다.' });
        }
        res.status(201).json(requirement);
      });
    }
  );
});

// 제출 요구사항 수정
router.put('/requirements/:id', authenticateToken, requireAdmin, uploadTemplate.single('template'), (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, is_required, status } = req.body;

  const db = getDb();

  // 기존 파일 정보 조회 (파일명 포함)
  db.get('SELECT template_file_path, template_file_name FROM document_requirements WHERE id = ?', [id], (err, existing) => {
      if (err) {
        return res.status(500).json({ error: '제출 요구사항 조회 중 오류가 발생했습니다.' });
      }

      let templateFilePath = existing.template_file_path;
      let templateFileName = existing.template_file_name;

      // 새 파일이 업로드된 경우
      if (req.file) {
        // 기존 파일 삭제
        if (existing.template_file_path && fs.existsSync(existing.template_file_path)) {
          fs.unlinkSync(existing.template_file_path);
        }
        templateFilePath = req.file.path;
        templateFileName = req.file.originalname;
      }

      db.run(
        `UPDATE document_requirements 
         SET title = ?, description = ?, deadline = ?, template_file_path = ?, template_file_name = ?, is_required = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, description, deadline, templateFilePath, templateFileName, is_required !== '0' ? 1 : 0, status || 'active', id],
      function(err) {
        if (err) {
          // 새 파일 업로드했는데 DB 저장 실패 시 파일 삭제
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(500).json({ error: '제출 요구사항 수정 중 오류가 발생했습니다.' });
        }

        db.get(`
          SELECT dr.*, bo.name as business_office_name, bo.code as business_office_code
          FROM document_requirements dr
          JOIN business_offices bo ON dr.business_office_id = bo.id
          WHERE dr.id = ?
        `, [id], (err, requirement) => {
          if (err) {
            return res.status(500).json({ error: '제출 요구사항 조회 중 오류가 발생했습니다.' });
          }
          res.json(requirement);
        });
      }
    );
  });
});

// 제출 요구사항 삭제
router.delete('/requirements/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  // 제출된 파일이 있는지 확인
  db.get('SELECT COUNT(*) as count FROM document_submissions WHERE requirement_id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '확인 중 오류가 발생했습니다.' });
    }

    if (result.count > 0) {
      return res.status(400).json({ error: '제출된 파일이 있는 요구사항은 삭제할 수 없습니다.' });
    }

    // 템플릿 파일 삭제
    db.get('SELECT template_file_path FROM document_requirements WHERE id = ?', [id], (err, requirement) => {
      if (requirement && requirement.template_file_path && fs.existsSync(requirement.template_file_path)) {
        fs.unlinkSync(requirement.template_file_path);
      }

      db.run('DELETE FROM document_requirements WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ error: '제출 요구사항 삭제 중 오류가 발생했습니다.' });
        }
        res.json({ message: '제출 요구사항이 삭제되었습니다.' });
      });
    });
  });
});

// ========== 제출 서류 관리 ==========

// 제출 서류 목록 조회
router.get('/submissions', authenticateToken, (req, res) => {
  const db = getDb();
  const { requirement_id, business_office_id, user_id } = req.query;
  const isAdmin = req.user.role === 'admin';

  let query = `
    SELECT ds.*, 
           dr.title as requirement_title,
           bo.name as business_office_name,
           bo.code as business_office_code,
           u.name as user_name,
           u.username as user_username,
           reviewer.name as reviewer_name
    FROM document_submissions ds
    JOIN document_requirements dr ON ds.requirement_id = dr.id
    JOIN business_offices bo ON ds.business_office_id = bo.id
    JOIN users u ON ds.user_id = u.id
    LEFT JOIN users reviewer ON ds.reviewer_id = reviewer.id
    WHERE 1=1
  `;
  const params = [];

  if (requirement_id) {
    query += ' AND ds.requirement_id = ?';
    params.push(requirement_id);
  }

  if (business_office_id) {
    query += ' AND ds.business_office_id = ?';
    params.push(business_office_id);
  }

  // 일반 사용자는 자신의 제출만 조회
  if (!isAdmin && user_id) {
    query += ' AND ds.user_id = ?';
    params.push(user_id);
  } else if (!isAdmin) {
    query += ' AND ds.user_id = ?';
    params.push(req.user.id);
  } else if (user_id) {
    query += ' AND ds.user_id = ?';
    params.push(user_id);
  }

  query += ' ORDER BY ds.submitted_at DESC';

  db.all(query, params, (err, submissions) => {
    if (err) {
      return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
    }
    res.json(submissions);
  });
});

// 제출 서류 상세 조회
router.get('/submissions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const isAdmin = req.user.role === 'admin';

  db.get(`
    SELECT ds.*, 
           dr.title as requirement_title,
           dr.deadline as requirement_deadline,
           bo.name as business_office_name,
           bo.code as business_office_code,
           u.name as user_name,
           u.username as user_username,
           reviewer.name as reviewer_name
    FROM document_submissions ds
    JOIN document_requirements dr ON ds.requirement_id = dr.id
    JOIN business_offices bo ON ds.business_office_id = bo.id
    JOIN users u ON ds.user_id = u.id
    LEFT JOIN users reviewer ON ds.reviewer_id = reviewer.id
    WHERE ds.id = ?
  `, [id], (err, submission) => {
    if (err) {
      return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
    }

    if (!submission) {
      return res.status(404).json({ error: '제출 서류를 찾을 수 없습니다.' });
    }

    // 일반 사용자는 자신의 제출만 조회 가능
    if (!isAdmin && submission.user_id !== req.user.id) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    res.json(submission);
  });
});

// 제출 서류 제출
router.post('/submissions', authenticateToken, uploadSubmission.single('file'), (req, res) => {
  const { requirement_id, business_office_id } = req.body;

  if (!requirement_id || !business_office_id || !req.file) {
    // 파일 업로드했는데 필수 필드 누락 시 파일 삭제
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  const db = getDb();

  // 요구사항 확인
  db.get('SELECT * FROM document_requirements WHERE id = ?', [requirement_id], (err, requirement) => {
    if (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: '요구사항 조회 중 오류가 발생했습니다.' });
    }

    if (!requirement) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: '제출 요구사항을 찾을 수 없습니다.' });
    }

    // 기존 제출 확인 (같은 요구사항에 대한 중복 제출 방지)
    db.get('SELECT * FROM document_submissions WHERE requirement_id = ? AND user_id = ?', 
      [requirement_id, req.user.id], (err, existing) => {
      if (err) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: '확인 중 오류가 발생했습니다.' });
      }

      if (existing) {
        // 기존 파일 삭제
        if (fs.existsSync(existing.file_path)) {
          fs.unlinkSync(existing.file_path);
        }
        // 기존 제출 업데이트
        db.run(
          `UPDATE document_submissions 
           SET file_path = ?, file_name = ?, file_size = ?, mime_type = ?, status = 'submitted', submitted_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [req.file.path, req.file.originalname, req.file.size, req.file.mimetype, existing.id],
          function(err) {
            if (err) {
              if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
              }
              return res.status(500).json({ error: '제출 서류 업데이트 중 오류가 발생했습니다.' });
            }

            db.get(`
              SELECT ds.*, 
                     dr.title as requirement_title,
                     bo.name as business_office_name,
                     bo.code as business_office_code,
                     u.name as user_name
              FROM document_submissions ds
              JOIN document_requirements dr ON ds.requirement_id = dr.id
              JOIN business_offices bo ON ds.business_office_id = bo.id
              JOIN users u ON ds.user_id = u.id
              WHERE ds.id = ?
            `, [existing.id], (err, submission) => {
              if (err) {
                return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
              }
              res.json(submission);
            });
          }
        );
      } else {
        // 새 제출 생성
        db.run(
          `INSERT INTO document_submissions (requirement_id, business_office_id, user_id, file_path, file_name, file_size, mime_type) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [requirement_id, business_office_id, req.user.id, req.file.path, req.file.originalname, req.file.size, req.file.mimetype],
          function(err) {
            if (err) {
              if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
              }
              return res.status(500).json({ error: '제출 서류 생성 중 오류가 발생했습니다.' });
            }

            db.get(`
              SELECT ds.*, 
                     dr.title as requirement_title,
                     bo.name as business_office_name,
                     bo.code as business_office_code,
                     u.name as user_name
              FROM document_submissions ds
              JOIN document_requirements dr ON ds.requirement_id = dr.id
              JOIN business_offices bo ON ds.business_office_id = bo.id
              JOIN users u ON ds.user_id = u.id
              WHERE ds.id = ?
            `, [this.lastID], (err, submission) => {
              if (err) {
                return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
              }
              res.status(201).json(submission);
            });
          }
        );
      }
    });
  });
});

// 제출 서류 검토 (관리자 전용)
router.put('/submissions/:id/review', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, review_comment } = req.body;

  if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: '유효한 상태를 입력하세요.' });
  }

  const db = getDb();
  db.run(
    `UPDATE document_submissions 
     SET status = ?, review_comment = ?, reviewed_at = CURRENT_TIMESTAMP, reviewer_id = ?
     WHERE id = ?`,
    [status, review_comment || null, req.user.id, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '검토 중 오류가 발생했습니다.' });
      }

      db.get(`
        SELECT ds.*, 
               dr.title as requirement_title,
               bo.name as business_office_name,
               bo.code as business_office_code,
               u.name as user_name,
               reviewer.name as reviewer_name
        FROM document_submissions ds
        JOIN document_requirements dr ON ds.requirement_id = dr.id
        JOIN business_offices bo ON ds.business_office_id = bo.id
        JOIN users u ON ds.user_id = u.id
        LEFT JOIN users reviewer ON ds.reviewer_id = reviewer.id
        WHERE ds.id = ?
      `, [id], (err, submission) => {
        if (err) {
          return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
        }
        res.json(submission);
      });
    }
  );
});

// 제출 서류 파일 다운로드
router.get('/submissions/:id/download', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const isAdmin = req.user.role === 'admin';

  db.get('SELECT * FROM document_submissions WHERE id = ?', [id], (err, submission) => {
    if (err) {
      return res.status(500).json({ error: '제출 서류 조회 중 오류가 발생했습니다.' });
    }

    if (!submission) {
      return res.status(404).json({ error: '제출 서류를 찾을 수 없습니다.' });
    }

    // 일반 사용자는 자신의 제출만 다운로드 가능
    if (!isAdmin && submission.user_id !== req.user.id) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    if (!fs.existsSync(submission.file_path)) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }

    res.download(submission.file_path, submission.file_name);
  });
});

// 템플릿 파일 다운로드
router.get('/requirements/:id/template', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get('SELECT * FROM document_requirements WHERE id = ?', [id], (err, requirement) => {
    if (err) {
      return res.status(500).json({ error: '제출 요구사항 조회 중 오류가 발생했습니다.' });
    }

    if (!requirement || !requirement.template_file_path) {
      return res.status(404).json({ error: '템플릿 파일을 찾을 수 없습니다.' });
    }

    if (!fs.existsSync(requirement.template_file_path)) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }

    res.download(requirement.template_file_path, requirement.template_file_name || 'template');
  });
});

// ========== 제출 현황 통계 (관리자 전용) ==========

router.get('/statistics', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();

  // 전체 통계
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM document_requirements WHERE status = 'active') as total_requirements,
      (SELECT COUNT(*) FROM document_submissions) as total_submissions,
      (SELECT COUNT(*) FROM document_submissions WHERE status = 'approved') as approved_submissions,
      (SELECT COUNT(*) FROM document_submissions WHERE status = 'rejected') as rejected_submissions,
      (SELECT COUNT(*) FROM document_submissions WHERE status = 'submitted') as pending_submissions
  `;

  // 사업소별 제출 현황
  const officeStatsQuery = `
    SELECT 
      bo.id,
      bo.name,
      bo.code,
      COUNT(DISTINCT dr.id) as total_requirements,
      COUNT(DISTINCT ds.id) as total_submissions,
      COUNT(DISTINCT CASE WHEN ds.status = 'approved' THEN ds.id END) as approved,
      COUNT(DISTINCT CASE WHEN ds.status = 'rejected' THEN ds.id END) as rejected,
      COUNT(DISTINCT CASE WHEN ds.status = 'submitted' THEN ds.id END) as pending
    FROM business_offices bo
    LEFT JOIN document_requirements dr ON bo.id = dr.business_office_id AND dr.status = 'active'
    LEFT JOIN document_submissions ds ON dr.id = ds.requirement_id
    GROUP BY bo.id, bo.name, bo.code
    ORDER BY bo.name
  `;

  // 기한 임박 요구사항
  const upcomingDeadlinesQuery = `
    SELECT 
      dr.*,
      bo.name as business_office_name,
      bo.code as business_office_code,
      COUNT(ds.id) as submission_count
    FROM document_requirements dr
    JOIN business_offices bo ON dr.business_office_id = bo.id
    LEFT JOIN document_submissions ds ON dr.id = ds.requirement_id
    WHERE dr.status = 'active' 
      AND dr.deadline >= date('now')
      AND dr.deadline <= date('now', '+7 days)
    GROUP BY dr.id
    ORDER BY dr.deadline ASC
  `;

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(statsQuery, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(officeStatsQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(upcomingDeadlinesQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ])
    .then(([stats, officeStats, upcomingDeadlines]) => {
      res.json({
        stats,
        officeStats,
        upcomingDeadlines
      });
    })
    .catch((err) => {
      console.error('통계 조회 오류:', err);
      res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
    });
});

module.exports = router;

