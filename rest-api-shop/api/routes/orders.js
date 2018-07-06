const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

const checkAuth = require('../middleware/check-auth');
const ordersController = require('../controllers/orders');

router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', (req, resp, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(prod => {
            if (!prod) {
                return resp.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body["productId"],
                quantity: req.body.quantity
            });

            return order
                .save()
                .then(result => {
                    resp.status(201).json({
                        message: "Order stored",
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity,
                            request: {
                                type: "POST",
                                url: "http://localhost:3000/api/orders/" + result._id
                            }
                        }

                    })
                })
        })
        .catch(err => {
            resp.status(404).json({
                error: err
            })
      })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/orders/' + doc._id
                    }
                })
            }
            else {
                res.status(404).json({message: 'Order not found'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {productId: "ID", quantity: "NUMBER"}
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;