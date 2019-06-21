const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema(
  {
    programId: {
      type: String
    },
    event: {
      type: String,
      required: true
    },
    distance: {
      type: String,
      required: true
    },
    claimingPrice: [
      {
        type: String,
        required: true
      }
    ],
    claimingType: [
      {
        type: String,
        required: true
      }
    ],
    procedence: [
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
    prize: {
      type: String,
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