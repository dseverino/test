const Order = require('../models/order');
const Product = require('../models/product');
//const mongoose = require('mongoose');

exports.orders_get_all = (req, resp, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', "name")
        .exec()
        .then(result => {
            resp.status(200).json({
                count: result.length,
                orders: result.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            resp.status(500).json({error: err})
        })
}

exports.orders_create_order = (req, resp, next) => {    
    Product.findById(req.body.productId)
        //.exec()
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
                                url: "http://localhost:3000/orders/" + result._id
                            }
                        }

                    })
                })
        })
        .catch(err => {
            resp.status(404).json({
                error: err,
                message: "error message catched"
            })
      })
}