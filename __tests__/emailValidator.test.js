const { validateEmail } = require('../utils/emailValidator');

describe('validateEmail', () => {
  test('returns true for a valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('returns false for email missing "@"', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  test('returns false for email missing domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });
});
