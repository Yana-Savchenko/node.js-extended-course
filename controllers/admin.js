const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false
  });
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = { ...req.body };
  const product = new Product(null, title, imageUrl, price, description);
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const { productId } = { ...req.params };

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      docTitle: "Edit product",
      path: "/admin/edit-product",
      editing: editMode,
      product
    });
  });
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = { ...req.body };
  const product = new Product(productId, title, imageUrl, price, description);
  product.save();
  res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = { ...req.body };
  Product.deleteById(productId);
  res.redirect('/admin/products');
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