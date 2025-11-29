const Event = require('../model/event-model')
const axios = require('axios')
const eventCltr = {}

eventCltr.create = async (req, res) => {
    try {
        const { title, dateTime, artist, address, description } = req.body
        const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${process.env.SECRET_API_KEY}`;
        const response = await axios.get(url)
        if (!response.data || response.data.length === 0) {
            return res.status(400).json({ error: "Unable to get address" })
        }
        const lat = parseFloat(response.data[0].lat);
        const long = parseFloat(response.data[0].lon);
        const event = await Event.create({
            title,
            dateTime,
            description,
            artist,
            address,
            geo: { lat, long }
        })
        res.json(event)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" })
    }
}
eventCltr.list = async (req, res) => {
    try {
        const event = await Event.find();
        res.status(200).json(event)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" })
    }
}

eventCltr.remove = async (req, res) => {
    const id = req.params.id
    try {
        const removeEvent = await Event.findByIdAndDelete(id)
        if (!removeEvent) {
            return res.status(404).json({ error: "Event not found" })
        }
        res.status(200).json(removeEvent)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports = eventCltr;