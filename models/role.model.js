const mongoose = require('mongoose');

const role = mongoose.model(
  'role',
  new mongoose.Schema({
    name: String,
    level: {
      type: Number,
      default: 1,
    },
    title: String,
  }),
);

module.exports = role;
