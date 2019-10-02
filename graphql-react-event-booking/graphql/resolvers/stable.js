const Stable = require("../../models/stable")
const { transformStable } = require("../resolvers/merge")

module.exports = {

  createStable: async (args) => {
    const name = new RegExp(".^" + args.name + ".&", "i");
    Stable.findOne({ name: { $regex: name } }, (err, stable) => {
      if (err) {
        console.log(err)
        throw error
      }
      if (stable) {
        console.log(stable)
        return "Stable exists"
      }
    })

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
  stablesWithoutTrainer: async () => {
    try {
      const stables = await Stable.find({ trainers: { $size: 0 } }).sort({ name: 1 });
      return stables.map(stable => {
        return transformStable(stable)
      })
    } catch (error) {
      throw error
    }
  },
  singleStable: async (args) => {
    try {
      const name = new RegExp("^" + args.name + "$", "i");      
      const result = await Stable.findOne({ name: { $regex: name } });

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