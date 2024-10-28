// src/middlewares/roleAssignmentMiddleware.js
const Role = require("../models/Role");

const roleAssignmentMiddleware = async (req, res, next) => {
  try {
    let role = req.body.role || "موظف"; // default role

    const foundRole = await Role.findOne({ name: role });

    if (!foundRole) {
      return res
        .status(400)
        .json({ error: `Role ${role} not found in the system` });
    }

    req.body.role = foundRole._id;
    next();
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ error: "Error assigning role" });
  }
};

module.exports = roleAssignmentMiddleware;
