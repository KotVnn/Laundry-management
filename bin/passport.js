// config/passport.js
// load các module
const passport = require('passport');
// load user model
const User = require('../models').user;
const LocalStrategy = require('passport-local').Strategy;
const roleCon = require('../controllers/role.controller');
const userCon = require('../controllers/user.controller');
// passport session setup
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  }).populate('role');
});
// local sign-up
passport.use(
  'local.signup',
  new LocalStrategy(
    {
      // mặc định local strategy sử dụng username và password
      // chúng ta có thể cấu hình lại
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // cho phép chúng ta gửi reqest lại hàm callback
    },
    (req, username, password, done) => {
      // Tìm một user theo email
      // chúng ta kiểm tra xem user đã tồn tại hay không
      User.findOne({ username: username.toLowerCase() }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            message: 'Tên tài khoản đã có người sử dụng.',
          });
        }
        const role = await roleCon.setDefault();
        // Nếu chưa user nào sử dụng email này
        // tạo mới user
        const newUser = new User();
        // lưu thông tin cho tài khoản local
        newUser.username = username.toLowerCase();
        newUser.alias = username;
        newUser.role = role[0]._id;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(password);
        // lưu user
        newUser.save((err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      });
    },
  ),
);

// config/passport.js
// local sign-in
passport.use(
  'local.signin',
  new LocalStrategy(
    {
      // mặc định local strategy sử dụng username và password chúng ta có thể cấu hình lại
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      // cho phép chúng ta gửi reqest lại hàm callback
    },
    async (req, username, password, done) => {
      // tìm một user với email
      // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
      const user = await userCon.findOne({
        username: username.toLowerCase(),
      });
      if (!user) return done(null, false, { message: 'Not user found' });
      if (!user.validPassword(password))
        return done(null, false, { message: 'Wrong password' });
      return done(null, user);
    },
  ),
);
