const request = require('supertest');
const express = require('express');
const clickRoutes = require('../routes/click');

// Mock db
jest.mock('../db');
const db = require('../db');

// Create test app
const app = express();
app.use(clickRoutes);

describe('GET /api/clicks', () => {
  it('should return click stats from database', async () => {
    const fakeData = [
      { employeeName: 'Alice', email: 'alice@example.com', email_type: 'phish', clickCount: 3 }
    ];
    
    db.query.mockImplementation((sql, callback) => {
      callback(null, fakeData);
    });

    const res = await request(app).get('/api/clicks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeData);
  });

  it('should return 500 on database error', async () => {
    db.query.mockImplementation((sql, callback) => {
      callback(new Error('DB error'));
    });

    const res = await request(app).get('/api/clicks');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Database error');
  });
});
