const express = require('express');

const { getProducts, getIndex, getCart, getOrders, getProduct, postCart, postCartDeleteProduct, postOrder } = require('../controllers/shop');

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
router.post('/create-order', postOrder);

router.get('/orders', getOrders);


module.exports = router;
