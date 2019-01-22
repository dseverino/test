const Event = require("../../models/event")
const { transformEvent } = require("../resolvers/merge");
const User = require("../../models/user")

module.exports = {
  events: async () => {
    try {
      //Event.deleteMany().then()      
      const events = await Event.find().populate("creator")
      return events.map(event => {
        return transformEvent(event)
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
        creator: "5c478a8e0d01e62768b3b874"
      })

      const result = await event.save()
      let createdEvent = transformEvent(result)
      const userSaved = await User.findById("5c478a8e0d01e62768b3b874")
      
      if (!userSaved) {
        throw new Error("User does not exists")
      }

      userSaved.createdEvents.push(createdEvent._id)
      //await userSaved.save();
      await User.findByIdAndUpdate("5c478a8e0d01e62768b3b874", { $set: { createdEvents: userSaved.createdEvents } }, function (err, user) {
        if (err) return handleError(err);
      });
      return createdEvent
    }
    catch (err) {
      throw err
    }
  }
}