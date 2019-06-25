const Horse = require("../../models/horse")
const { transformHorse } = require("./merge");
//const User = require("../../models/user")

module.exports = {

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
    const horse = new Horse(args.horseInput/*{
      name: args.horseInput.name,
      weight: args.horseInput.weight,
      age: args.horseInput.age,
      color: args.horseInput.color,
      sex: args.horseInput.sex,
      sire: args.horseInput.sire,
      dam: args.horseInput.dam
    }*/)

    try {
      const result = await horse.save()
      let createdHorse = transformHorse(result)
      return createdHorse
    }
    catch (err) {
      console.log(err)
      throw err
    }
  },

  addRaceDetail: async (args) => {
    try {
      const horse = await Horse.findById(args.horseId)      
      if(horse){
        horse.raceDetails = [...horse.raceDetails, args.raceDetailId]
        const result = await horse.save()
        return transformHorse(result)
      }
    } catch (error) {
      throw error
    }
  }
}