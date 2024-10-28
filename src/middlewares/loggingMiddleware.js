// src/middlewares/loggingMiddleware.js
const loggingMiddleware = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${
      req.originalUrl
    } by user: ${req.user ? req.user._id : "Guest"}`
  );
  next();
};

module.exports = loggingMiddleware;
