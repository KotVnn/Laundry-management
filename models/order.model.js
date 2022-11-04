const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = mongoose.model(
  'orders',
  new mongoose.Schema({
    id: String,
    quantity: Number,
    status: Number,
    date: Date,
    usePoint: Boolean,
    total: Number,
    discount: Number,
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
    },
  }),
);

module.exports = orders;
