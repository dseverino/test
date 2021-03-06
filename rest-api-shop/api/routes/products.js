const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

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


router.get('/', ProductsController.products_get_all);

router.get('/:productId', ProductsController.products_get_product);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.delete('/:productId', ProductsController.products_delete_product);

router.delete('/', ProductsController.products_delete_all);

router.patch('/:productId', ProductsController.products_update_product)

module.exports = router;