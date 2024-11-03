// src/routes/administrativeUnitRoutes.js
const express = require("express");
const router = express.Router();
const adminUnitController = require("../controllers/AdministrativeUnitController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body, param } = require("express-validator");

// Get all administrative units
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["view_administrative_units"]),
  loggingMiddleware,
  adminUnitController.getUnits
);

// Create a new administrative unit
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["create_administrative_units"]),
  loggingMiddleware,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("parentUnit")
      .optional()
      .isMongoId()
      .withMessage("Invalid parent unit ID"),
    body("manager").optional().isMongoId().withMessage("Invalid manager ID"),
  ],
  adminUnitController.createUnit
);

// Update an administrative unit
router.put(
  "/update/:unitId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["edit_administrative_units"]),
  loggingMiddleware,
  [
    param("unitId").isMongoId().withMessage("Invalid unit ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("parentUnit")
      .optional()
      .isMongoId()
      .withMessage("Invalid parent unit ID"),
    body("manager").optional().isMongoId().withMessage("Invalid manager ID"),
  ],
  adminUnitController.updateUnit
);

// Delete an administrative unit
router.delete(
  "/delete/:unitId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["delete_administrative_units"]),
  loggingMiddleware,
  [param("unitId").isMongoId().withMessage("Invalid unit ID")],
  adminUnitController.deleteUnit
);

module.exports = router;
