const User = require("../models/user.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//database connection string
const dbURL =
  process.env.MONGODB_STRING ||
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

//handle errors
const handleError = (err) => {
  let error = { email: "", password: "" };

  //incorrect email
  if (err.message === "This email is inccorect") {
    error.email = "Invalid email address";
  }

  //incorrect password
  if (err.message === "Password is inccorect") {
    error.password = "This password is incorrect";
  }

  //duplicate email
  if (err.code === 11000) {
    error.email = "This email already registered";
  }

  return error;
};

//get a specific user by ID
const getUser = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      User.find({ _id: req.params.id })
        .exec()
        .then((result) => {
          res
            .status(200)
            .json({ message: "user retrieved successfully", user: result });
        })
        .catch(
          (err) => res.status(400).json({ message: err.message }),
          console.log(err.message)
        )
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//add new user (sign-up)
const addUser = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const user = new User(req.body);
      user
        .save()
        .then((result) => {
          //generate token
          const accessToken = generateAccessToken({ user: result });
          //generate refresh token
          const refreshToken = generateRefreshToken({ user: result });
          //send response back to the browser
          res.status(200).json({
            user: user,
            accessToken,
            refreshToken,
          });
        })
        .catch((err) => {
          res.status(401).json({ error: err.message });
          console.log(err.message);
        })
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//login
const login = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      User.login(req.body.email, req.body.password)
        .then((result) => {
          //generate token
          const accessToken = generateAccessToken({ user: result });
          //generate refresh token
          const refreshToken = generateRefreshToken({ user: result });
          //send response back to the browser
          res.status(200).json({
            user: result,
            message: "Logged in successfully",
            accessToken,
            refreshToken,
          });
        })
        .catch((err) => {
          const error = handleError(err);
          res.status(400).json({ message: error });
        })
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//update user
const updateUser = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      User.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
          res.status(200).json({ message: "User data is updated" });
        })
        .catch(
          (error) => res.status(400).json({ message: error.message }),
          console.log(error)
        )
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//generate token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
}

//generate refresh token
function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
}

async function loginToken(req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403);
    const accessToken = jwtFunction.generateAccessToken({ user });
    const refreshToken = jwtFunction.generateRefreshToken({ user });
    console.log("Access token: " + accessToken);
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  });
}

module.exports = {
  getUser,
  addUser,
  updateUser,
  login,
  loginToken,
};
