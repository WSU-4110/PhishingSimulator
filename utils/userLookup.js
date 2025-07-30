const data = [
  { email: 'hh9241@wayne.edu', name: 'Andrea', assigned: ['A'], completed: [] },
];

function findUserByEmail(email) {
  return data.find(u => u.email === email);
}
module.exports = { findUserByEmail };
