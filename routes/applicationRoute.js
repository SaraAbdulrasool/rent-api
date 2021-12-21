const express = require("express");
const applicationController = require("../controller/applicationController.js");
const router = express.Router();

//get all application
router.get("/", applicationController.getApplications);
//get user applications for specific owner
router.get("/:id", applicationController.getUserApplications);
//get customer application
router.get(
  "/customer-applications/:id",
  applicationController.getCustomerApplications
);
//add new application
router.post("/", applicationController.addApplication);
//update application
router.put("/:id", applicationController.updateApplication);

module.exports = router;
