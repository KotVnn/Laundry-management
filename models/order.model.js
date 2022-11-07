const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = mongoose.model(
  'orders',
  new mongoose.Schema({
    id: String,
    quantity: {
      type: Number,
      default: 0,
    },
    status: [
      {
        stt: {
          type: Schema.Types.ObjectId,
          ref: 'status',
        },
        time: Date,
      },
    ],
    date: {
      type: Date,
      default: new Date().toLocaleString(),
    },
    point: {
      type: Number,
      default: 0,
    },
    usePoint: {
      type: Boolean,
      default: false,
    },
    total: Number,
    discount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: '',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
    },
  }),
);

module.exports = orders;
