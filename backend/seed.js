require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");
const Seat = require("./models/Seat");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany();
  await Seat.deleteMany();

  const event = await Event.create({
    name: "Sample Concert",
    venue: "City Arena",
    dateTime: new Date("2026-08-15T19:00:00"),
    totalSeats: 20,
  });

  const seats = [];
  for (let i = 1; i <= event.totalSeats; i++) {
    seats.push({ eventId: event._id, seatNumber: `A${i}`, status: "available" });
  }
  await Seat.insertMany(seats);

  console.log("Seeded:", event.name, "with", seats.length, "seats");
  process.exit();
};

seed();