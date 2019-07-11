const Horse = require("../../models/horse")
const { transformHorse } = require("./merge");
//const User = require("../../models/user")

module.exports = {
  singleHorse: async (args) => {
    try {
      
      //Horse.remove().then()
      const horse = await Horse.findOne({ name: args.name });
      
      if(horse){        
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
      const horses = await Horse.find();
      return horses.map(horse => {
        return transformHorse(horse)
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
    const horse = await Horse.findOne({ name: args.horseInput.name })
    if (!horse) {
      const newHorse = new Horse(args.horseInput);
      try {
        const result = await newHorse.save()
        let createdHorse = transformHorse(result)
        return createdHorse;
      }
      catch (err) {
        console.log(err)
        throw err
      }
    }
    else {
      throw new Error("Horse already exists!")
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
  }
}