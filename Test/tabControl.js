function unlockNextTab(currentIndex, totalTabs) {
  if (currentIndex < 0 || currentIndex >= totalTabs - 1) return null;
  return currentIndex + 1;
}
module.exports = { unlockNextTab };
