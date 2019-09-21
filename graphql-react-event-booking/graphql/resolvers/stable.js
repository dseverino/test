const Stable = require("../../models/stable")
const { transformStable } = require("../resolvers/merge")

module.exports = {

  createStable: async (args) => {
    const stable = new Stable({
      name: args.stableInput.name
    })
    try {
      const result = await stable.save()
      if (result) {
        return transformStable(result)
      }
    } catch (error) {
      throw error
    }
  },
  stables: async (args) => {
    try {
      const stables = await Stable.find().sort({ name: 1 });
      return stables.map(stable => {
        return transformStable(stable)
      })
    } catch (error) {
      throw error
    }
  },
  singleStable: async (args) => {
    try {

      //Horse.remove().then()
      const result = await Stable.findOne({ name: args.name });

      if (result) {
        return transformStable(result)
      }
    }
    catch (err) {
      throw err
    }
  },
  addTrainerStable: async (args) => {
    try {
      const stable = await Stable.findOne({ _id: args.stableId });
      stable.trainers.push(args.trainerId);
      const stableUpdated = await stable.save();
      return transformStable(stableUpdated)

    } catch (error) {
      throw error
    }
    //(stableId: ID, trainerId: ID): Stable
  }

}