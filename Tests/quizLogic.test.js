const { checkAnswer } = require('../utils/quizLogic');

describe('checkAnswer', () => {
  test('returns correct for right answer', () => {
    expect(checkAnswer('b', 'b')).toBe('Correct! ✅');
  });

  test('returns incorrect for wrong answer', () => {
    expect(checkAnswer('a', 'b')).toBe('Incorrect. ❌ Please try again.');
  });

  test('prompts for no selection', () => {
    expect(checkAnswer(null, 'b')).toBe('Please select an answer.');
  });
});
