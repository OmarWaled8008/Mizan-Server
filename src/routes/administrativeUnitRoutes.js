const express = require("express");
const router = express.Router();
const {
  createUnit,
  getUnits,
  getUnit,
  updateUnit,
  deleteUnit,
  getUnitsHierarchy,
} = require("../controllers/AdministrativeUnitController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkUnitAccess = require("../middlewares/checkUnitAccess");

// Routes
router.post("/", authMiddleware, createUnit);
router.get("/", authMiddleware, getUnits);
router.get("/hierarchy", authMiddleware, getUnitsHierarchy);
router.get("/:unitId", authMiddleware, checkUnitAccess, getUnit);
router.put("/:unitId", authMiddleware, checkUnitAccess, updateUnit);
router.delete("/:unitId", authMiddleware, checkUnitAccess, deleteUnit);

module.exports = router;
