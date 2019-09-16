const HorseRaceDetail = require("../../models/horseRaceDetail");
const Horse = require("../../models/horse");
const { transformRaceDetail } = require("../resolvers/merge")

module.exports = {

  createHorseRaceDetail: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const horseRaceDetail = new HorseRaceDetail(args.horseRaceDetail)
    try {
      const raceDetail = await horseRaceDetail.save();
      if (raceDetail) {
        const horse = await Horse.findById(args.horseId)
        if (horse) {
          horse.raceDetails = [...horse.raceDetails, horseRaceDetail.id]
          const result = await horse.save();          
        }
      }
      return transformRaceDetail(raceDetail);
    }
    catch (err) {
      throw err
    }
  },

  horseRaceDetails: async () => {
    try {
      const raceDetails = await HorseRaceDetail.find();
      return raceDetails.map(raceDetail => {
        return transformRaceDetail(raceDetail)
      })
    } catch (error) {
      throw error
    }
  }

}
