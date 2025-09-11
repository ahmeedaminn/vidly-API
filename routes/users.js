import express from "express";
import { auth } from "../middleware/auth.js";
import { validateUser, User } from "../models/users.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import { validate } from "../middleware/validate.js";
const router = express.Router();

// GET Current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// POST
router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ error: "The USER is already EXIST" });

  // the mongoose transform Method // id need to pass some id from another model or data use
  // the spreading method for all data in req.body then the other properties {...req.body, ex: ex._id}
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(user);
});

export default router;

// POST Create New User:
// lodash Method
// user = new User(_.pick(req.body, ["name", "email", "password"]));

// Destructure Method
// const { name, email, password } = req.body;
// user = new User({ name, email, password });
// const { _id } = user;
// user = { _id, name, email };

/*
  🚪 What does “logout” mean here?

  Since the server does not track sessions:

  There is nothing to "delete" on the server side.

  Logout is simply removing the token on the client side.

  localStorage.removeItem("token"); 
// or sessionStorage.removeItem("token")
*/
