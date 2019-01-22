const User = require("../../models/user");
const { events } = require("../resolvers/merge");
const bcrypt = require("bcrypt")

module.exports = {
  users: async () => {
    try {
      //User.deleteMany().then()
      const users = await User.find()
      return users.map(user => {
        return {
          ...user._doc,
          password: null,
          _id: user.id,
          createdEvents: events.bind(this, user.createdEvents)
        }
      })
    }
    catch (err) {
      throw err
    }
  },
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email })
      if (!user) {
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        })
        const result = await user.save()
        return { ...result._doc, password: null, _id: result.id }
      }
      else {
        throw new Error("User already exists!")
      }
    }
    catch (err) {
      throw err
    }
  }
}