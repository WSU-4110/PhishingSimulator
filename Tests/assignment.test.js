const { assignModuleToUser } = require('../utils/assignment');

describe('assignModuleToUser', () => {
  test('assigns module if not already assigned', () => {
    const user = { assigned: [] };
    expect(assignModuleToUser(user, 'Intro')).toBe(true);
    expect(user.assigned).toContain('Intro');
  });

  test('does not reassign existing module', () => {
    const user = { assigned: ['Intro'] };
    expect(assignModuleToUser(user, 'Intro')).toBe(false);
  });

  test('fails gracefully on invalid input', () => {
    expect(assignModuleToUser(null, 'Intro')).toBe(false);
  });
});
