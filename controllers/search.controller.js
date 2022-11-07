const orderCon = require('./order.controller');
const cusCon = require('./customer.controller');

exports.search = async (key) => {
  return await Promise.allSettled([
    new Promise((resolve) => {
      const rs = orderCon.findAll({ id: { $regex: key } });
      if (rs) return resolve(rs);
    }),
    new Promise((resolve) => {
      const rs = cusCon.findAll({ phone: { $regex: key } });
      if (rs) return resolve(rs);
    }),
  ]).catch((err) => {
    console.error('err', err.message);
    return false;
  });
};
