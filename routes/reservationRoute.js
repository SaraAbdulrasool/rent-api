const express = require("express");
const reservationController = require("../controller/reservationController.js");
const router = express.Router();

//get user reservations
router.get("/:id", reservationController.getUserReservations);
//add reservation
router.post("/", reservationController.addReservation);
//delete reservation
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
