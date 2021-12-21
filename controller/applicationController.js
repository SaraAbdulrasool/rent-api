const mongoose = require("mongoose");
const Application = require("../models/application.js");

//database connection string
const dbURL =
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

//gets all applications
const getApplications = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Application.aggregate([
        {
          $lookup: {
            from: "properties",
            localField: "propertyID",
            foreignField: "_id",
            as: "property",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "ownerID",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerID",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: "$property" },
        { $unwind: "$owner" },
        { $unwind: "$customer" },
      ])
        .then((result) => {
          res.status(200).json({
            message: "Applications retrieved successfully",
            applications: result,
          });
        })
        .catch((err) => res.status(400).json({ messages: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//ge user applications
const getUserApplications = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Application.aggregate([
        { $match: { ownerID: mongoose.mongo.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "properties",
            localField: "propertyID",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: "$property" },
        {
          $lookup: {
            from: "users",
            localField: "customerID",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ])
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "User applications retrieved successfully",
            applications: result,
          });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//ge customer applications
const getCustomerApplications = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log("idd" + req);
      Application.aggregate([
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
        {
          $lookup: {
            from: "users",
            localField: "customerID",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ])
        .exec()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: "Customer applications retrieved successfully",
            applications: result,
          });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//add new application
const addApplication = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log(req.body);
      const app = new Application(req.body);
      app
        .save()
        .then((result) => {
          res.status(200).json({ message: "Application added successfully" });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//update applications
const updateApplication = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const id = req.params.id;
      console.log(req.body.status);
      Application.findByIdAndUpdate(id, { status: req.body.status })
        .then((result) => {
          res.status(200).json({ message: "Application updated successfully" });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

module.exports = {
  getApplications,
  getUserApplications,
  getCustomerApplications,
  addApplication,
  updateApplication,
};
