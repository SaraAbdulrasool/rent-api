const mongoose = require("mongoose");
const Reservation = require("../models/reservation.js");

//database connection string
const dbURL =
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

//get user reservations
const getUserReservations = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Reservation.aggregate([
        { $match: { customerID: mongoose.mongo.ObjectId(req.params.id) } },
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
          res.status(200).json({ reservations: result });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//add new reservation
const addReservation = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      let x = {
        customerID: mongoose.mongo.ObjectId(req.body.customerID),
        ownerID: mongoose.mongo.ObjectId(req.body.ownerID),
        propertyID: mongoose.mongo.ObjectId(req.body.propertyID),
        dates: req.body.dates,
        totalPrice: req.body.totalPrice,
      };
      const reservation = new Reservation(x);
      reservation
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Reservation added successfully",
          });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//delete reservation
const deleteReservation = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const id = req.params.id;
      Reservation.findByIdAndDelete(id)
        .then((result) => {
          res
            .status(200)
            .json({ message: "Reservation deleted succesfully", status: true });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

module.exports = {
  getUserReservations,
  addReservation,
  deleteReservation,
};
