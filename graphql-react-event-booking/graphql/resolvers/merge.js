const DataLoader = require("dataloader");

const Horse = require("../../models/horse");
const HorseRaceDetail = require("../../models/horseRaceDetail")
const User = require("../../models/user");
const Race = require("../../models/race");
const Jockey = require("../../models/jockey");

const horseLoader = new DataLoader(horseIds => {
  return horses(horseIds)
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } })
})

const racesLoader = new DataLoader(raceIds => {
  return races(raceIds)
});

const raceDetailLoader = new DataLoader(raceDetailIds => {  
  return raceDetails(raceDetailIds)
})

const jockeyLoader = new DataLoader(jockeyId => {  
  return Jockey.find({_id: {$in: jockeyId}})
})

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
    }
  }
  catch (err) {
    throw err
  }
}

const jockey = async jockeyId => {
  try {
    const jockey = await jockeyLoader.load(jockeyId.toString())    
    return transformJockey(jockey)
  } catch (error) {
    throw error
  }
}

const singleHorse = async horseId => {
  try {
    const horse = await horseLoader.load(horseId.toString())
    return horse
  }
  catch (err) {
    throw err
  }
}

const races = async raceIds => {
  try {
    const races = await Race.find({ _id: { $in: raceIds } })
    races.sort((a, b) => {
      return (
        raceIds.indexOf(a.event.toString()) - raceIds.indexOf(b.event.toString())
      );
    });
    return races.map(race => {
      return transformRace(race)
    })
  }
  catch (err) {
    throw err
  }
}

const raceDetails = async raceDetailIds => {
  
  try {
    const raceDetails = await HorseRaceDetail.find({ _id: { $in: raceDetailIds } })    
    return raceDetails.map(raceDetail => {
      return transformRaceDetail(raceDetail)
    })
  } catch (error) {
    throw error
  }
}

const horses = async horseIds => {
  try {
    const horses = await Horse.find({ _id: { $in: horseIds } })
    horses.sort((a, b) => {
      return (
        horseIds.indexOf(a._id.toString()) - horseIds.indexOf(b._id.toString())
      );
    });
    return horses.map(horse => {
      return transformHorse(horse)
    })
  }
  catch (err) {
    throw err
  }
}

const transformUser = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
  }
}

const transformHorse = horse => {
  return {
    ...horse._doc,
    _id: horse.id,
    name: horse.name,
    weight: horse.weight,
    age: horse.age,
    color: horse.color,
    sex: horse.sex,
    sire: horse.sire,
    dam: horse.dam,
    raceDetails: () => raceDetailLoader.loadMany(horse.raceDetails)
  }
}

const transformRaceDetail = raceDetail => {    
  return {
    ...raceDetail,
    _id: raceDetail.id,
    raceId: raceDetail.raceId.toString(),
    HorseId: raceDetail.HorseId.toString(), 
    jockey: () => jockey(raceDetail.jockeyId),
    jockeyWeight: raceDetail.jockeyWeight,
    trainerId: raceDetail.trainerId,
    stableId: raceDetail.stableId,
    startingPosition: raceDetail.startingPosition,
    positions: raceDetail.positions,
    lengths: raceDetail.lengths,
    times: raceDetail.times,
    trainingTimes: raceDetail.trainingTimes,
    horseWeight: raceDetail.horseWeight,
    claimed: raceDetail.claimed,
    retired: raceDetail.retired,
    retiredDetails: raceDetail.retiredDetails,
    bet: raceDetail.bet,
    horseTools: raceDetail.horseTools,
    totalHorses: raceDetail.totalHorses,
  }
}

const transformProgram = program => {
  return {
    ...program,
    _id: program.id,
    number: program.number,
    date: program.date,
    races: () => racesLoader.loadMany(program.races)
  }
}

const transformRace = race => {
  return {
    ...race,
    _id: race.id,
    event: race.event,
    distance: race.distance,
    claimingPrice: race.claimingPrice,
    claimingType: race.claimingType,
    procedence: race.procedence,
    spec: race.spec,
    horseAge: race.horseAge,
    programId: race.programId,
    purse: race.purse,
    horses: () => horseLoader.loadMany(race.horses)
  }
}

const transformJockey = jockey => {
  return {
    ...jockey,
    _id: jockey.id,
    name: jockey.name
  }
}

exports.transformProgram = transformProgram
exports.transformHorse = transformHorse
exports.transformUser = transformUser
exports.transformRace = transformRace
exports.transformJockey = transformJockey
exports.transformRaceDetail = transformRaceDetail