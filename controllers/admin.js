const mongodb = require('mongodb');
const product = require('../models/product');

const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false
  });
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = { ...req.body };
  const { user } = { ...req };
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  })

  product.save()
    .then(() => {
      res.redirect('/admin/products');
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

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        docTitle: "Edit product",
        path: "/admin/edit-product",
        editing: editMode,
        product
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = { ...req.body };
  Product.findById(productId)
    .then(product => {
      productId.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
      console.log('Product updated');
    })
    .catch(err => {
      console.log(err);
    })

}

exports.postDeleteProduct = (req, res) => {
  const { productId } = { ...req.body };
  Product.findByIdAndRemove(productId, { useFindAndModify: false })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        docTitle: "Shop",
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
}