const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.customer = require('./customer.model');
db.order = require('./order.model');
db.point = require('./point.model');
db.status = require('./status.model');

module.exports = db;
