const { unlockNextTab } = require('../utils/tabControl');

describe('unlockNextTab', () => {
  test('unlocks next tab if valid', () => {
    expect(unlockNextTab(1, 4)).toBe(2);
  });

  test('returns null if last tab', () => {
    expect(unlockNextTab(3, 4)).toBeNull();
  });

  test('returns null if index is invalid', () => {
    expect(unlockNextTab(-1, 4)).toBeNull();
  });
});
