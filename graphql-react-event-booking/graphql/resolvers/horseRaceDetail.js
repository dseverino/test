const HorseRaceDetail = require("../../models/horseRaceDetail");
const Horse = require("../../models/horse");
const Stable = require('../../models/stable');
const { transformRaceDetail } = require("../resolvers/merge")
const Claiming = require("../../models/claiming");
const Jockey = require('../../models/jockey');
const Trainer = require('../../models/trainer');
const Race = require("../../models/race");

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
    console.log(args.raceDetails)

    try {
      const raceDetail = await HorseRaceDetail.update({ _id: args.selectedHorse._id }, args.raceDetails);
      if (raceDetail && raceDetail.ok) {
        if (args.raceDetails.claimed) {

          await Horse.updateOne({ _id: horseId }, { $set: { stable: args.raceDetails.claimedBy } });

          await Stable.updateOne({ _id: args.raceDetails.stable }, { $pull: { horses: horseId } });
          await Stable.updateOne({ _id: args.raceDetails.claimedBy }, { $push: { horses: horseId } });

          const claim = new Claiming({ ...args.raceDetails, claimedFrom: args.raceDetails.stable, price: parseInt(args.raceDetails.claiming.split(" ")[0].replace(/,/g, '')), horse: horseId });
          try {
            const result = await claim.save();
            if (result) {
              console.log(result)
            }
          } catch (error) {
            console.log(error)
          }
        }

        await Race.update({_id: args.raceDetails.raceId}, {$set: {"positions.first.name": args.selectedHorse.name, "positions.first.by": args.raceDetails.lengths.quarter}})

        if (args.raceDetails.positions.finish > 6 && args.raceDetails.positions.finish < 6) {
          let year = new Date(args.raceDetails.date).getFullYear();
          let pos = ['starts', 'first', 'second', 'third', 'fourth', 'fifth']
          var myObj = {};
          
          myObj[`stats.${year}.starts`] = 1;
          myObj[`stats.${year}.${pos[args.raceDetails.positions.finish]}`] = 1;
          myObj[`trainerStats.${year}.${args.raceDetails.trainer}.starts`] = 1
          myObj[`trainerStats.${year}.${args.raceDetails.trainer}.${pos[args.raceDetails.positions.finish]}`] = 1;
          try {
            await Jockey.updateOne({ _id: args.raceDetails.jockey }, { $inc: myObj })  
          } catch (error) {
            console.log(error)
          }
          try {
            myObj = {}
            myObj[`stats.${year}.starts`] = 1;
            myObj[`stats.${year}.${pos[args.raceDetails.positions.finish]}`] = 1;
            await Stable.updateOne({ _id: args.raceDetails.stable }, { $inc: myObj })
            await Trainer.updateOne({ _id: args.raceDetails.trainer }, { $inc: myObj })
                        
            myObj = {}
            myObj[`stats.${year}.starts`] = 1;
            myObj[`stats.${year}.${pos[args.raceDetails.positions.finish]}`] = 1;
            myObj[`jockeyStats.${year}.${args.raceDetails.jockey}.starts`] = 1
            myObj[`jockeyStats.${year}.${args.raceDetails.jockey}.${pos[args.raceDetails.positions.finish]}`] = 1;
            await Horse.updateOne({ _id: horseId }, { $inc: myObj });            
            
          } catch (error) {
            console.log(error)
          }         
        }

        return args.raceDetails;
      }
    } catch (error) {
      throw error
    }
  }


}
