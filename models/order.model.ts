import mongoose, { SchemaTypes } from 'mongoose';
import moment from 'moment';

const StatusOrderSchema = new mongoose.Schema(
  {
    stt: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'Status',
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => moment().format('MM-DD-YY-HHmm').replace(/-/g, ''),
  },
  note: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: [StatusOrderSchema],
    required: false,
  },
  usePoint: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  customer: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'Customer',
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
