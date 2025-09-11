import express from "express";
import { validateGenre, Genre } from "../models/genres.js";
import { exist } from "../middleware/exist.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

// Get alls
router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres.");
  const genres = await Genre.find();
  res.send(genres);
});

// Get with id
router.get("/:id", validateObjectId, exist(Genre), async (req, res) => {
  // check if genre with id exist, if not throw error
  // if exist send it Done with Middleware

  const genre = req.doc;

  res.send(genre);
});

// Post
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  // validate the input

  // create genre if valid
  const genre = new Genre({ name: req.body.name });

  // push into db
  await genre.save();

  // send the genre
  res.send(genre);
});

router.put(
  "/:id",
  [auth, validate(validateGenre), validateObjectId, exist(Genre)],
  async (req, res) => {
    // check if genre with id exist, if not throw error
    // if exist send it Done with Middleware

    req.doc.name = req.body.name;
    await req.doc.save();
    // const genre = await Genre.findByIdAndUpdate(
    //   req.params.id,
    //   { name: req.body.name },
    //   { new: true }
    // );

    // send the new update and assign the value
    res.send(req.doc);
  }
);

router.delete(
  "/:id",
  [auth, admin],
  validateObjectId,
  exist(Genre),
  async (req, res) => {
    // check if genre with id exist, if not throw error
    // if exist send it Done with Middleware

    const genre = req.doc;
    await genre.deleteOne();

    // Delete data from db
    // const genre = await Genre.findByIdAndDelete(req.params.id);
    res.send({
      message: "genre deleted SUCCESSFULLY",
      deleted: genre,
    });
  }
);

export default router;
