import mongoose from "mongoose";
import Joi from "joi";
import moment from "moment";
import { objectId } from "./idValidator.js";

const rentalSchema = new mongoose.Schema({
  customer: {
    _id: { type: mongoose.Types.ObjectId, ref: "Customer", required: true },
    name: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    phone: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  },
  movie: {
    _id: { type: mongoose.Types.ObjectId, ref: "Movie", required: true },
    title: String,
    numberInStock: Number,
    dailyRentalRate: Number,
  },
  dateOut: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  dateReturned: Date,
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

export const Rental = mongoose.model("Rental", rentalSchema);

export const validateRental = function (rental) {
  const scheme = Joi.object({
    customerId: objectId().required(), // customer ID
    movieId: objectId().required(), // movie ID
  });

  return scheme.validate(rental); // return {error, value}
};
