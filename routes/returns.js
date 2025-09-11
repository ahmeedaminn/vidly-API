import express from "express";
import { auth } from "../middleware/auth.js";
import { Rental } from "../models/rental.js";
import { Movie } from "../models/movies.js";
import Joi from "joi";
import { objectId } from "../models/idValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

const validateReturn = function (req) {
  const scheme = Joi.object({
    customerId: objectId().required(),
    movieId: objectId().required(),
  });
  return scheme.validate(req);
};

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res
      .status(404)
      .json({ error: "No rental with this cutomerId or movieId " });

  if (rental.dateReturned)
    return res.status(400).json({ error: "Rental alredy processed" });

  rental.return();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  rental.movie.numberInStock += 1;

  // const movie = await Movie.findById(rental.movie._id);
  // movie.numberInStock++;

  await rental.save();

  return res.send(rental);
});

export default router;
