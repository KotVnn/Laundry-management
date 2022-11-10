const express = require('express');
const router = express.Router();
const cusCon = require('../controllers/customer.controller');
const orderCon = require('../controllers/order.controller');
const sttCon = require('../controllers/status.controller');
const searchCon = require('../controllers/search.controller');
const passport = require('passport');
const auth = require('../middlewares/validator');

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/customer', async (req, res) => {
  const listCustomer = await cusCon.findAll();
  if (listCustomer) return res.render('customer/index', { listCustomer });
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
  if (customer) return res.render('customer/detail', { customer });
  else return res.status(500).send();
});

router.get('/order', async (req, res) => {
  const orders = await orderCon.findAll();
  return res.render('order/index', { orders });
});

router.post('/order', async (req, res) => {
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const order = await orderCon.add(req.body);
  if (order) return res.redirect('/order/' + order.id);
  else return res.render('order/fail', { order: req.body });
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
  return res.render('order/detail', { order, listStatus });
});

router.post('/order/update', async (req, res) => {
  if (!req.body || !req.body.phone) {
    return res.redirect('/');
  }
  const order = await orderCon.update(req.body);
  if (order) return res.redirect('/order/' + req.body.id);
  else return res.render('order/fail', { order: req.body });
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
      pointUsed: 0,
    };
  return res.render('create', {
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

router.get('/search', async (req, res) => {
  if (req.query && req.query.key) {
    const rs = await searchCon.search(req.query.key);
    return res.render('search', {
      customers: rs[1].value,
      orders: rs[0].value,
    });
  }
});

router.get('/login', async (req, res) => {
  const messages = req.flash('error');
  return res.render('login', { messages, hasErrors: messages.length > 0 });
});

router.post(
  '/login',
  passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);

router.get(
  '/signup',
  passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
  }),
  async (req, res) => {
    const messages = req.flash('error');
    return res.render('signup', { messages, hasErrors: messages.length > 0 });
  },
);

router.post(
  '/signup',
  auth.validSignup,
  passport.authenticate('local.signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true,
  }),
);

router.get('/user', async (req, res) => {
  return res.render('user', {});
});

router.get('/status', async (req, res) => {
  return res.render('status', {});
});

module.exports = router;
