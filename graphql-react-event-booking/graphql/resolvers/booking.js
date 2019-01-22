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
  bookEvent: async (args) => {
    const bookEvent = new Booking({
      event: args.eventId,
      user: "5c478a8e0d01e62768b3b874"
    })
    try {
      const result = await bookEvent.save();
      return transformBooking(result)
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
