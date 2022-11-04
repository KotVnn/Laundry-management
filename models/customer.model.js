const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customers = mongoose.model(
  'customers',
  new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    fullName: String,
    phone: String,
    address: String,
    note: String,
    point: Number,
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'orders',
      },
    ],
  }),
);

module.exports = customers;
