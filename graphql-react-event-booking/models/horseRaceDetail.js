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
  jockeyChanged: Boolean,
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
  date: {
    type: Date,
    required: true
  },
  horseMedications: [String],
  distance: {
    type: Number,
    required: true
  },
  confirmed: Boolean,
  raceId: mongoose.Schema.Types.ObjectId
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);