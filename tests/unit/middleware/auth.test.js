import dotenv from "dotenv";
dotenv.config();
import { User } from "../../../models/users";
import { auth } from "../../../middleware/auth";
import { expect, jest } from "@jest/globals";
import mongoose from "mongoose";

describe("auth middleware", () => {
  it("should populate the req.user with the payload of a valid JWT", () => {
    // payload
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    // token
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
    expect(next).toHaveBeenCalled(); // middleware should call next
  });
});
