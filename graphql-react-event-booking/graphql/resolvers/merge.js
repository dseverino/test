const DataLoader = require("dataloader");

const Horse = require("../../models/horse");
const HorseRaceDetail = require("../../models/horseRaceDetail")
const User = require("../../models/user");
const Race = require("../../models/race");
const Jockey = require("../../models/jockey");
const Stable = require("../../models/stable");
const Trainer = require("../../models/trainer");

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

const jockeyLoader = new DataLoader(jockeyIds => {
  return jockeys(jockeyIds);
})
const stableLoader = new DataLoader(stableIds => {
  return stables(stableIds);
})
const trainerLoader = new DataLoader(trainerIds => {
  return trainers(trainerIds);
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
    const jockey = await jockeyLoader.load(jockeyId);
    return transformJockey(jockey)
  } catch (error) {
    throw error
  }
}
const jockeys = async jockeyIds => {
  try {
    const results = await Jockey.find({ _id: { $in: jockeyIds } });
    return jockeyIds.map((jockeyId) => results.find((jockey) => jockey._id.toString() === jockeyId.toString()));
  }
  catch (error) {
    throw error
  }
}

const stables = async stableIds => {
  try {
    /*const m = { $match: { "_id": { $in: stableIds } } };
    const a = { $addFields: { "__order": { $indexOfArray: [stableIds, "$_id"] } } };
    const s = { $sort: { "__order": 1 } };
    const stables = await Stable.aggregate([m, a, s]);
    

    let updatedStables = [];
    if (stableIds.length > stables.length) {
      for (var i = 0; i < stableIds.length; i++) {
        updatedStables.push(stableIds[i].toString());
        if (!stables[i]) {
          stables.splice(i, 0, stables[updatedStables.indexOf(updatedStables[i])])
        }
        else if (stableIds[i].toString() != stables[i]._id.toString()) {
          stables.splice(i, 0, stables[updatedStables.indexOf(updatedStables[i])])
        }
      }
    }
    */
    const results = await Stable.find({ _id: { $in: stableIds } });
    const filtered = stableIds.map((stableId) => results.find((stable) => stable._id.toString() === stableId.toString() ));
    return filtered.map(stable => {
      return transformStable(stable);
    })
  } catch (error) {
    throw error
  }
}
const trainers = async trainerIds => {
  try {
    /*
    const m = { $match: { "_id": { $in: trainerIds } } };
    const a = { $addFields: { "__order": { $indexOfArray: [trainerIds, "$_id"] } } };
    const s = { $sort: { "__order": 1 } };
    const trainers = await Trainer.aggregate([m, a, s]);
    //const trainers = await Trainer.find({ _id: { $in: trainerIds } })
    let updatedTrainers = [];
    if (trainerIds.length > trainers.length) {
      for (var i = 0; i < trainerIds.length; i++) {
        updatedTrainers.push(trainerIds[i].toString());
        if (!trainers[i]) {
          trainers.splice(i, 0, trainers[updatedTrainers.indexOf(updatedTrainers[i])])
        }
        else if (trainerIds[i].toString() != trainers[i]._id.toString()) {
          trainers.splice(i, 0, trainers[updatedTrainers.indexOf(updatedTrainers[i])])
        }
      }
    }*/
    const results = await Trainer.find({ _id: { $in: trainerIds } });
    const filtered = trainerIds.map((trainerId) => results.find((trainer) => trainer._id.toString() === trainerId.toString() ));
    return filtered.map(trainer => {
      return transformTrainer(trainer)
    })
  }
  catch (err) {
    throw err
  }
}
const trainer = async trainerId => {
  try {
    const trainer = await trainerLoader.load(trainerId)
    return transformTrainer(trainer)
  } catch (error) {
    throw error
  }
}
const stable = async stableId => {
  try {
    const stable = await stableLoader.load(stableId)
    return transformStable(stable)
  } catch (error) {
    throw error
  }
}

const singleHorse = async horseId => {
  try {
    const horse = await horseLoader.load(horseId.toString());
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
    const results = await HorseRaceDetail.find({ _id: { $in: raceDetailIds } });
    return raceDetailIds.map((raceDetailId) => results.find((raceDetail) => raceDetail._id.toString() === raceDetailId.toString())).map(raceDetail => {
      return transformRaceDetail(raceDetail);
    })
  } catch (error) {
    throw error
  }
}

const horses = async horseIds => {
  try {
    const m = { $match: { "_id": { $in: horseIds } } };
    const a = { $addFields: { "__order": { $indexOfArray: [horseIds, "$_id"] } } };
    const s = { $sort: { "__order": 1 } };
    const horses = await Horse.aggregate([m, a, s])//await Horse.find({ _id: { $in: horseIds } });

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

const transformHorse = async horse => {
  return {
    ...horse,
    _id: horse._id.toString(),
    name: horse.name,
    weight: horse.weight,
    age: horse.age,
    color: horse.color,
    sex: horse.sex,
    sire: horse.sire,
    dam: horse.dam,
    procedence: horse.procedence,
    stable: () => stableLoader.load(horse.stable),
    raceDetails: async () => {
      var ar = await raceDetailLoader.loadMany(horse.raceDetails)
      console.log(ar);
      return ar
    } 
  }
}

const transformRaceDetail = raceDetail => {
  return {
    ...raceDetail,
    _id: raceDetail.id,
    jockey: () => jockey(raceDetail.jockey),
    jockeyWeight: raceDetail.jockeyWeight,
    trainer: () => trainer(raceDetail.trainer),
    stable: () => stable(raceDetail.stable),
    startingPosition: raceDetail.startingPosition,
    positions: raceDetail.positions,
    lengths: raceDetail.lengths,
    times: raceDetail.times,
    trainingTimes: raceDetail.trainingTimes,
    horseWeight: raceDetail.horseWeight,
    claimed: raceDetail.claimed,
    claiming: raceDetail.claiming,
    claimedBy: raceDetail.claimedBy,
    trackCondition: raceDetail.trackCondition,
    date: raceDetail.date.toISOString(),
    raceNumber: raceDetail.raceNumber,
    horseMedications: raceDetail.horseMedications.sort((a, b) => (a < b) ? 1 : ((b < a) ? -1 : 0)),
    retired: raceDetail.retired,
    retiredDetails: raceDetail.retiredDetails,
    comments: raceDetail.comments,
    bet: raceDetail.bet,
    horseEquipments: raceDetail.horseEquipments.sort(),
    totalHorses: raceDetail.totalHorses,
    discarded: raceDetail.discarded,
    horseAge: raceDetail.horseAge,
    distance: raceDetail.distance
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
    date: race.date,
    distance: race.distance,
    claimings: race.claimings,
    claimingType: race.claimingType,
    procedences: race.procedences,
    spec: race.spec,
    horseAge: race.horseAge,
    programId: race.programId,
    purse: race.purse,
    completed: race.completed,
    horses: horseLoader.loadMany(race.horses)
  }
}

const transformJockey = jockey => {
  return {
    ...jockey,
    _id: jockey.id,
    name: jockey.name
  }
}
const transformTrainer = trainer => {
  return {
    ...trainer,
    _id: trainer._id.toString(),
    name: trainer.name
  }
}
const transformStable = stable => {
  return {
    _id: stable._id.toString(),
    name: stable.name,
    trainers: () => trainerLoader.loadMany(stable.trainers),
    horses: () => horseLoader.loadMany(stable.horses)
  }
}

exports.transformProgram = transformProgram
exports.transformHorse = transformHorse
exports.transformUser = transformUser
exports.transformRace = transformRace
exports.transformJockey = transformJockey
exports.transformRaceDetail = transformRaceDetail
exports.transformStable = transformStable
exports.transformTrainer = transformTrainer