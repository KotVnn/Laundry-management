const mongoose = require('mongoose');

const status = mongoose.model(
  'status',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      sparse: true,
      unique: true,
    },
    id: {
      type: Number,
      required: true,
      sparse: true,
      unique: true,
    },
    class: String,
  }),
);

module.exports = status;
