require("express-async-errors");

module.exports = () => {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
