// src/routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/BudgetController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// Get all budgets
router.get(
  "/all",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_budgets"]),
  loggingMiddleware,
  budgetController.getAllBudgets
);

// Create a new budget
router.post(
  "/create",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["create_budgets"]),
  loggingMiddleware,
  [
    body("administrativeUnit")
      .notEmpty()
      .withMessage("Administrative Unit is required"),
    body("fiscalYear").notEmpty().withMessage("Fiscal Year is required"),
    body("initialAmount")
      .isNumeric()
      .withMessage("Initial Amount must be a number"),
  ],
  budgetController.createBudget
);

// Update a budget
router.put(
  "/update/:id",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["edit_budgets"]),
  loggingMiddleware,
  [
    body("initialAmount")
      .optional()
      .isNumeric()
      .withMessage("Initial Amount must be a number"),
  ],
  budgetController.updateBudget
);

// Delete a budget
router.delete(
  "/delete/:id",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["delete_budgets"]),
  loggingMiddleware,
  budgetController.deleteBudget
);

module.exports = router;
