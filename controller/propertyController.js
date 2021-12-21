const mongoose = require("mongoose");
const Property = require("../models/property");
// import entire SDK
var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();

//database connection string
const dbURL =
  "mongodb+srv://sara:A.s771717@nodetust.aqqsz.mongodb.net/rent-property?retryWrites=true&w=majority";

// get all properties
const getProperties = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Property.find()
        .then((result) => {
          res.status(200).json({
            message: "Properties retrieved successfully",
            properties: result,
          });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

// get all properties for admin
const getPropertiesWithOwners = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Property.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "ownerID",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ])
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Properties retrieved successfully",
            properties: result,
          });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//get owner properties
const getOwnerProperties = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Property.find({ ownerID: req.params.id })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "User properties retrieved successfully",
            properties: result,
          });
        })
        .catch(
          (err) => res.status(400).json({ message: err.message }),
          console.log(err.message)
        )
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

// add new property
const addProperty = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const property = new Property(req.body);
      property
        .save()
        .then((result) => {
          res.status(201).json({ message: "User added successfully" });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//add property images
const addPropertyImages = async (req, res) => {
  const files = req.files;
  try {
    let data = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: "rent-property-images",
          Key: `${file.originalname}`,
          Body: file.buffer,
        };
        const d = await s3.upload(params).promise();
        return {
          image: d.Location,
          name: file.originalname,
        };
      })
    );
    return res.send({ data });
  } catch (err) {
    console.log(err);
    return res.send({
      message: err.message,
    });
  }
};

//update property
const updateProperty = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      const id = req.body.id;
      console.log(req.body);
      Property.findByIdAndUpdate(id, req.body)
        .then((result) => {
          res.status(200).json({ message: "Property updated successfully" });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

//cehck property reserved dates
const getProperty = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      Property.findOne({ _id: req.params.id })
        .then((result) => {
          res.status(200).json({
            message: "Property retrieved successfully",
            property: result,
          });
        })
        .catch((err) => res.status(400).json({ message: err }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => res.status(400).json({ message: err }));
};

//add, delete reserved dates
const updateDates = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (result) => {
      const id = req.params.id;
      // add dates
      if (req.body.type === "addDates") {
        Property.findByIdAndUpdate(id, {
          $push: { reservedDates: req.body.reservedDates },
        })
          .then((result) => {
            res.status(200).json({
              message:
                "Dates added successfully to the property reserved dates",
            });
          })
          .catch((err) => res.status(400).json({ message: err.message }))
          .finally(() => mongoose.connection.close());
      }
      // delete dates
      else if (req.body.type === "deleteDates") {
        Property.findByIdAndUpdate(id, {
          reservedDates: req.body.reservedDates,
        })
          .then((result) => {
            res.status(200).json({
              message:
                "Dates deleted successfully from property reserved dates",
              status: true,
            });
          })
          .catch((err) => res.status(400).json({ message: err.message }))
          .finally(() => mongoose.connection.close());
      }
    })
    .catch((err) => console.log(err.message));
};

//delete property
const deleteProperty = (req, res) => {
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((reult) => {
      const id = req.params.id;
      Property.findByIdAndDelete(id)
        .then((result) => {
          res.status(200).json({ message: "Property deleted successfully" });
        })
        .catch((err) => res.status(400).json({ message: err.message }))
        .finally(() => mongoose.connection.close());
    })
    .catch((err) => console.log(err.message));
};

module.exports = {
  getOwnerProperties,
  getProperties,
  getPropertiesWithOwners,
  addProperty,
  addPropertyImages,
  updateProperty,
  getProperty,
  updateDates,
  deleteProperty,
};
