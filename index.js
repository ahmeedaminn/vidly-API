import express from "express";
import { logger } from "./startup/logger.js";
import checkConfig from "./startup/config.js";
import db from "./startup/db.js";
import prod from "./startup/prod.js";
const routes = await import("./startup/routes.js");

const app = express();
checkConfig();
db();
prod(app);
routes.default(app);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening to port ${port}`));

export { app };
