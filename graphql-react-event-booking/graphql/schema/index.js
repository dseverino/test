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
    horseAge: Int!
    spec: String
    purse: String
    horses: [Horse]
  }

  type Horse {
    _id: ID!
    name: String!
    weight: String
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    raceDetails: [HorseRaceDetail]
  }

  type HorseRaceDetail {
    _id: ID!    
    jockey: Jockey
    jockeyWeight: Int 
    trainer: Trainer
    stable: Stable
    startingPosition: Int 
    positions: Position
    lengths: Length 
    times: Time 
    trainingTimes: [TrainingTime] 
    horseWeight: Int 
    claimed: Boolean
    claimingPrice: Int
    retired: Boolean 
    retiredDetails: String 
    bet: String 
    horseTools: [String] 
    totalHorses: Int
    horseAge: Int
  }

  type Position {
    start: String 
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }

  type Length {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  type Time {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  type TrainingTime {
    date: String
    time: String
    jockey: String 
    effort: String
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
  type Jockey {
    _id: ID!
    name: String!
  }
  type Stable {
    _id: ID!
    name: String!
  }
  type Trainer {
    _id: ID!
    name: String!
  }

  input PositionInput {
    start: String 
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  input LengthInput {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  input TimeInput {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  input TrainingTimeInput {
    date: String
    time: String
    jockey: String 
    effort: String
  }

  input HorseInput {
    name: String!
    weight: String
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
  }

  input HorseRaceDetailInput {    
    jockey: ID 
    jockeyWeight: Int 
    trainer: ID
    stable: ID 
    startingPosition: Int 
    positions: PositionInput 
    lengths: LengthInput
    times: TimeInput
    trainingTimes: [TrainingTimeInput] 
    horseWeight: Int 
    claimed: Boolean 
    claimingPrice: Int
    retired: Boolean 
    retiredDetails: String 
    bet: String 
    horseTools: [String] 
    totalHorses: Int 
    horseAge: Int
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
    horseAge: Int!
    spec: String
    purse: String!
  }

  input UserInput {
    email: String
    password: String
  }
  input JockeyInput {
    name: String!
  }
  input TrainerInput {
    name: String!
  }
  input StableInput {
    name: String!
  }

  type RootQuery {
    horses: [Horse!]!
    singleHorse(name: String!): Horse
    users: [User!]!
    programs: [Program!]!
    races: [Race!]!
    login(email: String!, password: String!): AuthData!
    singleProgram(programId: String): Program
    jockeys: [Jockey!]!
    horseRaceDetails: [HorseRaceDetail]
  }

  type RootMutation {
    createHorse(horseInput: HorseInput): Horse
    createUser(userInput: UserInput) : User
    createProgram(programInput: ProgramInput): Program!
    createRace(raceInput: RaceInput): Race!
    deleteRace(raceId: String): Race!
    addRace(programId: String, raceId: String): Program!
    addHorse(raceId: ID, horseId: ID): Race!
    createHorseRaceDetail(horseRaceDetail: HorseRaceDetailInput): Horse
    createJockey(jockeyInput: JockeyInput): Jockey
    addRaceDetail(raceDetailId: ID, horseId: ID): Horse
    createTrainer(trainerInput: TrainerInput): Trainer
    createStable(stableInput: StableInput): Stable
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)