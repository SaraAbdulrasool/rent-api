const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const jwt = require("../functions/jwtFunction");

//login
router.post("/login", userController.login);

router.post("/login/token", userController.loginToken);
//sign up
router.post("/", userController.addUser);
//authenticate token
router.use(jwt.authenticateToken);
//get a user
router.get("/:id", userController.getUser);
// update user
router.put("/:id", userController.updateUser);

module.exports = router;
