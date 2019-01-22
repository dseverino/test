const userResolver = require("../resolvers/auth");
const bookingResolver = require("../resolvers/booking");
const eventResolver = require("../resolvers/event");

module.exports = {
  ...userResolver,
  ...eventResolver,
  ...bookingResolver
}