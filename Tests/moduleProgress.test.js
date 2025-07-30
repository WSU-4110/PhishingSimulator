const { calculateProgress } = require('../utils/moduleProgress');

describe('calculateProgress', () => {
  test('66% when 2 of 3 completed', () => {
    expect(calculateProgress(['A', 'B', 'C'], ['A', 'C'])).toBe(66);
  });

  test('0% if none assigned', () => {
    expect(calculateProgress([], [])).toBe(0);
  });

  test('100% if all completed', () => {
    expect(calculateProgress(['A'], ['A'])).toBe(100);
  });

  test('rounds to nearest integer', () => {
    expect(calculateProgress(['A', 'B', 'C'], ['A'])).toBe(33);
  });

  test('handles non-arrays', () => {
    expect(calculateProgress(null, null)).toBe(0);
  });
});
