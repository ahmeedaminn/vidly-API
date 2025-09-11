import { logger } from "../startup/logger.js";
export default function (err, req, res, next) {
  logger.error(err.message, err);

  // error > warn > info > http > verbose > debug > silly

  res.status(500).json({ err: "Something Failed" });
}
