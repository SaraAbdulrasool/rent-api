const Revenue = require("../models/revenue.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//database connection string
const dbURL =
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

//get all revenues
const getRevenues = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Revenue.find()
        .then((result) => {
          res.status(200).json({
            message: "All revenues retrieved successfully",
            revenues: result,
          });
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        })
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

const getSortedRevenues = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Revenue.aggregate([
        {
          $lookup: {
            from: "properties",
            localField: "propertyID",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: "$property" },
      ])
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Revenues with properties retrieved successfully",
            revenues: result,
          });
        })
        .catch((err) => mongoose.connection.close())
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => {
      res.send(err);
    });
};

const addRevenue = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const revenue = new Revenue(req.body);
      revenue
        .save()
        .then((result) => {
          res.status(200).json({ message: "Revenue added successfully" });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getRevenues,
  getSortedRevenues,
  addRevenue,
};
