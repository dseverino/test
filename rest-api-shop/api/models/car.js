const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vin: String, 
    year: Number,
    brand: String,
    color: String,
    price: Number,
    saleDate: Date
})

module.exports = mongoose.model("Car", carSchema);