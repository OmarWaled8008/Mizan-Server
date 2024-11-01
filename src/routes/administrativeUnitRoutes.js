const express = require("express");
const router = express.Router();
const adminUnitController = require("../controllers/AdministrativeUnitController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// Get all administrative units
router.get(
  "/all",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_administrative_units"]),
  loggingMiddleware,
  adminUnitController.getUnits
);

// Create a new administrative unit
router.post(
  "/create",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["create_administrative_units"]),
  loggingMiddleware,
  [body("name").notEmpty().withMessage("Name is required")],
  adminUnitController.createUnit
);

// Update an administrative unit
router.put(
  "/update/:unitId",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["edit_administrative_units"]),
  loggingMiddleware,
  [body("name").optional().notEmpty().withMessage("Name cannot be empty")],
  adminUnitController.updateUnit
);

// Delete an administrative unit
router.delete(
  "/delete/:unitId",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["delete_administrative_units"]),
  loggingMiddleware,
  adminUnitController.deleteUnit
);

module.exports = router;
