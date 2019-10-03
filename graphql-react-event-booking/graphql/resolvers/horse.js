const Horse = require("../../models/horse");
const Stable = require("../../models/stable");
const { transformHorse } = require("./merge");
//const User = require("../../models/user")

module.exports = {
  singleHorse: async (args) => {
    try {      
      const horse = await Horse.findOne({ name: args.name }).collation({locale: "en", strength: 1});

      if (horse) {
        return transformHorse(horse);
      }
    }
    catch (err) {
      throw err
    }
  },

  horses: async () => {
    try {
      //Horse.remove().then()
      const horses = await Horse.find().sort({name: 1})
      return horses.map(horse => {
        return transformHorse(horse)
      })
    }
    catch (err) {
      throw err
    }
  },
  horse: async (args) => {   
    try {
      const name = new RegExp(".*" + args.name + ".*", "i");
      const horses = await Horse.find({name: { $regex: name }}).sort({name: 1});
      return horses.map(horse => {
        return transformHorse(horse);
      })
    }
    catch (err) {
      throw err
    }
  },

  createHorse: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/

    const newHorse = new Horse(args.horseInput);
    try {
      const result = await newHorse.save();
      let createdHorse = transformHorse(result);
      const stable = await Stable.findById(args.horseInput.stable, function (err, doc) {
        doc.horses = [...doc.horses, createdHorse._id]
        doc.save();
      })
      return createdHorse;
    }
    catch (err) {
      throw err;
    }
  },

  addRaceDetail: async (args) => {
    try {
      const horse = await Horse.findById(args.horseId)
      if (horse) {
        horse.raceDetails = [...horse.raceDetails, args.raceDetailId]
        const result = await horse.save()
        return transformHorse(result)
      }
    } catch (error) {
      throw error
    }
  },

  addHorseStable: async (args) => {
    try {

      const horse = await Horse.findOne({ _id: args.horseId });
      horse.stable = args.stableId;
      const horseUpdated = await horse.save();

      const stable = await Stable.findOne({ _id: args.stableId });
      stable.horses = stable.horses ? [...stable.horses, args.horseId] : [args.horseId];
      await stable.save();
      return transformHorse(horseUpdated)

    } catch (error) {
      throw error
    }
  },

  horsesWithoutStable: async () => {
    try {
      //Horse.remove().then()
      const horses = await Horse.find({ stable: { $exists: false } }).sort({name: 1});
      return horses.map(horse => {
        return transformHorse(horse)
      })
    }
    catch (err) {
      throw err
    }
  }
}