const userResolver = require("../resolvers/auth");
const bookingResolver = require("../resolvers/booking");
const horseResolver = require("../resolvers/horse");

module.exports = {
  ...userResolver,
  ...horseResolver,
  ...bookingResolver
}