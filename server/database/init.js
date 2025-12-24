const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');

let db;

const initDatabase = () => {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('데이터베이스 연결 오류:', err.message);
      return;
    }
    console.log('데이터베이스에 연결되었습니다.');
  });

  // 사용자 테이블
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 안전 활동 기록 테이블
    db.run(`CREATE TABLE IF NOT EXISTS safety_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      location TEXT,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 사업소 테이블
    db.run(`CREATE TABLE IF NOT EXISTS business_offices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      address TEXT,
      contact_person TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 제출 서류 요구사항 테이블
    db.run(`CREATE TABLE IF NOT EXISTS document_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_office_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      deadline DATETIME NOT NULL,
      template_file_path TEXT,
      template_file_name TEXT,
      is_required INTEGER DEFAULT 1,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_office_id) REFERENCES business_offices(id)
    )`);

    // 제출 서류 테이블
    db.run(`CREATE TABLE IF NOT EXISTS document_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requirement_id INTEGER NOT NULL,
      business_office_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      status TEXT DEFAULT 'submitted',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      reviewer_id INTEGER,
      review_comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requirement_id) REFERENCES document_requirements(id),
      FOREIGN KEY (business_office_id) REFERENCES business_offices(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    )`);

    // 기본 관리자 계정 생성
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        console.error('사용자 조회 오류:', err);
        return;
      }
      if (!row) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run(
          'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
          ['admin', hashedPassword, '관리자', 'admin'],
          (err) => {
            if (err) {
              console.error('관리자 계정 생성 오류:', err);
            } else {
              console.log('기본 관리자 계정이 생성되었습니다. (admin/admin123)');
            }
          }
        );
      }
    });

    // 기본 사용자 계정 생성
    db.get('SELECT * FROM users WHERE username = ?', ['user'], (err, row) => {
      if (err) {
        console.error('사용자 조회 오류:', err);
        return;
      }
      if (!row) {
        const hashedPassword = bcrypt.hashSync('user123', 10);
        db.run(
          'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
          ['user', hashedPassword, '일반사용자', 'user'],
          (err) => {
            if (err) {
              console.error('사용자 계정 생성 오류:', err);
            } else {
              console.log('기본 사용자 계정이 생성되었습니다. (user/user123)');
            }
          }
        );
      }
    });
  });
};

const getDb = () => {
  if (!db) {
    initDatabase();
  }
  return db;
};

module.exports = { initDatabase, getDb };

