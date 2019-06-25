const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: Number,
    age: Number,
    color: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    sire: {
        type: String,
        required: true
    },
    dam: {
        type: String,
        required: true
    },
    raceDetails: [
        {
            type: mongoose.Schema.Types.ObjectId
        }        
    ]
})
module.exports = mongoose.model("Horse", horseSchema);