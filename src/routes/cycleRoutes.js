// src/routes/cycleRoutes.js
const express = require("express");
const router = express.Router();
const cycleController = require("../controllers/CycleController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for cycle management

// Create a new cycle
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_cycles"]),
  [
    body("name").notEmpty().withMessage("Cycle name is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("budget").notEmpty().withMessage("Budget is required"),
  ],
  cycleController.createCycle
);

// Get all cycles
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_cycles"]),
  cycleController.getCycles
);

// Update a cycle by ID
router.put(
  "/:cycleId",
  authMiddleware,
  permissionMiddleware(["edit_cycles"]),
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Cycle name cannot be empty"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
  ],
  cycleController.updateCycle
);

// Delete a cycle by ID
router.delete(
  "/:cycleId",
  authMiddleware,
  permissionMiddleware(["delete_cycles"]),
  cycleController.deleteCycle
);

module.exports = router;
