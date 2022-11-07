const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = mongoose.model(
  'user',
  new mongoose.Schema({
    username: String,
    alias: String,
    password: String,
    email: String,
    phone: String,
    telegram: String,
    role: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
    },
    session: [
      {
        type: Schema.Types.ObjectId,
        ref: 'sessions',
      },
    ],
    referer: String,
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
    },
  }),
);

module.exports = user;
