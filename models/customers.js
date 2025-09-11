import mongoose from "mongoose";
import Joi from "joi";

// Create the DB schema and the model Class
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
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
});

export const Customer = mongoose.model("Customer", customerSchema);

export const validateCustomer = function (customer) {
  const scheme = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(4).required(),
    isGold: Joi.boolean(),
  });

  return scheme.validate(customer); // return {error, value}
};
