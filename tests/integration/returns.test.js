import request from "supertest";
import { app } from "../../index.js";
import mongoose from "mongoose";
import { Rental } from "../../models/rental";
import { User } from "../../models/users.js";
import { Movie } from "../../models/movies.js";
import moment from "moment";

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  beforeEach(async () => {
    server = app.listen();
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "john wick",
      dailyRentalRate: 2,
      genre: { name: "comdy" },
      numberInStock: 1,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "ahmed",
        phone: "01112116902",
      },
      movie: {
        _id: movieId,
        title: "john wick",
        dailyRentalRate: 2,
        numberInStock: 1,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    await Movie.deleteMany({});
    await Rental.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const execute = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  it("should return 401 is cliend is not logged in", async () => {
    token = "";
    const res = await execute({ customerId, movieId });

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await execute({ movieId });

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await execute({ customerId });
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    const res = await execute({ customerId, movieId });

    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await execute({ customerId, movieId });

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const res = await execute({ customerId, movieId });

    expect(res.status).toBe(200);
  });

  it("should set the return date if input is valid", async () => {
    await execute({ customerId, movieId });

    const rentalInDb = await Rental.findById(rental._id);

    const diff = moment().diff(rentalInDb.dateReturned, "seconds");

    expect(diff).toBeLessThan(10);
  });

  it("should calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    await execute({ customerId, movieId });

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the stock when return movie", async () => {
    let stockBefore = movie.numberInStock;

    await execute({ customerId, movieId });

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(stockBefore + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await execute({ customerId, movieId });

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});

// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// set the return date
// calculate the rental fee
// Increase the stock
// return the rental
