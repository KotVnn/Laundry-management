const Status = require('../models').status;

exports.findAll = () => {
  return Status.find();
};

exports.findById = (id) => {
  return Status.findOne({ id });
};

exports.updateStt = async (name) => {
  return {
    stt: await Status.findOne({ name }),
    time: new Date().toLocaleString(),
  };
};
