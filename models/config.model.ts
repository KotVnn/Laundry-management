import mongoose from 'mongoose';

const ConfigSocialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { _id: false });

const ConfigSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  api: {
    type: String,
    required: true,
  },
  social: {
    type: [ConfigSocialSchema],
    required: true,
  },
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
