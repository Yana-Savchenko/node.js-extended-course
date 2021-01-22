const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuth: false,
  });
}

exports.postLogin = (req, res) => {
  User.findById('60080150b9e5c10d021220e3')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      })
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
}