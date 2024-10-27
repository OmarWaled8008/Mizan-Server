const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    console.error("Validation errors:", JSON.stringify(errorDetails, null, 2)); // Log errors in a pretty format
    return res.status(400).json({ errors: errorDetails });
  }
  next();
};

module.exports = validationMiddleware;
