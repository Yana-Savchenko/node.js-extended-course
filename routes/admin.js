const path = require('path');

const express = require('express');

const rootDir = require('../helpers/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    docTitle: "Add product",
    activeProduct: true,
    formCSS: true,
    productCSS: true,
  });
});

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.product });
  res.redirect('/');
})

exports.routes = router;
exports.products = products;