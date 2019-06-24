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
  }
}