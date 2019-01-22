const Booking = require("../../models/booking");
const { event } = require("../resolvers/merge")
const { user } = require("../resolvers/merge")
const { transformEvent } = require("../resolvers/merge")

module.exports = {
  bookings: async () => {
    try {
      //Booking.deleteMany().then()
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return {
          ...booking,
          _id: booking.id,
          user: user.bind(this, booking.user),
          event: event.bind(this, booking.event),
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString()
        }
      })
    }
    catch (err) {
      throw err
    }
  },
  bookEvent: async (args) => {
    const bookEvent = new Booking({
      event: args.eventId,
      user: "5c3e7ec3b7fc1323404663f2"
    })
    try {
      const result = await bookEvent.save();
      return {
        _id: result.id,
        user: user.bind(this, "5c3e7ec3b7fc1323404663f2"),
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
        event: event.bind(this, result.event)
      }
    }
    catch (err) {
      throw err
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findByIdAndRemove({ _id: args.bookingId }).populate("event");
      return transformEvent(booking.event)
    }
    catch (err) {
      throw err
    }
  }
}
