import dotenv from "dotenv";
dotenv.config();
import { User } from "../../../models/users.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    expect(decoded).toMatchObject(payload);
  });
});
