const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const session = mongoose.model(
  'session',
  new mongoose.Schema(
    {
      date: {
        $type: Date,
        default: new Date().toLocaleString(),
      },
      client: {
        type: String,
        name: String,
        version: String,
        engine: String,
        engineVersion: String,
      },
      os: {
        name: String,
        version: String,
        platform: String,
      },
      device: {
        type: String,
        brand: String,
        model: String,
      },
      bot: Boolean,
      md5: String,
      username: String,
      role: {
        $type: Schema.Types.ObjectId,
        ref: 'role',
      },
    },
    { typeKey: '$type' },
  ),
);

module.exports = session;
