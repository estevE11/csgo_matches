const mongoose = require("mongoose");

module.exports = mongoose.model("match", new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    players: {
        type: [String],
        required: true
    },
    result: {
        type: Number,
        required: true,
    },
    map: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true, 
        default: Date.now
    }
}));