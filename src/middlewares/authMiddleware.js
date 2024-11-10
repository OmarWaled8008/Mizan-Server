const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user in authenticate:", req.user);
    next();
  } catch (error) {
    console.error("Invalid token error:", error);
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
