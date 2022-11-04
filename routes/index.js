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
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const phone = req.body.phone.replace(/ .'",-\(\)\+/g, '');
  const customer = await cusCon.findCustomer(phone);
  console.log(customer);
  return res.render('create', { title, customer });
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
