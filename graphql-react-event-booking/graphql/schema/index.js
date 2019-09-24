const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Program {
    _id: ID!
    number: Int!
    date: String!
    races: [Race!]
  }

  type Race {
    _id: ID!
    programId: String
    event: Int!
    date: String!
    distance: Int!
    claimings: [String!]!
    procedences: [String!]!
    horseAge: String!
    spec: String
    purse: String
    horses: [Horse]
  }
  input RaceInput {
    programId: Int
    event: Int!
    date: String!
    distance: Int!
    claimings: [String!]!
    procedences: [String!]!
    horseAge: String!
    spec: String
    purse: Int!
  }

  type Horse {
    _id: ID!
    name: String!
    weight: Int
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    raceDetails: [HorseRaceDetail]
    stable: Stable
  }

  type HorseRaceDetail {
    _id: ID!    
    startingPosition: Int    
    claiming: String
    horseMedications: [String] 
    horseEquipments: [String]    
    jockey: Jockey
    jockeyWeight: Int 
    stable: Stable
    trainer: Trainer
    date: String
    raceNumber: Int
    trackCondition: String
    distance: Int
    times: Time
    positions: Position
    lengths: Length
    bet: String    
    trainingTimes: [TrainingTime] 
    horseWeight: Int 
    claimed: Boolean
    claimedBy: Stable
    retired: Boolean
    retiredDetails: String
    totalHorses: Int
    horseAge: Int
    comments: String
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
    _id: ID
    name: String
    horses: [Horse]
    trainers: [Trainer]
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
    weight: Int
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    stable: ID
  }

  input HorseRaceDetailInput {   
    date: String 
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
    claimedBy: ID
    claiming: String
    trackCondition: String
    raceNumber: Int
    retired: Boolean 
    retiredDetails: String 
    bet: String 
    horseEquipments: [String] 
    horseMedications: [String]
    totalHorses: Int 
    horseAge: Int
    distance: Int
    comments: String
  }

  input ProgramInput {
    number: Int!
    date: String!
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
    horse(name: String): [Horse]
    horsesWithoutStable: [Horse]!    
    singleProgram(date: String): Program
    singleHorse(name: String!): Horse
    singleJockey(name: String!): Jockey
    singleStable(name: String!): Stable
    singleTrainer(name: String!): Trainer
    users: [User!]!
    programs: [Program!]!
    races: [Race!]!
    login(email: String!, password: String!): AuthData!    
    jockeys: [Jockey!]!
    stables: [Stable!]!
    stablesWithoutTrainer: [Stable]
    trainers: [Trainer!]!
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
    addHorseStable(horseId: ID, stableId: ID): Horse
    addTrainerStable(stableId: ID, trainerId: ID): Stable
    createHorseRaceDetail(horseRaceDetail: HorseRaceDetailInput, horseId: ID): HorseRaceDetail
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