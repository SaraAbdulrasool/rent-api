const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    customerID: {
      type: Schema.ObjectId,
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
    dates: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
