const path = require('path');

const express = require('express');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const { getNotFound } = require('./controllers/not-found');
const db = require('./helpers/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin);
app.use('/', shop);

app.use(getNotFound);

Product.belongsTo(User, {
  constraintst: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);

db.sync()
  .then(result => {
    app.listen(3001);
  })
  .catch(err => {
    console.log(err);
  })
