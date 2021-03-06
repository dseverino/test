const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length) {
        return res.status(422).json({
          message: 'Mail exists'
        })
      }
      else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({
              error: err
            })
          }
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId,
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User Created'
                })
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });
}

exports.users_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed'
            })
          }
          if (result) {
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0]._id
              }, 
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            )
            return res.status(200).json({
              message: 'Auth successful',
              token: token
            })
          }
          else {
            return res.status(401).json({
              message: 'Auth failed'
            })
          }
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.users_get_users = (req, res, next) => {
  User.find()
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        users: result.map(user => {
          return {
            email: user.email,
            password: user.password,
            _id: user._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/users/' + user._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
}

exports.users_get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          user: result,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/users/' + result._id
          }
        })
      }
      else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    })
}