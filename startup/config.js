import dotenv from "dotenv";
dotenv.config();

export default function () {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("Fatal Error: jwtPrivateKey is not defined");
  }
}
