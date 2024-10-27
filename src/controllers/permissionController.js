const Permission = require("../models/Permission");
const { validationResult } = require("express-validator");

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    // Fetch all permissions
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Error fetching permissions" });
  }
};
