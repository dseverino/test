const Horse = require("../../models/horse")
const { transformHorse } = require("./merge");
const User = require("../../models/user")

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
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    const horse = new Horse({
      name: args.horseInput.name,
      weight: args.horseInput.weight,
      age: args.horseInput.age,
      color: args.horseInput.color,
      sex: args.horseInput.sex,
      sire: args.horseInput.sire,
      dam: args.horseInput.dam,
      stable: args.horseInput.stable
    })

    try {
      const result = await horse.save()
      let createdHorse = transformHorse(result)
      //const creator = await User.findById(req.userId)

      /*if (!creator) {
        throw new Error("User does not exists")
      }*/

      //creator.createdHorses.push(horse)
      //await creator.save();
      //await userSaved.save();
      /*await User.findByIdAndUpdate(req.userId, { $set: { createdHorses: userSaved.createdHorses } }, function (err, user) {
        if (err) return handleError(err);
      });*/
      return createdHorse
    }
    catch (err) {
      console.log(err)
      throw err
    }
  }
}