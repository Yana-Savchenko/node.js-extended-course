const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        docTitle: "Products",
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getProduct = (req, res) => {
  const { id } = { ...req.params };

  Product.findById(id)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        docTitle: product.title,
        path: '/shop/product-detail'
      })
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        docTitle: "Shop",
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll()(products => {
      const cartProducts = [];

      for (product of products) {
        const cartProduct = cart.products.find(prod => prod.id === product.id);
        if (cartProduct) {
          cartProducts.push({ product, qty: cartProduct.qty });
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your cart',
        products: cartProducts
      });
    })
  })
}

exports.postCart = (req, res) => {
  const { productId } = { ...req.body };
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  })
  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = { ...req.body };
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  })
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