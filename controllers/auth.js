const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
  });
}

exports.postLogin = (req, res) => {
  const { email, password } = { ...req.body };
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) {
                console.log(err);
              }
              return res.redirect('/');
            })
          }
          res.redirect('./login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('./login');
        })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
  });
}

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = { ...req.body };
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPass => {
          const newUser = new User({
            email,
            password: hashedPass,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect('/login');
        })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
}