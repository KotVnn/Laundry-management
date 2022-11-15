const { check, validationResult } = require('express-validator');
exports.validSignup = (req, res, next) => {
  check('email', 'Email không đúng !').isEmail();
  check('password', 'Password phải dài hơn 6 kí tự !').isLength({ min: 6 });
  let messages = req.flash('error');
  const result = validationResult(req);
  const errors = result.errors;
  if (!result.isEmpty()) {
    if (!messages) messages = [];
    errors.forEach((el) => {
      messages.push(el.msg);
    });
  } else {
    next();
  }
};

exports.admin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role.level === 1) return next();
  return res.redirect('/login?returnUrl=' + req.originalUrl);
};
