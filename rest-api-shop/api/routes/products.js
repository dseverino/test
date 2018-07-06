const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const fileFilter = (req, file, cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  }, 
  fileFilter: fileFilter
});

const checkAuth = require('../middleware/check-auth');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        })
      }
      else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: 'http://localhost:3000/products/' + result._id
          }
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

router.delete('/:productId', (req, res, next) => {
  
  Product.remove({ _id: req.params.productId })
    .exec()
    .then(result => {
      res.status(200).json({
        code: '000',
        text: 'Success',
        result: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.delete('/', (req, res, next) => {  
  Product.remove()
    .exec()
    .then(result => {
      res.status(200).json({
        code: '000',
        text: 'Success',
        result: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateObj = {}
  for (const ops of req.body) {
    updateObj[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateObj })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'POST'
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router;