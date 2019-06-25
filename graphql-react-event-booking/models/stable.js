const mongoose = require("mongoose");

const stableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  }
)

module.exports = mongoose.model("Stable", stableSchema);