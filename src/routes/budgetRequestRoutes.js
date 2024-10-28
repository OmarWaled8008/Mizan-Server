// src/routes/budgetRequestRoutes.js
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
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_budget_requests"]),
  loggingMiddleware,
  budgetRequestController.getAllBudgetRequests
);

// Create a new budget request
router.post(
  "/create",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["create_budget_requests"]),
  loggingMiddleware,
  [
    body("budget").notEmpty().withMessage("Budget ID is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
  ],
  budgetRequestController.createBudgetRequest
);

// Approve or reject a budget request
router.put(
  "/update/:id",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["approve_budget_requests"]),
  loggingMiddleware,
  [
    body("status")
      .isIn(["approved", "rejected"])
      .withMessage("Status must be either 'approved' or 'rejected'"),
  ],
  budgetRequestController.updateBudgetRequestStatus
);

module.exports = router;
