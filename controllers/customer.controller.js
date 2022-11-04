const Customer = require('../models').customer;

exports.findCustomer = async (phone) => {
  return await Customer.findOne({ phone });
};
