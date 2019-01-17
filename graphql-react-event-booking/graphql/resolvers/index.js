const Event = require("../../models/event");
const User = require("../../models/user")
const bcrypt = require("bcrypt")

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: events.bind(this, user.createdEvents)
    }
  }
  catch (err) {
    throw err
  }
}

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })    
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      }
    })
  }  
  catch (err) {
    throw err
  }
}

module.exports = {
  events: async () => {
    try {
      //Event.deleteMany().then()      
      const events = await Event.find().populate("creator")
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        }
      })
    }
    catch (err) {
      throw err
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date).toISOString(),
        creator: "5c40d7b5cc5ed923183b0f56"
      })  

      const result = await event.save()
      let createdEvent = { 
            ...result._doc, 
            _id: result.id, 
            creator: user.bind(this, result.creator) 
          }      
      const userSaved = await User.findById("5c40d7b5cc5ed923183b0f56")

      if (!userSaved) {
        throw new Error("User does not exists")
      }
      userSaved.createdEvents.push(event)
      await userSaved.save();

      return createdEvent
    }
    catch (err) {
      console.log(err)
      throw err
    }
  },
  users: async () => {
    try {
      //User.deleteMany().then()
      const users = await User.find().populate("createdEvents")
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