const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseRaceDetailSchema = new Schema({
    
    jockey: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    jockeyWeight: {
        type: Number,
        required: true,
    }, 
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    stable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    startingPosition: {
        type: Number,
        required: true,
    }, 
    positions: Object, 
    lengths: Object, 
    times: Object, 
    trainingTimes: [
        {
            type: Object
        }
    ], 
    horseWeight: Number,
    claimed: Boolean,
    retired: Boolean,
    retiredDetails: String, 
    bet: String, 
    horseTools: [String], 
    totalHorses: Number,
    horseAge: Number,
    claimingPrice: Number
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);