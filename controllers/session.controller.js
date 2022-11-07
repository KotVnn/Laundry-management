const md5 = require('md5');
const ParseDevice = require('device-detector-js');
const Session = require('../models').session;

exports.create = (user, userAgent) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const deviceDetector = new ParseDevice();
    const detector = await deviceDetector.parse(userAgent);
    const obj = {
      username: user.username,
      role: user.role,
      ...detector,
    };
    obj.md5 = md5(obj);
    const session = await new Session(obj);
    session.save().then(() => {
      return resolve(session);
    });
  });
};
