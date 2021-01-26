const express = require('express');

const {
  getLogin, postLogin, postLogout, getSignup, postSignup, getReset, postReset, getNewPassword, postNewPassword
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset/:token', getNewPassword);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.post('/new-password', postNewPassword);


module.exports = router;
