const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    customerID: {
      type: Schema.ObjectId,
      required: true,
    },
    propertyID: {
      type: Schema.ObjectId,
      required: true,
    },
    ownerID: {
      type: Schema.ObjectId,
      required: true,
    },
    dates: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
