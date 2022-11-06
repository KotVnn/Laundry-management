const Customer = require('../models').customer;

exports.findCustomer = (phone) => {
  return Customer.findOne({ phone }).populate('orders');
};

exports.findAll = () => {
  return Customer.find().sort({ _id: -1 }).populate('orders');
};
