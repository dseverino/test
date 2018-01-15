const express = require('express');
const route = express.Router();
const Car = require('../models/car');

const mongoose = require('mongoose');

route.get('', (req, res, next) => {
    Car.find()
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

module.exports = route;