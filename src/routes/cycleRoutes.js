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
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_cycles"]),
  loggingMiddleware,
  cycleController.getCycles
);

// Create a new cycle
router.post(
  "/create",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["create_cycles"]),
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
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["edit_cycles"]),
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
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["delete_cycles"]),
  loggingMiddleware,
  cycleController.deleteCycle
);

module.exports = router;
