const { findUserByEmail } = require('../utils/userLookup');

describe('findUserByEmail', () => {
  test('returns user when email exists', () => {
    const user = findUserByEmail('hh9241@wayne.edu');
    expect(user.name).toBe('Andrea');
  });

  test('returns undefined when email does not exist', () => {
    const result = findUserByEmail('fake@wayne.edu');
    expect(result).toBeUndefined();
  });
});
