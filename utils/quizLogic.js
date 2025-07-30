function checkAnswer(selected, correct) {
  if (!selected) return 'Please select an answer.';
  return selected === correct ? 'Correct! ✅' : 'Incorrect. ❌ Please try again.';
}
module.exports = { checkAnswer };
