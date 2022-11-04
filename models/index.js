const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.customer = require('./customer.model');
db.order = require('./order.model');
db.point = require('./point.model');

module.exports = db;
