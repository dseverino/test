const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();

app.use(bodyParser.json());

app.use("/graphql", 
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {        
        return events
      },
      createEvent: args => {        
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date)
        })
        return event
        .save()
        .then(result => {
          return result._doc
        })
        .catch(error=>{
          console.log(error)
        })        
      }
    },
    graphiql: true
  })
)

mongoose.connect(
  `mongodb+srv://dseverino:${process.env.MONGO_PASSWORD}
  @node-rest-shop-cqreh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
  .then(()=>{
    app.listen(3000);
  })
  .catch(()=>{
    console.log("Error")
  })

