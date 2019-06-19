const Program = require("../../models/program").default;
const { transformEvent, transformProgram } = require("./merge")

module.exports = {
  programs: async (args, req) => {
    try {
      if (!req.loggedIn) {
        //throw new Error("User not authenticated!")
      }
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
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    const program = new Program({
      date: req.date,
      number: req.number
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
  }
}
