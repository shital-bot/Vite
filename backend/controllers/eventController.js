const Event = require("../models/Event");
const Seat = require("../models/Seat");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const seats = await Seat.find({ eventId: req.params.id }).sort("seatNumber");
    res.json({ event, seats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, getEventById };