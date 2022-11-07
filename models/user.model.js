const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = mongoose.model(
  'user',
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    telegram: String,
    role: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
    },
    session: String,
    referer: String,
  }),
);

module.exports = user;
