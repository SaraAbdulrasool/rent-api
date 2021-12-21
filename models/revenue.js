const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    ownerID: {
      type: Schema.ObjectId,
      required: true,
    },
    propertyID: {
      type: Schema.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", userSchema);
module.exports = Revenue;
