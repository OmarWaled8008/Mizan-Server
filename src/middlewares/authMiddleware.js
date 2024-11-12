const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        req.user = { id: admin._id, role: "admin" };
        console.log("Authenticated as Admin:", req.user);
      } else {
        console.log("Admin not found");
        return res.status(403).json({ error: "Admin not found" });
      }
    } else {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = { id: user._id, role: "user" };
        console.log("Authenticated as User:", req.user);
      } else {
        console.log("User not found");
        return res.status(403).json({ error: "User not found" });
      }
    }
    next();
  } catch (error) {
    console.error("Invalid token error:", error);
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
