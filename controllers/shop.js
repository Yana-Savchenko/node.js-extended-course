const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      docTitle: "Products",
      path: '/products'
    });
  });
}

exports.getProduct = (req, res) => {
  const { id } = { ...req.params };
  const cb = product => {
    res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/shop/product-detail'
    })
  }
  Product.findById(id, cb);
}

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      docTitle: "Shop",
      path: '/'
    });
  });
}

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    path: '/cart',
    docTitle: 'Your cart'
  });
}

exports.postCart = (req, res) => {
  const { productId } = { ...req.body };
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  })
  res.redirect('/cart');
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    docTitle: 'Your orders'
  });
}

exports.getCheckout = () => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout'
  });
}