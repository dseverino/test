const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Program {
    _id: ID!
    number: String!
    date: String!
    races: [Race!]    
  }

  type Race {
    _id: ID!
    programId: String
    event: String!
    distance: String!
    claimingPrice: [String!]!
    claimingType: [String!]!
    procedence: [String!]!
    horseAge: String!
    spec: String
    prize: String
  }

  type Horse {
    _id: ID!
    name: String!
    weight: String!
    age: String!
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
    age: String!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    stable: String!
  }

  input ProgramInput {
    number: String!
    date: String!
  }

  input RaceInput {
    programId: String
    event: String!
    distance: String!
    claimingPrice: [String!]!
    claimingType: [String!]!
    procedence: [String!]!
    horseAge: String!
    spec: String
    prize: String!
  }

  input UserInput {
    email: String
    password: String
  }

  type RootQuery {
    horses: [Horse!]!
    users: [User!]!
    programs: [Program!]!
    races: [Race!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createHorse(horseInput: HorseInput): Horse
    createUser(userInput: UserInput) : User
    createProgram(programInput: ProgramInput): Program!
    createRace(raceInput: RaceInput): Race!
    deleteRace(raceId: String): Race!
    addRace(programId: String, raceId: String): Program!
    addHorse(raceId: ID, horseId: ID): Race!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)