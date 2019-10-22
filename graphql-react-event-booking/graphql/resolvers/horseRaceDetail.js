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
          if(horse.weight != args.horseRaceDetail.horseWeight){
            horse.weight = args.horseRaceDetail.horseWeight;
          }
          
          horse.raceDetails = [...horse.raceDetails, horseRaceDetail.id]
          horse.save();
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
  },

  updateHorseRaceDetail: async () => {
    //raceDetails: HorseRaceDetailInput): HorseRaceDetail
    try {
      const raceDetail = await HorseRaceDetail.findById(args.raceDetailId)
      if (raceDetail) {
        raceDetail.raceDetails = [...horse.raceDetails, args.raceDetailId]
        const result = await horse.save()
        return transformHorse(result)
      }
    } catch (error) {
      throw error
    }
  }  
    

}
