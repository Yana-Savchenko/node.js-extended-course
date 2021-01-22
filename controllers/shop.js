const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        docTitle: "Products",
        path: '/products',
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getProduct = (req, res) => {
  const { id } = { ...req.params };

  Product.findById(id)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        docTitle: product.title,
        path: '/shop/product-detail',
        isAuth: req.session.isLoggedIn,
      })
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        docTitle: "Shop",
        path: '/',
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your cart',
        products: user.cart.items,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res) => {
  const { productId } = { ...req.body };

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = { ...req.body };

  req.user.removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your orders',
        orders,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        const product = { ...item.productId._doc };
        return { quantity: item.quantity, product }
      });
      const order = new Order({
        user: {
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}
