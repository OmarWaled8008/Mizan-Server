// src/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/ExpenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for expense management

// Create a new expense
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_expenses"]),
  [
    body("title").notEmpty().withMessage("Expense title is required"),
    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("cycle").notEmpty().withMessage("Cycle is required"),
  ],
  expenseController.createExpense
);

// Get all expenses
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_expenses"]),
  expenseController.getExpenses
);

// Update an expense by ID
router.put(
  "/:expenseId",
  authMiddleware,
  permissionMiddleware(["edit_expenses"]),
  [
    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
  ],
  expenseController.updateExpense
);

// Delete an expense by ID
router.delete(
  "/:expenseId",
  authMiddleware,
  permissionMiddleware(["delete_expenses"]),
  expenseController.deleteExpense
);

module.exports = router;
