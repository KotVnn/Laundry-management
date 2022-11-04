const express = require('express');
const router = express.Router();
const cusCon = require('../controllers/customer.controller');
const title = 'Gặt là 83';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title });
});

router.post('/create', async (req, res) => {
  console.info(req.body.phone);
  const customer = await cusCon.findCustomer(req.body.phone);
  res.render('create', { title, customer });
});

module.exports = router;
