const Program = require("../../models/program");
const { transformProgram } = require("./merge")

module.exports = {
  programs: async (args, req) => {
    try {
      /*if (!req.loggedIn) {
        //throw new Error("User not authenticated!")
      }*/
      //Program.deleteMany().then()
      const programs = await Program.find();

      return programs.map(program => {
        return transformProgram(program)
      })
    }
    catch (err) {
      throw err
    }
  },
  createProgram: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const program = new Program({
      date: args.programInput.date,
      number: args.programInput.number
    })
    try {
      const result = await program.save();
      return transformProgram(result)
    }
    catch (err) {
      throw err
    }
  },
  cancelProgram: async (args, req) => {
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    try {
      const program = await Program.findByIdAndRemove({ _id: args.programId }).populate("event");
      return transformEvent(program.event)
    }
    catch (err) {
      throw err
    }
  },
  addRace: async (args) => {
    const program = await Program.findOne({ number: args.programId })
    program.races = [...program.races, args.raceId]
    try {
      const res = await program.save();
      return transformProgram(res)
    } catch (error) {
      throw error
    }
  },

  singleProgram: async (args) => {
    try {
      const program = await Program.findOne({number: args.programId});
      if(program){
        return transformProgram(program)
      }
      else {
        throw new Error("Program does not exist.")
      }
    } catch (error) {
      throw error
    }
  }
}