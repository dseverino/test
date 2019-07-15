const mongoose = require("mongoose");

const stableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    horses: [
      {
        type: mongoose.Schema.Types.ObjectId
      }      
    ]
  }
)

module.exports = mongoose.model("Stable", stableSchema);