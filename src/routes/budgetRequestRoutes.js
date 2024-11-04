const express = require("express");
const router = express.Router();
const budgetRequestController = require("../controllers/budgetRequestController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// Get all budget requests
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_view"]), // Updated permission
  loggingMiddleware,
  budgetRequestController.getAllBudgetRequests
);

// Get a single budget request by ID
router.get(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_view"]), // Updated permission
  loggingMiddleware,
  budgetRequestController.getBudgetRequestById
);

// Create a new budget request
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_create"]), // Updated permission
  loggingMiddleware,
  [
    body("fiscalYear").notEmpty().withMessage("Fiscal year is required"),
    body("initialAmount")
      .isNumeric()
      .withMessage("Initial amount must be a number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("administrativeUnit")
      .notEmpty()
      .withMessage("Administrative unit is required"),
  ],
  budgetRequestController.createBudgetRequest
);

// Update a budget request
router.put(
  "/update/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_edit"]), // Updated permission
  loggingMiddleware,
  [
    body("fiscalYear")
      .optional()
      .notEmpty()
      .withMessage("Fiscal year is required"),
    body("initialAmount")
      .optional()
      .isNumeric()
      .withMessage("Initial amount must be a number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("administrativeUnit")
      .optional()
      .notEmpty()
      .withMessage("Administrative unit is required"),
  ],
  budgetRequestController.updateBudgetRequest
);

// Approve a budget request
router.put(
  "/approve/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_approve"]), // Updated permission
  loggingMiddleware,
  budgetRequestController.approveBudgetRequest
);

// Reject a budget request
router.put(
  "/reject/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_approve"]), // Updated permission
  loggingMiddleware,
  budgetRequestController.rejectBudgetRequest
);

// Delete a budget request
router.delete(
  "/delete/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["budget_request_delete"]), // Updated permission
  loggingMiddleware,
  budgetRequestController.deleteBudgetRequest
);

module.exports = router;
