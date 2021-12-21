require("dotenv").config();

const express = require("express");
const jwt = require("./functions/jwtFunctions");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();

//database connection string
const dbURL =
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

//midlleware
app.use(express.json());
app.use(cors());

app.listen(3000);

//handle errors
const handleError = (err) => {
  let error = { email: "", password: "" };

  //incorrect email
  if (err.message === "This email is inccorect") {
    error.email = "This email is not registered";
  }
  //incorrect password
  else if (err.message === "Password is inccorect") {
    error.password = "This password is incorrect";
  }
  //duplicate email
  else if (err.code === 11000) {
    error.email = "This email already registered";
  }
  return error;
};

app.post("/login", async (req, res) => {
  let [db, dberr] = await mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      return [result, null];
    })
    .catch((err) => {
      console.log(err);
      return [null, err];
    });
  if (dberr) return res.status(500).json({ message: dberr.message });

  let [user, usererr] = await User.login(req.body.email, req.body.password)
    .then((result) => {
      return [result, null];
      //generate tokens
    })
    .catch((err) => {
      console.log(err);
      return [null, err];
    })
    .finally(() => mongoose.connection.close());

  if (usererr) {
    const error = handleError(err);
    return res.status(400).json({ message: error });
  }

  const accessToken = generateAccessToken({ _id: user._id, email: user.email });
  const refreshToken = generateRefreshToken({
    _id: user._id,
    email: user.email,
  });

  return res.status(200).json({
    user: { ...user, password: undefined },
    message: "Logged in successfully",
    accessToken,
    refreshToken,
  });

  // mongoose
  //   .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  //   .then((result) => {
  //     User.login(req.body.email, req.body.password)
  //       .then((result) => {
  //         //generate tokens
  //         const accessToken = generateAccessToken({ user: result });
  //         const refreshToken = jwt.sign(
  //           { user: result },
  //           process.env.REFRESH_TOKEN_SECRET,
  //           { expiresIn: "24h" }
  //         );
  //         res.status(200).json({
  //           user: result,
  //           message: "Logged in successfully",
  //           accessToken,
  //           refreshToken,
  //         });
  //       })
  //       .catch((err) => {
  //         const error = handleError(err);
  //         res.status(400).json({ message: error });
  //         console.log(err);
  //       })
  //       .finally(() => mongoose.connection.close());
  //   })
  //   .catch((err) => console.log(err.message));
});
