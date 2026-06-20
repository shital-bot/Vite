const express = require("express");
const router = express.Router();
const { confirmBooking } = require("../controllers/bookingController");

router.post("/", confirmBooking);

module.exports = router;