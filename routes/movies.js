import express from "express";
import { exist } from "../middleware/exist.js";
import { auth } from "../middleware/auth.js";
import { validateMovie, Movie } from "../models/movies.js";
import { validate } from "../middleware/validate.js";
import { Genre } from "../models/genres.js";
const router = express.Router();

1;
// GET all
router.get("/", async (req, res) => {
  const movie = await Movie.find();
  res.send(movie);
});

// GET by id
router.get("/:id", exist(Movie), async (req, res) => {
  // Check existance with the middleware

  const movie = await Movie.findById(req.params.id);

  res.send(movie);
});

// POST
router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  let genre;

  if (req.body.genreId) {
    genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).json({ error: "Genre not found by ID" });
  }

  if (req.body.genreName) {
    genre = await Genre.findOne({ name: req.body.genreName });
    if (!genre)
      return res.status(400).json({ error: "Genre not found by name" });
  }

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();

  res.send(movie);
});

// PUT
router.put(
  "/:id",
  [auth, validate(validateMovie), exist(Movie)],
  async (req, res) => {
    let genre;

    if (req.body.genreId) {
      genre = await Genre.findById(req.body.genreId);
      if (!genre)
        return res.status(400).json({ error: "Genre not found by ID" });
    }

    if (req.body.genreName) {
      genre = await Genre.findOne({ name: req.body.genreName });
      if (!genre)
        return res.status(400).json({ error: "Genre not found by name" });
    }

    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: req.body.genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );

    res.send(updated);
  }
);

// DELETE
router.delete("/:id", auth, exist(Movie), async (req, res) => {
  // Check existance with the middleware

  const movie = await Movie.findByIdAndDelete(req.params.id);
  const movies = await Movie.find();

  res.send({
    message: "Movie deleted SUCCESSFULLY",
    deleted: movie,
    movies,
  });
});

export default router;
