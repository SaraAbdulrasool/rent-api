const express = require("express");
const revenueController = require("../controller/revenueController");
const router = express.Router();
const jwt = require("../functions/jwtFunction");

//get all revenues
router.get("/", revenueController.getRevenues);
//get sorted revenues
router.get("/sorted-revenue", revenueController.getSortedRevenues);
// Add new revenue
router.post("/", revenueController.addRevenue);

module.exports = router;
