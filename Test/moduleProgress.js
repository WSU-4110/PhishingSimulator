function calculateProgress(assigned, completed) {
  if (!Array.isArray(assigned) || !Array.isArray(completed)) return 0;
  if (assigned.length === 0) return 0;
  return Math.round((completed.length / assigned.length) * 100);
}
module.exports = { calculateProgress };
