const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = mongoose.model(
  'orders',
  new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    quantity: Number,
    status: Number,
    date: Date,
    total: Number,
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
    },
  }),
);

module.exports = orders;
