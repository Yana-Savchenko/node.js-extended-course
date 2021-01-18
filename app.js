const path = require('path');

const express = require('express');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const { getNotFound } = require('./controllers/not-found');
const { mongoConnect } = require('./helpers/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('60057580e31c9863edff9a18')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => {
      console.log(err);
    })
})

// routes
app.use('/admin', admin);
app.use('/', shop);
app.use(getNotFound);


//start the server
mongoConnect(() => {
  app.listen(3001);
})