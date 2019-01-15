const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user")
const bcrypt = require("bcrypt")

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
        creator: String
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event]!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String
        password: String
      }

      type RootQuery {
        events: [Event!]!
        users: [User!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput) : User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {        
        return Event
          .find()
          .then(events => {
            return events.map(event => {              
              return { ...event._doc, _id: event.id}
            })
          })
          .catch(err => {
            throw err
          })
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5c3e565a0e18592bc839f0bb"
        })
        let createdEvent
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result.id }
            return User.findById("5c3e565a0e18592bc839f0bb")         
          })
          .then(user => {
            if(!user){
              throw new Error("User does not exists")
            }
            user.createEvents.push(event)
            return user.save();
          })
          .then(result => {
            return createdEvent
          })
          .catch(err=>{
            console.log(err)
            throw err
          })        
      },
      users: () => {        
        return User
          .find()
          .then(users => {
            return users.map(user => {
              return { ...user._doc, password: null, _id: user.id}
            })
          })
          .catch(err => {
            throw err
          })
      },
      createUser: args => {
        return User.findOne({email: args.userInput.email})
          .then(user => {
            if(!user){
              return bcrypt
                .hash(args.userInput.password, 12)
                .then(hashedPassword => {
                  const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                  })
                  return user
                    .save()
                    .then(result => {                
                      return { ...result._doc, password: null,  _id: result.id }
                    })
                    .catch(err => {
                      throw err
                    })
                })
                .catch(err => {
                  throw err
                })
            }
            else {
              throw new Error("User already exists!")
            }
          })
          .catch(err => {
            throw err
          })
      }
    },
    graphiql: true
  })
)

const url = `mongodb://localhost:27017/${process.env.MONGO_DB}`;

mongoose.connect(url, {useMongoClient: true})

mongoose.Promise = global.Promise;

app.listen(3000)

