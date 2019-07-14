const Trainer = require("../../models/trainer")
const { transformTrainer } = require("../resolvers/merge")

module.exports = {
  createTrainer: async (args) => {
    const trainer = new Trainer({
      name: args.trainerInput.name
    })
    try {
      const result = await trainer.save()
      if (result) {
        return transformTrainer(result)
      }
    } catch (error) {
      throw error
    }
  },
  trainers: async (args) => {
    try {
      const trainers = await Trainer.find()      
      return trainers.map(trainer => {
        return transformTrainer(trainer)
      })
    } catch (error) {
      throw error
    }   
  },
  singleTrainer: async (args) => {
    try {
      
      //Horse.remove().then()
      const result = await Trainer.findOne({ name: args.name });
      
      if(result){        
        return transformTrainer(result)
      }
    }
    catch (err) {
      throw err
    }
  }
}