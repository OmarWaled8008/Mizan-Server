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
  permissionMiddleware(["administrative_unit_view"]), // Updated permission
  loggingMiddleware,
  adminUnitController.getUnits
);

// Create a new administrative unit
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["administrative_unit_create"]), // Updated permission
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
  permissionMiddleware(["administrative_unit_edit"]), // Updated permission
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
  permissionMiddleware(["administrative_unit_delete"]), // Updated permission
  loggingMiddleware,
  [param("unitId").isMongoId().withMessage("Invalid unit ID")],
  adminUnitController.deleteUnit
);

module.exports = router;
