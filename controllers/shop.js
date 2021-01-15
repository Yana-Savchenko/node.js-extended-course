const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.findAll()
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

  Product.findByPk(id)
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
  Product.findAll()
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
    .then(cart => {
      return cart.getProducts();
    })
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
  let fetchedCart = null;
  let newQty = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product = null;
      if (products.length) {
        product = products[0];
      }

      if (product) {
        newQty = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQty } });
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

  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
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
