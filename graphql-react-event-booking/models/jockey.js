const mongoose = require("mongoose");

const jockeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  }
)

module.exports = mongoose.model("Jockey", jockeySchema);