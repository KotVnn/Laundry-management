const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  alias: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  telegram: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles',
  },
  referer: String,
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
});
schema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
schema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model('user', schema);

module.exports = user;
