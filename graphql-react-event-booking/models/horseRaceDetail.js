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
        type: String,
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
        type: String,
        required: true,
    }, 
    positions: [
        {
            type: Position
        }
    ], 
    lengths: [
        {
            type: Length
        }
    ], 
    times: [
        {
            type: Time
        }
    ], 
    trainingTimes: [
        {
            type: TrainingTime
        }
    ], 
    horseWeight: {
        type: String,
        required: true,
    }, 
    claimed: {
        type: String,
        required: true,
    }, 
    retired: {
        type: String,
        required: true,
    }, 
    retiredDetails: String, 
    bet: String, 
    horseTools: [String], 
    totalHorses: String    
})
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);