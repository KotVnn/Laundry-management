const express = require('express');
const router = express.Router();
const cusCon = require('../controllers/customer.controller');
const orderCon = require('../controllers/order.controller');
const title = 'Giặt là 83';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title });
});

router.post('/order/create', async (req, res) => {
  if (
    !req.body ||
    !req.body.phone ||
    req.body.phone.length < 10 ||
    !req.body.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  ) {
    return res.redirect('/');
  }
  const phone = req.body.phone.replace(/ .'",-\(\)\+/g, '');
  let customer = await cusCon.findCustomer(phone);
  if (!customer)
    customer = {
      fullName: 'Khách lẻ',
      address: '',
      phone: req.body.phone,
      point: 0,
    };
  return res.render('create', {
    title,
    customer,
  });
});

router.post('/order/add', async (req, res) => {
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const order = await orderCon.add(req.body);
  if (order) return res.redirect('/order/success/' + order.id);
  else return res.render('order/fail', { title, order: req.body });
});

router.get('/order/success/:orderId', async (req, res) => {
  console.log('params', req.params);
  const order = await orderCon.findById(req.params.orderId);
  if (order) return res.render('order/success', { title, order });
});

router.get('/customer/:phone', async (req, res) => {
  const customer = await cusCon.findCustomer(req.params.phone);
  return res.render('customer/detail', { title, customer });
});

module.exports = router;
