const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("../resolvers/merge")

module.exports = {
  bookings: async () => {
    try {
      //Booking.deleteMany().then()
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return transformBooking(booking)
      })
    }
    catch (err) {
      throw err
    }
  },
  bookEvent: async (args, req) => {
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    const bookEvent = new Booking({
      event: args.eventId,
      user: req.userId
    })
    try {
      const result = await bookEvent.save();
      return transformBooking(result)
    }
    catch (err) {
      throw err
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }
    try {
      const booking = await Booking.findByIdAndRemove({ _id: args.bookingId }).populate("event");
      return transformEvent(booking.event)
    }
    catch (err) {
      throw err
    }
  }
}
