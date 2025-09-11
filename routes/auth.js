import express from "express";
import { User } from "../models/users.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import Joi from "joi";
import { validate } from "../middleware/validate.js";
const router = express.Router();

const validateAuth = function (req) {
  const scheme = Joi.object({
    email: Joi.string().min(4).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return scheme.validate(req); // return {err, value}
};

// POST
router.post("/", validate(validateAuth), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = user.generateAuthToken();

  res.send(token);
});

export default router;
