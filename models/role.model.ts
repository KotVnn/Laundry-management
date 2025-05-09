import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
