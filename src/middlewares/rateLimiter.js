// src/middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => (req.user && req.user.role.name === "Admin" ? 200 : 100), // Higher limit for admins
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res, next, options) => {
    console.error(`Rate limit exceeded: ${req.ip} - ${req.method} ${req.url}`);
    res.status(429).json({ message: options.message });
  },
});

module.exports = rateLimiter;
