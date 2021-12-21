const express = require("express");
const propertyController = require("../controller/propertyController.js");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  userlimits: { fileSize: 59820046, fieldSize: 59820046 },
});

//post propertiesß
router.get("/", propertyController.getProperties);
//post propertiesß
router.post("/", propertyController.getProperties);
//add property
router.post("/add-property", propertyController.addProperty);
//add property images
router.post(
  "/upload",
  upload.array("files"),
  propertyController.addPropertyImages
);
//get property
router.post("/property:id", propertyController.getProperty);
//get properties with owners details for admin
router.get("/PropertyWithOwner", propertyController.getPropertiesWithOwners);
//get properties for a particular owners
router.get("/:id", propertyController.getOwnerProperties);
//update property reserved dates
router.put("/update-reservedDates:id", propertyController.updateDates);
//update property info
router.put("/:id", propertyController.updateProperty);
//delete property
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
