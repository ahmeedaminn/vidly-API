import request from "supertest";
import { Genre } from "../../models/genres.js";
import { User } from "../../models/users.js";
import { app } from "../../index.js";
import mongoose from "mongoose";
import { exceptions } from "winston";

let server;

describe("/api/genres", () => {
  beforeAll(async () => {
    server = app.listen();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(async () => {
    await Genre.deleteMany({});
  });

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  // GET ALL
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.create([{ name: "genre1" }, { name: "genre2" }]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      // expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  // GET id
  describe("GET /", () => {
    it("should return genre with id if found", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      // const id = new mongoose.Types.ObjectId();
      // await Genre.collection.insertOne({ name: "genre1" , _id : id});

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(genre._id.toHexString());
    });

    it("should return 404 if id is not found", async () => {
      const id = new mongoose.Types.ObjectId();

      const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const invalidId = 1;

      const res = await request(server).get(`/api/genres/${invalidId}`);
      expect(res.status).toBe(400);
    });
  });

  describe("post /", () => {
    /*
      Define the happy path, and then in each test, we change
      one parameter that clearly aligns with the name of the test.
    */

    let token;
    let name;
    const execute = async () => {
      return await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should save new genre if it is valid", async () => {
      const res = await execute();
      const genre = await Genre.find({ name: name });

      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it("should return new genre if it is valid", async () => {
      const res = await execute();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should return 400 if genre is less than 5 chars", async () => {
      name = "1234";
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 chars", async () => {
      name = new Array(52).join("a");
      const res = await execute();

      expect(res.status).toBe(400);
    });
  });

  // PUT
  describe("PUT /", () => {
    let token;
    let name;
    let id;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "genre1";

      const genre = await Genre.create({ name });
      id = genre._id.toHexString();
    });

    const execute = (body = { name }) => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send(body);
    };

    it("should update genre name", async () => {
      const newName = "Genre updated";

      await execute({ name: newName });

      const genre = await Genre.findById(id);

      expect(genre.name).toBe(newName);
    });

    it("should return 200 if id is valid", async () => {
      const res = await execute();

      expect(res.status).toBe(200);
    });

    it("should return 400 if id is invalid", async () => {
      id = "a";

      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 400 if input data is invalid", async () => {
      const newName = "a";

      const res = await execute({ name: newName });

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is not found", async () => {
      id = new mongoose.Types.ObjectId().toHexString();

      const res = await execute();

      expect(res.status).toBe(404);
    });
  });

  // DELETE
  describe("DELETE /", () => {
    let token;
    let id;

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      const genre = await Genre.create({ name: "genre1" });
      id = genre._id.toHexString();
    });

    const execute = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token);
    };

    it("should delete genre if admin and id valid", async () => {
      const res = await execute();

      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();
    });

    it("should return 200 genre if id valid and admin", async () => {
      const res = await execute();

      expect(res.status).toBe(200);
    });

    it("should return 400 if id is invalid", async () => {
      id = "a";

      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 403 if not admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await execute();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is not found", async () => {
      id = new mongoose.Types.ObjectId().toHexString();

      const res = await execute();

      expect(res.status).toBe(404);
    });
  });
});
