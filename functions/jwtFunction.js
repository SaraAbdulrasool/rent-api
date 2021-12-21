const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { isJwtExpired } = require("jwt-check-expiration");

//generate token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
}

//generate refresh token
function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
}

//authenticate token
function authenticateToken(req, res, next) {
  try {
    if (req.body.message == "noUser") {
      next();
    } else {
      console.log("reached");
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      console.log("token: " + token);
      //console.log(isJwtExpired(token));
      if (token == null)
        return res.status(401).json({ message: "token is expired" });
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
          next();
        } else {
          return res.status(401).json({ message: "Token verification failed" });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
};
