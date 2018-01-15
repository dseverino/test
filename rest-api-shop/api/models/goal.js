const mongoose = require('mongoose');

const goal = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    goal: mongoose.Schema.Types.String
})

module.exports = mongoose.model('Goal', goal);