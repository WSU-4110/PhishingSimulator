const { validateEmail } = require('../utils/validation');

describe('validateEmail', () => {
  test('validates correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('rejects missing @ symbol', () => {
    expect(validateEmail('invalidemail.com')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
