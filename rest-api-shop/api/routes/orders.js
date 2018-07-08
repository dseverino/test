const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order)

router.get('/:orderId', OrdersController.orders_get_order);

router.delete('/:orderId', OrdersController.orders_delete_order);

module.exports = router;