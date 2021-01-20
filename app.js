const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const auth = require('./routes/auth');
const { getNotFound } = require('./controllers/not-found');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('60080150b9e5c10d021220e3')
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
mongoose.connect('mongodb+srv://root:12345@cluster0.pyavk.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "m@m.com",
          cart: {
            items: []
          }
        })
        user.save();
      }
    })

    app.listen(3001, () => {
      console.log('Serer run on port 3001');
    });
  })
  .catch(err => {
    console.log(err);
  })