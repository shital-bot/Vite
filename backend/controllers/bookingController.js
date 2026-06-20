const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");
const Booking = require("../models/Booking");

const confirmBooking = async (req, res) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    if (reservation.expiresAt < new Date()) {
      return res.status(410).json({ message: "Reservation has expired" });
    }

    await Seat.updateMany(
      { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
      { $set: { status: "booked" } }
    );

    const booking = await Booking.create({
      userId: reservation.userId,
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
    });

    await Reservation.findByIdAndDelete(reservationId);

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { confirmBooking };