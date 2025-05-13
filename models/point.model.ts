import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Point || mongoose.model('Point', PointSchema);
