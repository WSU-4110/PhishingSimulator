const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/api/clicks', (req, res) => {
  const sql = `
    SELECT e.name AS employeeName, e.email, c.email_type, COUNT(*) AS clickCount
    FROM Clicks c
    JOIN Employees e ON c.employee_id = e.employee_id
    GROUP BY e.employee_id, c.email_type
    ORDER BY clickCount DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
