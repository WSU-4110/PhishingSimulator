function assignModuleToUser(user, moduleName) {
  if (!user || !moduleName) return false;
  if (!user.assigned.includes(moduleName)) {
    user.assigned.push(moduleName);
    return true;
  }
  return false;
}
module.exports = { assignModuleToUser };
