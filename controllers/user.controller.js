const User = require('../models').user;
const sessionCon = require('./session.controller');
const roleCon = require('./role.controller');
const md5 = require('md5');

exports.signup = async (req, res) => {
  const obj = { ...req.body };
  const role = await roleCon.setDefault();
  obj.role = role[0]._id;
  obj.alias = obj.username;
  obj.username = obj.username.toLowerCase();
  const session = await sessionCon.create(obj, req.headers['user-agent']);
  obj.session = session._id;
  obj.password = md5(obj.password);
  const user = new User(obj);
  user.save().then(() => {
    res.cookie('ucl', session.md5, { maxAge: 78840000, httpOnly: false });
    let nextUrl = '/';
    if (req.headers.nextStep) nextUrl = req.headers.nextStep;
    return res.redirect(nextUrl);
  });
};

exports.isExists = (username) => {
  return User.findOne({ alias: username.toLowerCase() });
};
