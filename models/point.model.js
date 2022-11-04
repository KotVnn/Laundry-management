const mongoose = require('mongoose');

const point = mongoose.model(
  'point',
  new mongoose.Schema({
    discount: Number,
  }),
);

module.exports = point;
