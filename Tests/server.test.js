const request = require('supertest');
const app = require('../server'); // Path to your server.js
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

jest.mock('fs');
jest.mock('mysql2/promise');
jest.mock('jsonwebtoken');

describe('Server.js API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/admin/login', () => {
    test('should return token for valid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'wrong', password: 'test' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/verify-token', () => {
    test('should return valid=true for correct token', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => callback(null));
      const res = await request(app)
        .post('/api/verify-token')
        .set('Authorization', 'Bearer testtoken');

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
    });

    test('should return valid=false for invalid token', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('invalid')));
      const res = await request(app)
        .post('/api/verify-token')
        .set('Authorization', 'Bearer badtoken');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/submit-result', () => {
    test('should store result and return success', async () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation(() => {});

      const res = await request(app)
        .post('/api/submit-result')
        .send({ username: 'user1', moduleName: 'Module1', score: 95 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should return 400 if missing data', async () => {
      const res = await request(app)
        .post('/api/submit-result')
        .send({ username: '', moduleName: 'Module1' });

      expect(res.status).toBe(400);
    });
  });
});
