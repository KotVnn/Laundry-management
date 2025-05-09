import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Status || mongoose.model('Status', StatusSchema);
