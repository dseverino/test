const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema(
  {
    programId: {
      type: Number
    },
    event: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    distance: {
      type: String,
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
    horses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horse"
      }
    ]
  }
)

module.exports = mongoose.model("Race", raceSchema);