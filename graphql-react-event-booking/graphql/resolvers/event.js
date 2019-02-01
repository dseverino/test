const Event = require("../../models/event")
const { transformEvent } = require("../resolvers/merge");
const User = require("../../models/user")

module.exports = {
  events: async () => {      
    try {
      //Event.findByIdAndRemove("5c51b71b9b4e950f6c367b2f").then()      
      const events = await Event.find().populate("creator")
      return events.map(event => {
        return transformEvent(event)
      })
    }
    catch (err) {
      throw err
    }
  },
  createEvent: async (args, req) => {
    if(!req.loggedIn){
      throw new Error("User not authenticated!")
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date).toISOString(),
        creator: req.userId
      })

      const result = await event.save()
      let createdEvent = transformEvent(result)
      const userSaved = await User.findById(req.userId)
      
      if (!userSaved) {
        throw new Error("User does not exists")
      }

      userSaved.createdEvents.push(createdEvent._id)
      //await userSaved.save();
      await User.findByIdAndUpdate(req.userId, { $set: { createdEvents: userSaved.createdEvents } }, function (err, user) {
        if (err) return handleError(err);
      });
      return createdEvent
    }
    catch (err) {
      throw err
    }
  }
}