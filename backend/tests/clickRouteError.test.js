const request = require('supertest');
const express = require('express');

jest.mock('../db', () => ({
  query: (sql, callback) => {
    callback(new Error('DB failure'));
  }
}));

const clickRoutes = require('../routes/click');
const app = express();
app.use(clickRoutes);

describe('GET /api/clicks error case', () => {
  it('should handle DB errors gracefully', async () => {
    const response = await request(app).get('/api/clicks');
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
