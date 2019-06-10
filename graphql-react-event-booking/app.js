const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if(req.method === "OPTIONS"){
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth);

app.use(bodyParser.json());

app.use("/graphql", 
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
)

const url = `mongodb://localhost:27017/${process.env.MONGO_DB}`;
//const url = `mongodb://dseverino:${process.env.MONGO_PASSWORD}@node-rest-shop-shard-00-00-cqreh.mongodb.net:27017,node-rest-shop-shard-00-01-cqreh.mongodb.net:27017,node-rest-shop-shard-00-02-cqreh.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true`
mongoose.Promise = global.Promise;
mongoose.connect(url, {useMongoClient: true})

app.listen(3000)