const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const Goal = require('../models/goal');

route.get('', (req, res, next) => {
    Goal.find()
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
        });
});

route.post('/', (req, res, next) => {   
    const goal = new Goal({
        _id: new mongoose.Types.ObjectId(),
        goal: req.body.goal
    });

    goal
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /goals',
                goal: result
            })
        })
        .catch(err => {            
            console.log(err)
            res.status(500).json({
                error: err,
                message: 'something is wrong here hehe!!!'
            })
        })
})

route.delete('/:goalId', (req, res, next) => {
    const id = req.params.goalId;
    Goal.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = route;