import mongoose, { SchemaTypes } from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  pointUse: {
    type: Number,
    required: true,
    default: 0,
  },
  orders: {
    type: [SchemaTypes.ObjectId],
    required: false,
    ref: 'Order',
  },
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
