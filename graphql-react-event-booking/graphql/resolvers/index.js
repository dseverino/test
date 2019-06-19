const userResolver = require("../resolvers/auth");
const programResolver = require("../resolvers/program");
const horseResolver = require("../resolvers/horse");

module.exports = {
  ...userResolver,
  ...horseResolver,
  ...programResolver
}