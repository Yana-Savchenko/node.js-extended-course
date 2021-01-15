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
  const product = { title, imageUrl, price, description };
  req.user.createProduct(product)
    .then(result => {
      console.log(result);
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

  req.user.getProducts({ where: { id: productId } })
    .then(products => {
      const product = products[0];
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
  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
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
  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  req.user.getProducts()
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