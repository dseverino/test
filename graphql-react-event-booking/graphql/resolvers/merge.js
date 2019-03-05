const DataLoader = require("dataloader");

const Event = require("../../models/event")
const User = require("../../models/user")

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds)
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } })
})

const transformUser = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    }
  }
  catch (err) {
    throw err
  }
}

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString())
    return event
  }
  catch (err) {
    throw err
  }
}

const events = async eventIds => {  
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });    
    return events.map(event => {
      return transformEvent(event)
    })
  }
  catch (err) {
    throw err
  }
}

const transformEvent = event => {  
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking,
    _id: booking.id,
    user: user.bind(this, booking.user.toString()),
    event: singleEvent.bind(this, booking.event),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString()
  }
}

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent
exports.transformUser = transformUser