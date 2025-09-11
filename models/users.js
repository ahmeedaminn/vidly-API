import Joi from "joi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  // jwt.sign(payload, privateKey, optional expire)
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
};

// 👇 automatically remove sensitive fields when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);

export const validateUser = function (user) {
  const scheme = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(4).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return scheme.validate(user); // return {err, value}
};
