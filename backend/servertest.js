const express = require('express');
const app = express();
const db = require('./backend/db');
app.use(express.json());

// Example route to save quiz result
app.post('/api/quiz-results', (req, res) => {
  const { employee_id, company_id, module_number, score } = req.body;
  const sql = 'INSERT INTO QuizResults (employee_id, company_id, module_number, score) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [employee_id, company_id, module_number, score], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).send('DB error');
    }
    res.send('Result saved');
  });
});
