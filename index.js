require("dotenv").config();
const express = require("express");
const config = require("config");
const logger = require("./config/logger");

const app = express();

require("./startup/logging");
require("./startup/db")();
require("./startup/config")();
require("./startup/validation");
require("./startup/prod")(app);
require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");
app.listen(port, () => logger.info(`Server started on port ${port}...`));
