const Order = require('../models').order;
const Customer = require('../models').customer;
const Point = require('../models').point;

exports.add = async (order) => {
  let customer = await Customer.findOne({ phone: order.phone }).populate(
    'orders',
  );
  if (!customer) {
    customer = new Customer({
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
      note: order.note,
      point: order.point,
    });
    await customer.save();
  }
  const newOrder = new Order({
    id: await createOrderId(),
    quantity: order.quantity,
    date: new Date().toLocaleString(),
    usePoint: order.usePoint,
    customer: customer._id,
    total: order.total,
    discount: order.discount,
  });
  await newOrder.save();
  customer.orders.push(newOrder._id);
  const point = await Point.findOne();
  customer.point = order.total / point.discount;
  customer.save();
  return Order.findOne({ _id: newOrder._id }).populate('customer');
};

const createOrderId = async () => {
  const totalOrder = await Order.find().count();
  const thisDayText = new Date()
    .toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '');
  return `${thisDayText}-${totalOrder}`;
};

exports.findById = (id) => {
  return Order.findOne({ id }).populate('customer');
};
