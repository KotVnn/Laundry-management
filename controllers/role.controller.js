const Role = require('../models').role;

exports.setDefault = () => {
  return Role.find().sort({ level: -1 }).limit(1);
};
