const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Booking {
    _id: ID!
    horse: Horse!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Horse {
    _id: ID!
    name: String!
    weight: String!
    birth: String!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    stable: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdHorses: [Horse!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input HorseInput {
    name: String!
    weight: String!
    birth: String!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    stable: String!
  }

  input UserInput {
    email: String
    password: String
  }

  type RootQuery {
    horses: [Horse!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createHorse(horseInput: HorseInput): Horse
    createUser(userInput: UserInput) : User
    bookHorse(horseId: ID!): Booking!
    cancelBooking(bookingId: ID!): Horse!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)