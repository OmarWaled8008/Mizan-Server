const Role = require("../models/Role");

const roleAssignmentMiddleware = async (req, res, next) => {
  try {
    if (req.body.role) {
      const validRole = await Role.findById(req.body.role);
      if (!validRole) {
        console.error(`Invalid role ID: ${req.body.role}`);
        return res.status(400).json({ message: "Invalid role provided" });
      }
    } else {
      const defaultRole = await Role.findOne({ name: "موظف" });
      req.body.role = defaultRole ? defaultRole._id : null; // Handle case where default role is not found
    }
    next();
  } catch (error) {
    console.error("Role assignment error:", error);
    res.status(500).json({ message: "Error assigning role" });
  }
};

module.exports = roleAssignmentMiddleware;
