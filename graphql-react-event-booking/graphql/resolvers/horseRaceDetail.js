const HorseRaceDetail = require("../../models/horseRaceDetail");
const Horse = require("../../models/horse");
const Stable = require('../../models/stable');
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
          if (horse.weight != args.horseRaceDetail.horseWeight) {
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

  updateHorseRaceDetail: async (args) => {
    const horseId = args.raceDetails.horseId;
    delete args.raceDetails.horseId;
    try {
      const raceDetail = await HorseRaceDetail.update({ _id: args.raceDetailId }, args.raceDetails);
      if (raceDetail && raceDetail.ok) {
        if (args.raceDetails.claimed) {

          const horse = await Horse.updateOne({ _id: horseId }, { $set: { stable: args.raceDetails.claimedBy } });          
                    
          await Stable.updateOne({ _id: args.raceDetails.stable }, { $pull: { horses: horseId } });
          await Stable.updateOne({ _id: args.raceDetails.claimedBy }, { $push: { horses: horseId } });
                    
        }
        return args.raceDetails;
      }
    } catch (error) {
      throw error
    }
  }


}
