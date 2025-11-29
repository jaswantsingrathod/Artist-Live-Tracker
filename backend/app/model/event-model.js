const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    geo: {
        lat: { type: Number },
        long: { type: Number }
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------------------------
const Event = mongoose.model('Event', eventSchema)
module.exports = Event