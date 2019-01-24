const Event = require("../../models/event")
const User = require("../../models/user")

const singleUser = async userId => {
  try {
    const user = await User.findById(userId)
    return transformUser(user)
  }
  catch (err) {
    throw err
  }
}

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdEvents: events.bind(this, user.createdEvents)
  }
}

const singleEvent = async eventId => {
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
    creator: singleUser.bind(this, event.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking,
    _id: booking.id,
    user: singleUser.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString()
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

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent
exports.transformUser = transformUser