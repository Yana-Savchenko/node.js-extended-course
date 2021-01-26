const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../helpers/email-helper');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: message,
  });
}

exports.postLogin = (req, res) => {
  const { email, password } = { ...req.body };
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email!');
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
          req.flash('error', 'Incorect password!');
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
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    errorMessage: message,
  });
}

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = { ...req.body };
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email already exists!');
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
        .then(user => {
          const data = {
            subject: 'Welcome',
            body: '<h1>Your account successfully created!</h1>',
          }
          res.redirect('/login');
          return sendEmail(user.email, data)
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

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset password',
    errorMessage: message,
  });
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with such email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        const data = {
          subject: 'Password reset',
          body: `
          <p>You requested a password reset.</p>
          <p>Click this <a href="http://localhost:3001/reset/${token}">link</a> to set a new password.</p>
        `
        }
        sendEmail(req.body.email, data)
      })
      .catch(err => {
        console.log(err);
      })
  });
}

exports.getNewPassword = (req, res) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        docTitle: 'New password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postNewPassword = (req, res) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser = null;

  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(password, 12)
    })
    .then(hashedPass => {
      resetUser.password = hashedPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    })
}