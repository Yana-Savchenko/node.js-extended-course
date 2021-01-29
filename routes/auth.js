const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user');
const {
  getLogin, postLogin, postLogout, getSignup, postSignup, getReset, postReset, getNewPassword, postNewPassword
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.'),
  body('password', 'Please enter a password at least 5 characters')
    .isLength({ min: 5 })
    .isAlphanumeric(),
],
  postLogin);

router.get('/signup', getSignup);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('Email already exists!');
            }
          })
      }),
    body('password', 'Please enter a password at least 5 characters')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  postSignup
);

router.post('/logout', postLogout);

router.get('/reset/:token', getNewPassword);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.post('/new-password', postNewPassword);


module.exports = router;
