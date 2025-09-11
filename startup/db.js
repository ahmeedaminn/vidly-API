import mongoose from "mongoose";
import { logger } from "./logger.js";
import dotenv from "dotenv";
dotenv.config();

export default function () {
  // Determine the environment
  const dbConnection =
    process.env.NODE_ENV === "test"
      ? process.env.DB_NAME_TEST
      : process.env.DB_NAME;

  // Check the connection
  if (!dbConnection) {
    logger.error(
      "Database connection string not found in environment variables."
    );
    process.exit(1);
  }

  mongoose
    .connect(dbConnection)
    .then(() => logger.info(`Connected to ${dbConnection}`))
    .catch((err) => logger.error(err));
}
