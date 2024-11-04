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
  permissionMiddleware(["expense_view"]), // Updated permission to match the new structure
  loggingMiddleware,
  expenseController.getExpenses
);

// Create a new expense
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["expense_create"]), // Updated permission to match the new structure
  loggingMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("date").isISO8601().withMessage("Date must be in a valid format"),
    body("administrativeUnit")
      .notEmpty()
      .withMessage("Administrative Unit is required"),
  ],
  expenseController.createExpense
);

// Update an expense
router.put(
  "/update/:expenseId",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["expense_edit"]), // Updated permission to match the new structure
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
  permissionMiddleware(["expense_delete"]), // Updated permission to match the new structure
  loggingMiddleware,
  expenseController.deleteExpense
);

module.exports = router;
