// src/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/ExpenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");

const { body } = require("express-validator");

// Get all expenses
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["view_expenses"]),
  loggingMiddleware,
  expenseController.getExpenses
);

// Create a new expense
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["create_expenses"]),
  loggingMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("date").isISO8601().withMessage("Date must be in a valid format"),
  ],
  expenseController.createExpense
);

// Update an expense
router.put(
  "/update/:expenseId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["edit_expenses"]),
  loggingMiddleware,
  [
    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number"),
  ],
  expenseController.updateExpense
);

// Delete an expense
router.delete(
  "/delete/:expenseId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["delete_expenses"]),
  loggingMiddleware,
  expenseController.deleteExpense
);

module.exports = router;
