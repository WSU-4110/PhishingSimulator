const mysql = require('mysql2');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SQLPasswordfor2025!',
  database: 'phishing_platform'
});

if (process.env.NODE_ENV !== 'test') {
  db.connect((err) => {
    if (err) console.error('MySQL connection error:', err);
    else console.log('Connected to MySQL');
  });
}


module.exports = db;
