const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');
const carRoute = require('./api/routes/cars');
const goalRoute = require('./api/routes/goals');
const userRoute = require('./api/routes/users');

const url = "mongodb://localhost:27017/mydb";
/*const url = "mongodb://dseverino:Technology01@" +
    "node-rest-shop-shard-00-00-cqreh.mongodb.net:27017,"+
    "node-rest-shop-shard-00-01-cqreh.mongodb.net:27017,"+
    "node-rest-shop-shard-00-02-cqreh.mongodb.net:27017/"+
    "test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin";
*/

mongoose.connect(url, {useMongoClient: true});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    0
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }

  next();
});

app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/cars', carRoute);
app.use('/goals', goalRoute);
app.use('/users', userRoute);

app.use((req, resp, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;