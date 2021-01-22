const express = require('express');

const { getProducts, getIndex, getCart, getOrders, getProduct, postCart, postCartDeleteProduct, postOrder } = require('../controllers/shop');
const isAuth = require('../middleware/auth');

const router = express.Router();

// home
router.get('/', getIndex);

// products
router.get('/products', getProducts);

router.get('/products/:id', getProduct);

// cart
router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

// orders
router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);


module.exports = router;
