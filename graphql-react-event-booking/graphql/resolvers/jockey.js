const Jockey = require("../../models/jockey")
const { transformJockey } = require("../resolvers/merge")

module.exports = {
  createJockey: async (args) => {
    const jockey = new Jockey({
      name: args.jockeyInput.name
    })
    try {
      const result = await jockey.save()
      if (result) {
        return transformJockey(result)
      }
    } catch (error) {
      throw error
    }
  },
  jockeys: async (args) => {
    try {
      const jockeys = await Jockey.find()      
      return jockeys.map(jockey => {
        return transformJockey(jockey)
      })
    } catch (error) {
      throw error
    }   
  }
}