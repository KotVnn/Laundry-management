const userCon = require('../controllers/user.controller');

exports.validateFormLoginSignup = async (req, res, next) => {
  if (
    req.body &&
    req.body.username &&
    /^(?=[a-zA-Z0-9._]{3,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(
      req.body.username,
    ) &&
    req.body.password &&
    req.body.password.length > 8
  ) {
    if (req.url === '/signup') {
      const user = await userCon.isExists(req.body.username);
      if (user) return res.render('login', {});
    }
    next();
  } else {
    return res.render('login', {});
  }
};
