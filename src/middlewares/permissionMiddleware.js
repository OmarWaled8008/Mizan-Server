const User = require("../models/User");

const checkPermission = (permissionName) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.id || !req.user.role) {
      console.log("User not authenticated in checkPermission");
      return res.status(403).json({ error: "User not authenticated" });
    }

    const { id: userId, role: userRole } = req.user;

    if (userRole === "admin") {
      console.log("Access granted: Admin user, bypassing permission check");
      return next();
    }

    const user = await User.findById(userId).populate("permissions");
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const hasPermission = user.permissions.some(
      (permission) => permission.name === permissionName
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }

    next();
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ error: "Error checking permission" });
  }
};

module.exports = checkPermission;
