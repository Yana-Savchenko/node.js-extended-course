const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const auth = require('./routes/auth');
const { getNotFound } = require('./controllers/not-found');
const User = require('./models/user');

MONGODB_URI = 'mongodb+srv://root:12345@cluster0.pyavk.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
})

// routes
app.use(shop);
app.use(auth);
app.use('/admin', admin);
app.use(getNotFound);


//start the server
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3001, () => {
      console.log('Serer run on port 3001');
    });
  })
  .catch(err => {
    console.log(err);
  })