const express = require('express');

const router = express.Router();
const Order = require('../models/order');

const mongoose = require('mongoose');


router.get('', (req, resp, next) => {
    Order.find()
      .exec()
      .then(result => {
        console.log(result)
      })
});

router.post('', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),        
        product: req.body.productId,
        quantity: req.body.quantity
    });

    order
      .save()
      .then(res => {
        console.log('saved')
      })
})

module.exports = router;