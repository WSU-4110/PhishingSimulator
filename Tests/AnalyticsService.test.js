const fs = require('fs');
const AnalyticsService = require('../backend/AnalyticsService');

jest.mock('fs');

describe('AnalyticsService', () => {
  let service;

  beforeEach(() => {
    service = new AnalyticsService();
    jest.clearAllMocks();
  });

  test('getUserInteractionStats() returns empty array when files don\'t exist', () => {
    fs.existsSync.mockReturnValue(false);
    const result = service.getUserInteractionStats();
    expect(result).toEqual([]);
  });

  test('getUserInteractionStats() returns parsed data', () => {
    const mockTracking = JSON.stringify({
      token123: { email: 'john@example.com', opened: true, openedAt: '2025-07-20' },
    });
    const mockPhishing = JSON.stringify([{ username: 'john@example.com' }]);

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation((file) =>
      file.includes('tracking.json') ? mockTracking : mockPhishing
    );

    const result = service.getUserInteractionStats();
    expect(result[0].clicked).toBe(true);
    expect(result[0].email).toBe('john@example.com');
  });
});
