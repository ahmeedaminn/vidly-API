import Joi from "joi";
import mongoose from "mongoose";
import { genreSchema } from "./genres.js";
import { objectId } from "./idValidator.js";

export const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 50,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

export const Movie = mongoose.model("Movie", moviesSchema);

export const validateMovie = function (genre) {
  const scheme = Joi.object({
    title: Joi.string().min(1).required(),
    genreId: objectId(),
    genreName: Joi.string().min(1),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  }).xor("genreId", "genreName");

  return scheme.validate(genre); // return {err, value}
};
