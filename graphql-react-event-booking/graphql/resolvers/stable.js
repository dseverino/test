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
      const stables = await Stable.find()      
      return stables.map(stable => {
        return transformStable(stable)
      })
    } catch (error) {
      throw error
    }   
  }
}