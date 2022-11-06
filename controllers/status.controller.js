const Status = require('../models').status;

exports.findAll = () => {
  return Status.find();
};

exports.findById = (id) => {
  return Status.findOne({ id });
};
