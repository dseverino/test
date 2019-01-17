const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
)