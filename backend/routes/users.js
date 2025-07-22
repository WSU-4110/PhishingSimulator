const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add-user', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email required' });
  }

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM Employees WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ success: true, message: 'User already exists' });
    }

    // Insert user with default company_id (you can adjust as needed)
    await db.query('INSERT INTO Employees (company_id, name, email) VALUES (?, ?, ?)', [1, name, email]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
