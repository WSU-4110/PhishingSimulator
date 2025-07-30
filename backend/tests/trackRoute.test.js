const express = require('express');
const request = require('supertest');
const db = require('../db');

jest.mock('../db'); // Mock the db connection

const app = express();
app.get('/track', (req, res) => {
  const { id } = req.query;
  const ip = req.ip;
  const time = new Date();

  db.query("INSERT INTO clicks SET ?", { id, ip, time }, (err) => {
    if (err) return res.status(500).send('Error');
    res.sendFile(__dirname + '/../1x1.png');
  });
});

describe('GET /track', () => {
  it('logs click and returns 1x1 image', async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null); // Simulate success
    });

    const res = await request(app).get('/track?id=test123');

    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ id: 'test123' }),
      expect.any(Function)
    );
    expect(res.status).toBe(200);
  });
});
