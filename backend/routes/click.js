// routes/click.js
jest.mock('../db');
const express = require('express');
const router = express.Router();
const { getClickStats } = require('../controllers/clickController');

router.get('/api/clicks', getClickStats);

module.exports = router;
