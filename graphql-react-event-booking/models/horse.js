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
    stable: {
        type: String,
        required: true
    },
    //shoul create Trainer model
    trainer: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Horse", horseSchema);