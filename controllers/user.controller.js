const User = require('../models').user;
const roleCon = require('./role.controller');

exports.signup = async (req, res) => {
  const obj = { ...req.body };
  const role = await roleCon.setDefault();
  obj.role = role[0]._id;
  obj.alias = obj.username;
  obj.username = obj.username.toLowerCase();
  let user = await sessionCon.create(obj, req.headers['user-agent']);
  user.password = md5.encode(obj.password);
  user = new User(user);
  user.save().then(() => {
    res.cookie('ucl', user.sessions[0].md5, {
      maxAge: 7884000000,
      httpOnly: false,
    });
    return res.redirect('/');
  });
};

exports.login = async (req, res) => {
  let user = await User.findOne({
    username: req.body.username.toLowerCase(),
  }).populate('sessions');
  if (user) {
    user = await sessionCon.create(user, req.headers['user-agent']);
    user.save().then(() => {
      res.cookie('ucl', user.sessions[user.sessions.length - 1].md5, {
        maxAge: 7884000000,
        httpOnly: false,
      });
      return res.redirect('/');
    });
  } else {
    return res.redirect('/login');
  }
};

exports.isExists = (username) => {
  return User.findOne({ alias: username.toLowerCase() });
};
