const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseRaceDetailSchema = new Schema({
    raceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    HorseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    jockeyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    jockeyWeight: {
        type: Number,
        required: true,
    }, 
    trainerId: {
        type: String,
        required: true,
    }, 
    stableId: {
        type: String,
        required: true,
    }, 
    startingPosition: {
        type: Number,
        required: true,
    }, 
    positions: [
        {
            type: Object
        }
    ], 
    lengths: [
        {
            type: Object
        }
    ], 
    times: [
        {
            type: Object
        }
    ], 
    trainingTimes: [
        {
            type: Object
        }
    ], 
    horseWeight: {
        type: Number,
        required: true,
    }, 
    claimed: {
        type: Boolean,
        required: true,
    }, 
    retired: {
        type: Boolean,
        required: true,
    }, 
    retiredDetails: String, 
    bet: String, 
    horseTools: [String], 
    totalHorses: Number    
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);