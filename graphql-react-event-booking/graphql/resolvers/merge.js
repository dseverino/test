const Event = require("../../models/event")
const User = require("../../models/user")

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

const event = async eventId => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
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

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return transformEvent(event)
    })
  }
  catch (err) {
    throw err
  }
}

exports.user = user;
exports.event = event;
exports.transformEvent = transformEvent
exports.events = events