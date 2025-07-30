// __tests__/clickController.test.js
const { getClickStats } = require('../controllers/clickController');

jest.mock('../db');
const db = require('../db');

describe('getClickStats', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  test('responds with click data on success', () => {
    const fakeResults = [{ employeeName: 'Alice', email: 'a@b.com', email_type: 'phishing', clickCount: 3 }];
    db.query.mockImplementation((sql, cb) => cb(null, fakeResults));

    getClickStats(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeResults);
  });

  test('responds with 500 on DB error', () => {
    db.query.mockImplementation((sql, cb) => cb(new Error('DB failed')));

    getClickStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });

  test('runs the expected SQL query', () => {
    db.query.mockImplementation((sql, cb) => cb(null, []));
    getClickStats(req, res);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), expect.any(Function));
  });
});
