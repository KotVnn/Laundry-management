const User = require('../models').user;
exports.signup = (body) => {
  const user = new User(body);
};
