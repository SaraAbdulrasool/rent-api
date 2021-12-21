const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const jwtFunction = require("../functions/jwtFunction");
require("dotenv").config();

//update token and refreshToken
router.post("/token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null)
    return res.status(401).json({ message: "Refresh token expired" });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Failed to generate refresh token" });
    const accessToken = jwtFunction.generateAccessToken({ user });
    const refreshToken = jwtFunction.generateRefreshToken({ user });
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  });
});

module.exports = router;
