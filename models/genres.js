import Joi from "joi";
import mongoose from "mongoose";

export const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

export const Genre = mongoose.model("Genre", genreSchema);

export const validateGenre = function (genre) {
  const scheme = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return scheme.validate(genre); // return {err, value}
};
