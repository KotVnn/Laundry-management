const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customers = mongoose.model(
  'customers',
  new mongoose.Schema({
    fullName: {
      type: String,
      default: 'Khách lẻ',
    },
    phone: String,
    address: String,
    pointUsed: {
      type: Number,
      default: 0,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'orders',
      },
    ],
  }),
);

module.exports = customers;
