const errorMiddleware = (err, req, res, next) => {
  console.error("Error occurred:", err); // Log the error
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};

module.exports = errorMiddleware;
