const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const { events, transformUser } = require("../resolvers/merge");


module.exports = {
  users: async () => {
    try {
      //User.remove().then()
      const users = await User.find()      
      return users.map(user => {
        return transformUser(user)
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
        return transformUser(user)
      }
      else {
        throw new Error("User already exists!")
      }
    }
    catch (err) {
      throw err
    }
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email})
    if(!user){
      throw new Error("User does not exist!")
    }
    const match = await bcrypt.compare(password, user.password);
    
    if(!match){
      throw new Error("Password is incorrect")
    }
    const token = jwt.sign({userId: user.id, email: user.email}, "supersecretkey", {expiresIn: "1h"})    
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
}