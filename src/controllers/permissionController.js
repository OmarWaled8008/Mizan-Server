const Permission = require("../models/Permission");

// جلب جميع الصلاحيات
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Error fetching permissions" });
  }
};

