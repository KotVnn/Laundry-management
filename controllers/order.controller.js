const Order = require('../models').order;
const Customer = require('../models').customer;
const Point = require('../models').point;
const sttCon = require('./status.controller');
const cusCon = require('../controllers/customer.controller');

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
  const pointCal =
    order.total < 10000
      ? (order.total * point.discount) / 100
      : (order.total / 100000) * point.discount;
  const newOrder = new Order({
    id: createOrderId(),
    quantity: order.quantity,
    date: new Date().toLocaleString(),
    usePoint: !!order.discount,
    customer: customer._id,
    point: pointCal.toFixed(),
    note: order.note,
    total: order.total < 10000 ? order.total * 1000 : order.total,
    discount: order.discount ? order.discount : 0,
    status: await sttCon.updateStt('Nhận đơn'.toUpperCase()),
  });
  await newOrder.save();
  if (order.discount) {
    customer.pointUsed += parseInt(order.discount);
  }
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

exports.update = (order) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const oldOrder = await Order.findOne({ id: order.id });
    const point = await Point.findOne();
    for (const key in order) {
      if (key.indexOf('status') === -1) {
        if (key === 'total') {
          oldOrder[key] = order[key] * 1000;
        } else oldOrder[key] = order[key];
      } else {
        if (
          oldOrder[key].length &&
          oldOrder[key][0].stt.toString().indexOf(order.status) === -1
        ) {
          oldOrder[key].unshift({
            stt: order.status,
            time: new Date().toLocaleString(),
          });
        }
      }
    }
    if (order.discount) {
      oldOrder.usePoint = true;
      oldOrder.point = ((order.total / 100) * point.discount).toFixed();
      const customer = await cusCon.findCustomer(order.phone);
      if (customer) {
        customer.pointUsed += parseInt(order.discount);
        await customer.save();
      }
    }
    Order.updateOne({ id: order.id }, oldOrder, (err) => {
      if (err) {
        console.error(err.message);
        return resolve(false);
      }
      return resolve(true);
    });
  });
};

exports.mainOrder = () => {
  return Promise.all([
    new Promise((resolve) => {
      return resolve(
        Order.aggregate().group({
          _id: { $arrayElemAt: ['$status.stt', 0] },
          count: { $sum: 1 },
        }),
      );
    }),
    new Promise((resolve) => {
      return resolve(
        Order.find()
          .sort({ _id: -1 })
          .populate('customer')
          .populate('status.stt')
          .limit(30),
      );
    }),
    new Promise((resolve) => {
      return resolve(sttCon.findAll());
    }),
  ]).then((result) => {
    if (!result || !result[0] || !result[1]) {
      return null;
    }
    const sum = result[0]
      .map((el) => {
        const status = result[2].find((stt) => stt._doc._id.equals(el._id));
        el = { ...el, ...status._doc };
        return el;
      })
      .sort((a, b) => a.id - b.id);
    return {
      sum,
      orders: result[1],
    };
  });
};

exports.findByStatus = async (sttId) => {
  const stt = await sttCon.findById(sttId);
  if (!stt) return false;
  return Order.find({ 'status.0.stt': stt._id })
    .populate('customer')
    .populate('status.stt')
    .limit(50);
};

exports.findAll = (query) => {
  return Order.find(query || {})
    .sort({ _id: -1 })
    .populate('customer')
    .populate('status.stt')
    .limit(30);
};

exports.findById = (id) => {
  return Order.findOne({ id }).populate('customer').populate('status.stt');
};

exports.delOrder = (id) => {
  return Order.deleteOne({ id });
};
