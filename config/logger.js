const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple()
      ),
    }),
    new transports.MongoDB({
      level: "error",
      db: process.env.DB,
      options: { useUnifiedTopology: true },
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.metadata()
      ),
    }),
  ],
  exceptionHandlers: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.metadata()
      ),
    }),
    new transports.MongoDB({
      db: process.env.DB,
      options: { useUnifiedTopology: true },
      format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata()
      ),
    }),
  ],
});

module.exports = logger;
