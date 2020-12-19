const mongoose = require("mongoose");
const logger = require("../config/logger");

module.exports = function () {
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => logger.info("MongoDB conected..."));
};
