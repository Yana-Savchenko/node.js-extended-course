const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
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
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
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
    .then(products => {
      res.render('shop/index', {
        prods: products,
        docTitle: "Shop",
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your cart',
        products: products
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

  req.user.deleteItemFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your orders',
        orders
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postOrder = (req, res) => {
  let fetchedCart = null;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }))
        })
        .then(() => {
          return fetchedCart.setProducts(null);
        })
        .then(() => {
          res.redirect('/orders');
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err))
}
