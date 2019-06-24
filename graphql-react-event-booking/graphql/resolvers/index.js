const userResolver = require("../resolvers/auth");
const programResolver = require("../resolvers/program");
const raceResolver = require("../resolvers/race")
const horseResolver = require("../resolvers/horse");
const jockeyResolver = require("../resolvers/jockey")
const horseRaceDetail = require("../resolvers/horseRaceDetail")

module.exports = {
  ...userResolver,
  ...horseResolver,
  ...programResolver,
  ...raceResolver,
  ...jockeyResolver,
  ...horseRaceDetail
}