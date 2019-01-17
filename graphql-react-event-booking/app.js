const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index")
const graphQlResolvers = require("./graphql/resolvers/index")

const app = express();

app.use(bodyParser.json());

app.use("/graphql", 
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
)

const url = `mongodb://localhost:27017/${process.env.MONGO_DB}`;

mongoose.connect(url, {useMongoClient: true})

mongoose.Promise = global.Promise;

app.listen(3000)

