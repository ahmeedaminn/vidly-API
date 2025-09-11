import mongoose from "mongoose";
import Joi from "joi";

export const objectId = function () {
  return Joi.string().custom((value, helpers) => {
    mongoose.Types.ObjectId.isValid(value)
      ? value
      : helpers.error("any.invalid"),
      "Objected Validation";
  });
};
