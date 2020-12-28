const path = require('path');

const express = require('express');

const rootDir = require('../helpers/path');
const { products } = require('./admin');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.render('shop', {
    prods: products,
    docTitle: "Shop",
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
