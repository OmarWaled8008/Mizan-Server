// src/routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/BudgetController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for budget management

// Create a new budget
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_budgets"]),
  [
    body("administrativeUnit")
      .notEmpty()
      .withMessage("Administrative unit is required"),
    body("fiscalYear").isInt().withMessage("Valid fiscal year is required"),
    body("initialAmount")
      .isFloat({ min: 0 })
      .withMessage("Initial amount must be a positive number"),
  ],
  budgetController.createBudget
);

// Get all budgets
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_budgets"]),
  budgetController.getBudgets
);

// Update a budget by ID
router.put(
  "/:budgetId",
  authMiddleware,
  permissionMiddleware(["edit_budgets"]),
  [
    body("initialAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Initial amount must be a positive number"),
  ],
  budgetController.updateBudget
);

// Delete a budget by ID
router.delete(
  "/:budgetId",
  authMiddleware,
  permissionMiddleware(["delete_budgets"]),
  budgetController.deleteBudget
);

module.exports = router;
