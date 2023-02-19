const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const cusCon = require('../controllers/customer.controller');
const orderCon = require('../controllers/order.controller');
const sttCon = require('../controllers/status.controller');
const searchCon = require('../controllers/search.controller');
const passport = require('passport');
const auth = require('../middlewares/validator');
const Point = require('../models').point;
const Status = require('../models').status;
const title = 'Giặt là 83';
const meta = {
  description:
    'Giặt chăn Lạng Sơn, dịch vụ giặt là Lạng Sơn, dịch vụ giặt là lấy ngay',
  robots: 'max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  locale: 'vi_VN',
  type: 'website',
  url: 'https://giatchanlangson.com',
  siteName: 'Giặt là 83',
};

router.get('/login', async (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/man');
  const messages = req.flash('error');
  return res.render('login', {
    title,
    meta,
    messages,
    hasErrors: messages.length > 0,
    returnUrl: req.query && req.query.returnUrl ? req.query.returnUrl : null,
  });
});

router.post(
  '/login',
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);

router.get('/signup', async (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/man');
  const messages = req.flash('error');
  return res.render('signup', {
    title,
    meta,
    messages,
    hasErrors: messages.length > 0,
  });
});

router.get('/logout', async (req, res) => {
  req.logout({ keepSessionInfo: false }, () => {
    return res.redirect('/');
  });
});

router.post(
  '/login',
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  }),
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

router.get('/hd/:id', async (req, res) => {
  if (
    !req.params ||
    !req.params.id ||
    req.params.id.length < 10 ||
    !req.params.id.match(/\d/g)
  ) {
    return res.redirect('/');
  }
  if (req.user && req.user.role.level === 1) {
    return res.redirect('/order/' + req.params.id);
  }
  return res.render('order/customer', {
    title,
    meta,
    id: req.params.id,
  });
});

router.post('/hd/:id', async (req, res) => {
  if (
    !req.params ||
    !req.params.id ||
    req.params.id.length < 10 ||
    !req.params.id.match(/\d/g)
  ) {
    return res.redirect('/');
  }
  const order = await orderCon.findById(req.params.id);
  const customer = await cusCon.findCustomer(order.customer.phone);
  if (order && customer) {
    return res.render('order/customer', {
      title: title + ' - Chi tiết đơn hàng #' + order.id,
      meta,
      order,
      customer,
      id: req.params.id,
    });
  }
  return res.redirect('/');
});

router.get('/profile', async (req, res) => {
  if (req.isAuthenticated())
    return res.render('profile', {
      title,
      user: req.user,
      moduleName: 'Profile',
      active: 6,
    });
  else return res.redirect('/login');
});

router.get('/', async (req, res) => {
  res.render('index', {
    title,
    meta,
  });
});

// router.use(auth.admin);

/* GET home page. */
router.get('/man', async (req, res) => {
  res.render('index', {
    title,
    user: req.user,
    moduleName: 'Tổng quan',
    active: 1,
  });
});

router.get('/customer', async (req, res) => {
  const listCustomer = await cusCon.findAll();
  if (listCustomer)
    return res.render('customer/index', {
      user: req.user,
      listCustomer,
      moduleName: 'Khách hàng',
      active: 2,
    });
  else return res.status(500);
});

router.post('/customer/update', cusCon.update);

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
  if (customer)
    return res.render('customer/detail', {
      title,
      user: req.user,
      customer,
      moduleName: 'Khách hàng',
      active: 2,
    });
  else return res.status(500).send();
});

router.get('/order', async (req, res) => {
  const dashboard = await orderCon.mainOrder();
  return res.render('order/index', {
    title,
    user: req.user,
    dashboard,
    moduleName: 'Đơn hàng',
    active: 3,
  });
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
  const order = await orderCon.findById(req.params.id);
  return res.render('order/detail', {
    order,
    user: req.user,
    customer: await cusCon.findCustomer(order.customer.phone),
    listStatus: await sttCon.findAll(),
    point: await Point.findOne(),
    moduleName: 'Chi tiết đơn hàng #' + order.id,
    title: title + ' - Chi tiết đơn hàng #' + order.id,
    active: 3,
  });
});

router.get('/order/status/:id', async (req, res) => {
  if (!req.params || !req.params.id || !req.params.id.match(/\d/g)) {
    return res.redirect('/');
  }
  const orders = await orderCon.findByStatus(req.params.id);
  if (!orders) {
    return res.redirect('/order');
  }
  return res.render('order/index', {
    title,
    user: req.user,
    orders,
    moduleName: 'Đơn hàng',
    active: 3,
  });
});

router.get('/order/print/:id', async (req, res) => {
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
  const customer = await cusCon.findCustomer(order.customer.phone);
  const qrImg = await QRCode.toDataURL(
    `https://${req.headers.host}/hd/${order.id}`,
  );
  return res.render('order/print', {
    order,
    user: req.user,
    customer,
    listStatus,
    moduleName: 'Chi tiết đơn hàng #' + order.id,
    title: title + ' - Chi tiết đơn hàng #' + order.id,
    qrImg,
    active: 3,
  });
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
    return res.redirect('/man');
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
    title,
    user: req.user,
    customer,
    point: await Point.findOne(),
    moduleName: 'Tạo đơn hàng mới',
    active: 3,
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
      title,
      moduleName: 'Tìm kiếm',
      user: req.user,
      customers: rs[1].value,
      orders: rs[0].value,
    });
  }
});

router.get('/point', async (req, res) => {
  const point = await Point.findOne();
  return res.render('point', {
    title,
    point,
    user: req.user,
    moduleName: 'Cấu hình tính điểm',
    active: 4,
  });
});

router.post('/point', async (req, res) => {
  await Point.updateOne({ id: 1 }, { discount: req.body.discount });
  return res.redirect('/point');
});

router.get('/status', async (req, res) => {
  const status = await Status.find();
  return res.render('status', {
    title,
    user: req.user,
    moduleName: 'Cấu hình trạng thái',
    status,
    active: 5,
  });
});

router.post('/status', async (req, res) => {
  const obj = { ...req.body };
  obj.name = obj.name.toUpperCase();
  const newStt = new Status(obj);
  await newStt.save();
  return res.redirect('/status');
});

router.post('/status/:id', async (req, res) => {
  const obj = { ...req.body };
  obj.name = obj.name.toUpperCase();
  await Status.updateOne({ id: req.body.id }, obj);
  return res.redirect('/status');
});

router.get('/status/del/:id', async (req, res) => {
  await Status.deleteOne({ id: req.params.id });
  return res.redirect('/status');
});

module.exports = router;
