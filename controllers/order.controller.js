const Order = require('../models').order;
const Customer = require('../models').customer;
const Point = require('../models').point;
const sttCon = require('./status.controller');

exports.add = async (order) => {
  let customer = await Customer.findOne({ phone: order.phone }).populate(
    'orders',
  );
  if (!customer) {
    customer = new Customer({
      fullName: order.fullName,
      phone: order.phone,
      pointUsed: 0,
      address: order.address,
    });
    await customer.save();
  }
  const point = await Point.findOne();
  const pointCal = order.total / point.discount;
  const newOrder = new Order({
    id: createOrderId(),
    quantity: order.quantity,
    date: new Date().toLocaleString(),
    usePoint: order.usePoint,
    customer: customer._id,
    point: pointCal,
    note: order.note,
    total: order.total < 10000 ? order.total * 1000 : order.total,
    discount: order.discount ? order.discount : 0,
    status: await sttCon.updateStt(1),
  });
  await newOrder.save();
  customer.orders.unshift(newOrder._id);
  customer.save();
  return Order.findOne({ _id: newOrder._id })
    .populate('customer')
    .populate('status.stt');
};

const createOrderId = () => {
  const thisDayText = new Date()
    .toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/[/:, ]/g, '');
  return `${thisDayText}`;
};

exports.findAll = () => {
  return Order.find()
    .sort({ _id: -1 })
    .populate('customer')
    .populate('status.stt');
};

exports.findById = (id) => {
  return Order.findOne({ id }).populate('customer').populate('status.stt');
};
