const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");

const reserveSeats = async (req, res) => {
  try {
    const { eventId, seatNumbers, userId } = req.body;

    if (!eventId || !seatNumbers || !seatNumbers.length) {
      return res.status(400).json({ message: "eventId and seatNumbers are required" });
    }

    // Atomically claim only seats that are still available
    const result = await Seat.updateMany(
      { eventId, seatNumber: { $in: seatNumbers }, status: "available" },
      { $set: { status: "reserved" } }
    );

    if (result.modifiedCount !== seatNumbers.length) {
      // Not all requested seats were free — release any we grabbed and bail
      await Seat.updateMany(
        { eventId, seatNumber: { $in: seatNumbers }, status: "reserved" },
        { $set: { status: "available" } }
      );
      return res.status(409).json({ message: "One or more seats are no longer available" });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const reservation = await Reservation.create({ userId, eventId, seatNumbers, expiresAt });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { reserveSeats };