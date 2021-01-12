const path = require('path');

const express = require('express');

const { getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart, postCartDeleteProduct } = require('../controllers/shop');

const router = express.Router();

// home
router.get('/', getIndex);

// products
router.get('/products', getProducts);

router.get('/products/:id', getProduct);

// cart
router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

// orders
router.get('/orders', getOrders);

// checkout
router.get('/checkout', getCheckout);

module.exports = router;
