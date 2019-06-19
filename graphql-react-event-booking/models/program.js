import { Schema, model } from "mongoose";

const programSchema = new Schema(
  {
    number: {
      type: String,
      required: true
    },
    races: [
      {
        type: Schema.Types.ObjectId,
        ref: "Race"
      }
    ],
    date: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default model("Program", programSchema);