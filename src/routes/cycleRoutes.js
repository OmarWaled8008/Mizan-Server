const express = require("express");
const router = express.Router();
const cycleController = require("../controllers/CycleController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// Get all cycles
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["cycle_view"]), // Updated permission
  loggingMiddleware,
  cycleController.getCycles
);

// Create a new cycle
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["cycle_create"]), // Updated permission
  loggingMiddleware,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("startDate")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate").isISO8601().withMessage("End date must be a valid date"),
    body("budget").notEmpty().withMessage("Budget ID is required"),
  ],
  cycleController.createCycle
);

// Update a cycle
router.put(
  "/update/:cycleId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["cycle_edit"]), // Updated permission
  loggingMiddleware,
  [
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
  ],
  cycleController.updateCycle
);

// Delete a cycle
router.delete(
  "/delete/:cycleId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["cycle_delete"]), // Updated permission
  loggingMiddleware,
  cycleController.deleteCycle
);

module.exports = router;
