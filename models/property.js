const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    ownerID: {
      type: Schema.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    furnish: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    livingrooms: {
      type: Number,
      required: true,
    },
    kitchen: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    parking: {
      type: Number,
      required: true,
    },
    balcony: {
      type: String,
      required: true,
    },
    ownerPhoneNumber: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    reservedDates: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
