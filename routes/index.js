const express = require('express');
const router = express.Router();
const cusCon = require('../controllers/customer.controller');
const orderCon = require('../controllers/order.controller');
const sttCon = require('../controllers/status.controller');
const title = 'Giặt là 83';

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index', { title });
});

router.get('/customer', async (req, res) => {
  const listCustomer = await cusCon.findAll();
  if (listCustomer)
    return res.render('customer/index', { title, listCustomer });
  else return res.status(500);
});

router.get('/customer/:phone', async (req, res) => {
  if (
    !req.params ||
    !req.params.phone ||
    req.params.phone.length < 10 ||
    !req.params.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  ) {
    return res.redirect('/');
  }
  const customer = await cusCon.findCustomer(req.params.phone);
  if (customer) return res.render('customer/detail', { title, customer });
  else return res.status(500).send();
});

router.get('/order', async (req, res) => {
  const orders = await orderCon.findAll();
  return res.render('order/index', { title, orders });
});

router.post('/order', async (req, res) => {
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const order = await orderCon.add(req.body);
  if (order) return res.redirect('/order/' + order.id);
  else return res.render('order/fail', { title, order: req.body });
});

router.get('/order/:id', async (req, res) => {
  if (
    !req.params ||
    !req.params.id ||
    req.params.id.length < 10 ||
    !req.params.id.match(/\d/g)
  ) {
    return res.redirect('/');
  }
  const listStatus = await sttCon.findAll();
  const order = await orderCon.findById(req.params.id);
  return res.render('order/detail', { title, order, listStatus });
});

router.post('/order/update', async (req, res) => {
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const order = await orderCon.update(req.body);
  if (order) return res.redirect('/order/' + req.body.id);
  else return res.render('order/fail', { title, order: req.body });
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

router.get('/order/delete/:id', async (req, res) => {
  if (req.params.id) {
    const rs = await orderCon.delOrder(req.params.id);
    if (rs && rs.deletedCount && rs.deletedCount === 1)
      return res.redirect('/order');
    return res.redirect('/order/' + req.params.id);
  } else {
    return res.status(500).send();
  }
});

module.exports = router;
