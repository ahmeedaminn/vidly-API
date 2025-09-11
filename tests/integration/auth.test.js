import request from "supertest";
import { User } from "../../models/users.js";
import { Genre } from "../../models/genres";
import { app } from "../../index.js";
import mongoose from "mongoose";
import { Movie } from "../../models/movies.js";

describe("auth middleware", () => {
  let server;
  beforeEach(async () => {
    server = app.listen();
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    // clean up all test data
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  describe("Genre", () => {
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    const execute = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });
    };

    it("should return 401 if no token is provided or client is not logged in", async () => {
      token = "";

      const res = await execute();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token", async () => {
      token = "a";

      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid token", async () => {
      const res = await execute();

      expect(res.status).toBe(200);
    });
  });
});

/*
  import request from "supertest";
import { User } from "../../models/users.js";
import { Genre } from "../../models/genres.js";
import { Movie } from "../../models/movies.js"; // Import other models as needed
import { app } from "../../index.js";
import mongoose from "mongoose";

describe("auth middleware", () => {
  let server;

  beforeEach(async () => {
    server = app.listen();
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    // Clean up all test data
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  // Dynamic test configuration
  const protectedEndpoints = [
    {
      name: "Genres",
      endpoint: "/api/genres",
      method: "post",
      payload: { name: "test-genre" },
      cleanup: () => Genre.deleteMany({})
    },
    {
      name: "Movies", 
      endpoint: "/api/movies",
      method: "post",
      payload: { title: "Test Movie", genre: "Action" },
      cleanup: () => Movie.deleteMany({})
    },
    // Add more endpoints as needed
    // {
    //   name: "Users",
    //   endpoint: "/api/users",
    //   method: "post", 
    //   payload: { name: "Test User", email: "test@test.com" },
    //   cleanup: () => User.deleteMany({ email: "test@test.com" })
    // }
  ];

  // Generate tests for each endpoint dynamically
  protectedEndpoints.forEach(({ name, endpoint, method, payload }) => {
    describe(`${name} API`, () => {
      let token;

      beforeEach(() => {
        token = new User().generateAuthToken();
      });

      const execute = async () => {
        const requestMethod = request(server)[method.toLowerCase()];
        return await requestMethod(endpoint)
          .set("x-auth-token", token)
          .send(payload);
      };

      it(`should return 401 if no token is provided for ${endpoint}`, async () => {
        token = "";
        const res = await execute();
        expect(res.status).toBe(401);
      });

      it(`should return 400 if invalid token for ${endpoint}`, async () => {
        token = "invalid-token";
        const res = await execute();
        expect(res.status).toBe(400);
      });

      it(`should return 200 if valid token for ${endpoint}`, async () => {
        const res = await execute();
        expect(res.status).toBe(200);
      });
    });
  });
});

*/
