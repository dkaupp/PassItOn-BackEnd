module.exports = function () {
  if (!process.env.JWT_KEY) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
