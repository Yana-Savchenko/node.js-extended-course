const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: "Add product",
    path: "/admin/add-product",
  });
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = { ...req.body };
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect('/');
}

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      docTitle: "Shop",
      path: '/admin/products'
    });
  });
}