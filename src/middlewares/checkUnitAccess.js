const getSubordinateUnits = require("../utils/getSubordinateUnits");
const User = require("../models/User");

const checkUnitAccess = async (req, res, next) => {
  try {
    // التحقق من وجود `req.user` و `id`
    if (!req.user || !req.user.id) {
      console.error("Error: req.user or req.user.id not found", req.user);
      return res.status(403).json({ error: "Access denied: User not found" });
    }

    const userId = req.user.id;
    const unitId = req.params.unitId || req.body.unitId;

    // السماح بالوصول إذا كان الدور "admin"
    if (req.user.role === "admin") {
      console.log("Admin access granted for operation");
      return next();
    }

    // البحث عن بيانات المستخدم والوحدة
    const user = await User.findById(userId).populate("unit");
    if (!user) {
      console.error("Error: User not found in database");
      return res.status(403).json({ error: "Access denied: User not found" });
    }

    if (!user.unit) {
      console.error("Error: User does not have an associated unit");
      return res
        .status(403)
        .json({ error: "Access denied: No associated unit" });
    }

    const accessibleUnits = await getSubordinateUnits(user.unit._id);
    accessibleUnits.push(user.unit._id.toString());

    if (!accessibleUnits.includes(unitId)) {
      console.error("Error: Access denied to this unit", {
        requestedUnitId: unitId,
      });
      return res.status(403).json({ error: "Access denied to this unit" });
    }

    next();
  } catch (error) {
    console.error("Error in checkUnitAccess middleware:", error);
    res.status(500).json({ error: "Error verifying unit access" });
  }
};

module.exports = checkUnitAccess;
