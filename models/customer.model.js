const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customers = mongoose.model(
  'customers',
  new mongoose.Schema({
    fullName: {
      type: String,
      default: 'Khách lẻ',
    },
    phone: {
      type: String,
      required: true,
      sparse: true,
      unique: true,
    },
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
