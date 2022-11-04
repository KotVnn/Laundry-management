const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.customer = require('./customer.model');
db.order = require('./order.model');

module.exports = db;
