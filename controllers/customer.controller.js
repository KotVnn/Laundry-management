const Customer = require('../models').customer;

exports.findCustomer = (phone) => {
  return new Promise((resolve) => {
    Customer.findOne({ phone })
      .populate('orders')
      .exec((err, cus) => {
        if (err) {
          console.error(err.message);
          return resolve(false);
        }
        cus._doc.point = 0;
        if (cus._doc.orders && cus._doc.orders.length) {
          for (const order of cus._doc.orders) {
            cus._doc.point += order._doc.point;
          }
        } else {
          cus._doc.point = 0;
        }
        if (cus._doc.pointUsed)
          cus._doc.point = cus._doc.point - cus._doc.pointUsed;
        return resolve(cus);
      });
  });
};

exports.findAll = () => {
  return new Promise((resolve) => {
    Customer.find()
      .sort({ _id: -1 })
      .limit(30)
      .populate('orders')
      .exec((err, rs) => {
        if (err) {
          console.error(err.message);
          return resolve(false);
        }
        const arrCustomer = rs.map((el) => {
          if (el.orders && el.orders.length) {
            for (const order of el.orders) {
              el.point += order.point;
            }
          } else {
            el.point = 0;
          }
          if (el.pointUsed) el.point = el.point - el.pointUsed;
          return el;
        });
        return resolve(arrCustomer);
      });
  });
};
