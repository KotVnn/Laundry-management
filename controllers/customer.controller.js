const Customer = require('../models').customer;

exports.findCustomer = async (phone) => {
  return Customer.findOne({ phone }).populate('orders');
};
