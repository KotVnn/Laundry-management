const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = mongoose.model(
  'orders',
  new mongoose.Schema({
    id: String,
    quantity: Number,
    status: [
      {
        stt: {
          type: Schema.Types.ObjectId,
          ref: 'status',
        },
        time: Date,
      },
    ],
    date: Date,
    point: Number,
    usePoint: Boolean,
    total: Number,
    discount: Number,
    note: String,
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
    },
  }),
);

module.exports = orders;
