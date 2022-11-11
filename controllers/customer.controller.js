const Customer = require('../models').customer;

exports.findCustomer = (phone) => {
  return new Promise((resolve) => {
    Customer.findOne({ phone })
      .populate({
        path: 'orders',
        populate: {
          path: 'status.stt',
        },
      })
      .exec((err, cus) => {
        if (err) {
          console.error('cus.findCustomer', err.message);
          return resolve(false);
        }
        if (cus) {
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
        }
        return resolve(false);
      });
  });
};

exports.findAll = (query) => {
  return new Promise((resolve) => {
    Customer.find(query || {})
      .sort({ _id: -1 })
      .limit(30)
      .populate('orders')
      .exec((err, rs) => {
        if (err) {
          console.error('cus.findAll', err.message);
          return resolve(false);
        }
        const arrCustomer = rs.map((el) => {
          let point = 0;
          if (el.orders && el.orders.length) {
            for (const order of el.orders) {
              point += order.point;
            }
          }
          if (el.pointUsed) point = point - el.pointUsed;
          console.log({
            ...el,
            point,
          });
          return {
            ...el._doc,
            point,
          };
        });
        return resolve(arrCustomer);
      });
  });
};
