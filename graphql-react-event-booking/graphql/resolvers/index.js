const userResolver = require("../resolvers/auth");
const programResolver = require("../resolvers/program");
const raceResolver = require("../resolvers/race")
const horseResolver = require("../resolvers/horse");

module.exports = {
  ...userResolver,
  ...horseResolver,
  ...programResolver,
  ...raceResolver
}