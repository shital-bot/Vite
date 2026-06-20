const express = require("express");
const router = express.Router();
const { reserveSeats } = require("../controllers/reservationController");

router.post("/", reserveSeats);

module.exports = router;