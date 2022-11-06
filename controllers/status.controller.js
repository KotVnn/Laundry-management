const Status = require('../models').status;

exports.findAll = () => {
  return Status.find();
};

exports.findById = (id) => {
  return Status.findOne({ id });
};

exports.updateStt = async (id) => {
  return {
    stt: await Status.findOne({ id }),
    time: new Date().toLocaleString(),
  };
};
