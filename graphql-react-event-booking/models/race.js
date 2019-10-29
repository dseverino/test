const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema(
  {
    programId: {
      type: Number
    },
    event: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    distance: {
      type: Number,
      required: true
    },
    claimings: [
      {
        type: String,
        required: true
      }
    ],
    procedences: [
      {
        type: String,
        required: true
      }
    ],
    spec: {
      type: String
    },
    horseAge: {
      type: String,
      required: true
    },
    purse: {
      type: Number,
      required: true
    },
    completed: Boolean,
    horses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horse"
      }
    ],
    times: Object,
    totalHorses: Number,
    hasRaceDetails: Boolean,
    trackCondition: String
  }
)

module.exports = mongoose.model("Race", raceSchema);