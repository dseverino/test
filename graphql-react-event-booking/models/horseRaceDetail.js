const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseRaceDetailSchema = new Schema({

  jockey: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  jockeyWeight: {
    type: Number,
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  stable: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  startingPosition: {
    type: Number,
    required: true,
  },
  positions: Object,
  lengths: Object,
  times: Object,
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
  bet: String,
  horseEquipments: [String],
  totalHorses: Number,
  horseAge: Number,
  claiming: String,
  trackCondition: String,
  raceNumber: Number,
  horseMedications: [String],
  distance: {
    type: Number,
    required: true
  },
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);