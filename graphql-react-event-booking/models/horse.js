const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
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