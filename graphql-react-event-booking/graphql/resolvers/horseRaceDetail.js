const HorseRaceDetail = require("../../models/horseRaceDetail");

module.exports = {

  createHorseRaceDetail: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const horseRaceDetail = new HorseRaceDetail(args.horseRaceDetail)
    console.log(horseRaceDetail)
    try {
      
    }
    catch (err) {
      throw err
    }
  }

}
