import express from "express";
import {} from "../middleware/async.js";
import { auth } from "../middleware/auth.js";
import { Customer } from "../models/customers.js";
import { Movie } from "../models/movies.js";
import { validateRental, Rental } from "../models/rental.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const rental = await Rental.find();
  res.send(rental);
});

// POST
router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Movie not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  // Decrement stock atomically
  await Movie.findByIdAndUpdate(movie._id, { $inc: { numberInStock: -1 } });

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      numberInStock: movie.numberInStock - 1,
      dailyRentalRate: movie.dailyRentalRate,
    },
    rentalFee: req.body.rentalFee,
  });

  await rental.save();

  res.send(rental);
});

export default router;
