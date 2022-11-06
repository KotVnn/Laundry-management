const mongoose = require('mongoose');

const status = mongoose.model(
  'status',
  new mongoose.Schema({
    name: String,
    id: Number,
    class: String,
  }),
);

module.exports = status;
