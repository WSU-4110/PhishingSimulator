const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SQLPasswordfor2025!',
  database: 'phishing_platform'
});

// Connect once and export
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
  } else {
    console.log('✅ Connected to MySQL!');
  }
});

module.exports = db;
