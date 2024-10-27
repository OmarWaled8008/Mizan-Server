// src/routes/administrativeUnitRoutes.js
const express = require("express");
const router = express.Router();
const administrativeUnitController = require("../controllers/AdministrativeUnitController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for administrative unit management

// Create a new administrative unit
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_administrative_units"]),
  [body("name").notEmpty().withMessage("Unit name is required")],
  administrativeUnitController.createUnit
);

// Get all administrative units
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_administrative_units"]),
  administrativeUnitController.getUnits
);

// Update an administrative unit by ID
router.put(
  "/:unitId",
  authMiddleware,
  permissionMiddleware(["edit_administrative_units"]),
  [body("name").optional().notEmpty().withMessage("Unit name cannot be empty")],
  administrativeUnitController.updateUnit
);

// Delete an administrative unit by ID
router.delete(
  "/:unitId",
  authMiddleware,
  permissionMiddleware(["delete_administrative_units"]),
  administrativeUnitController.deleteUnit
);

module.exports = router;
