const User = require('../models').user;

exports.findOne = (query) => {
  return User.findOne(query).populate('role').populate('customer');
};
