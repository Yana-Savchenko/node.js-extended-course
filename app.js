const path = require('path');

const express = require('express');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const { getNotFound } = require('./controllers/not-found');
const db = require('./helpers/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
})
app.use('/admin', admin);
app.use('/', shop);

app.use(getNotFound);

//Associations
Product.belongsTo(User, {
  constraintst: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//start the server
db.sync()
  .then(result => {
    User.findByPk(1)
      .then(user => {
        if (!user) {
          return User.create({
            name: "Max",
            email: "m@m.com"
          })
        }
        return user;
      })
      .then(user => {
        return user.createCart();
      })
      .then(cart => {
        app.listen(3001);
      })
      .catch(err => {
        console.log(err);
      })
  })
  .catch(err => {
    console.log(err);
  })
