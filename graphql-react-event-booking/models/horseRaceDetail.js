const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseRaceDetailSchema = new Schema({

  jockey: mongoose.Schema.Types.ObjectId,
  jockeyWeight: Number,
  jockeyChanged: Boolean,
  trainer: mongoose.Schema.Types.ObjectId,
  stable: mongoose.Schema.Types.ObjectId,
  startingPosition: Number,
  positions: Object,
  lengths: Object,
  times: Object,
  finishTime: String,
  trainingTimes: [
    {
      type: Object
    }
  ],
  horseWeight: Number,
  claimed: Boolean,
  claimedBy: mongoose.Schema.Types.ObjectId,
  retired: Boolean,
  retiredDetails: String,
  comments: String,
  bet: String,
  horseEquipments: [String],
  totalHorses: Number,
  discarded: Boolean,
  horseAge: Number,
  claiming: String,
  trackCondition: String,
  raceNumber: Number,
  date: Date,
  horseMedications: [String],
  distance: Number,
  confirmed: Boolean,
  raceId: mongoose.Schema.Types.ObjectId,
  length: Object
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);