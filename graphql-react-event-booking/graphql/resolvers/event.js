const Event = require("../../models/event")
const { transformEvent } = require("../resolvers/merge");
const User = require("../../models/user")

module.exports = {
  events: async () => {
    try {
      //Event.remove().then()
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
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date).toISOString(),
      creator: req.userId
    })

    try {
      const result = await event.save()
      let createdEvent = transformEvent(result)
      const creator = await User.findById(req.userId)

      if (!creator) {
        throw new Error("User does not exists")
      }

      creator.createdEvents.push(event)
      await creator.save();
      //await userSaved.save();
      /*await User.findByIdAndUpdate(req.userId, { $set: { createdEvents: userSaved.createdEvents } }, function (err, user) {
        if (err) return handleError(err);
      });*/
      return createdEvent
    }
    catch (err) {
      console.log(err)
      throw err
    }
  }
}