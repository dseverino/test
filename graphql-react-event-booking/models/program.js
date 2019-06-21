const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true
    },
    races: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race"
      }
    ],
    date: {
      type: String,
      required: true
    }
  }
)

module.exports = mongoose.model("Program", programSchema);