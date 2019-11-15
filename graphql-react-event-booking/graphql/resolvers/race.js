const Race = require("../../models/race");
const Program = require("../../models/program");
const { transformRace } = require("./merge")

const HorseRaceDetail = require("../../models/horseRaceDetail");

module.exports = {

  races: async (args, req) => {
    try {
      if (!req.loggedIn) {
        //throw new Error("User not authenticated!")
      }
      //Race.deleteMany().then()
      const races = await Race.find();

      return races.map(race => {
        return transformRace(race)
      })
    }
    catch (err) {
      throw err
    }
  },

  createRace: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const race = new Race(args.raceInput);
    try {
      const result = await race.save();
      if (result && result.programId) {
        const program = await Program.findOne({ number: result.programId })
        program.races = [...program.races, result._id]
        try {
          const res = await program.save();
        } catch (error) {
          throw error
        }
      }
      return transformRace(result)
    }
    catch (err) {
      throw err
    }
  },
  completeRace: async (args) => {
    try {
      const race = await Race.findById(args.raceId)

      if (race) {
        race.completed = true
        await race.save();
        return transformRace(race);
      }
    }
    catch (err) {
      throw err
    }
  },

  deleteRace: async (args) => {
    const result = await Race.findByIdAndRemove(args.raceId)
    return transformRace(result)
  },

  addHorse: async (args) => {
    //(raceId: ID, horseId: ID): Race!
    try {
      const race = await Race.findById(args.raceId)
      if (race) {
        race.horses = [...race.horses, args.horseId]
        await race.save();
        return transformRace(race);
      }
    }
    catch (err) {
      throw err
    }
  },

  updateRaceDetails: async (args) => {
    try {
      const race = await Race.update({ _id: args.raceId }, args.raceDetails)
      
      if (race && race.ok) {
        if (args.retiredHorses.length) {
          await HorseRaceDetail.updateMany({ _id: { $in: args.retiredHorses } }, { $set: { retired: true } })
        }
        return args.raceDetails;
      }
    }
    catch (err) {
      throw err
    }
  }

}
