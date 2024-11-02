// src/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");

const { body } = require("express-validator");

// Get all reports
router.get(
  "/all",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_reports"]),
  loggingMiddleware,
  reportController.getAllReports
);

// Generate a new report
router.post(
  "/generate",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["generate_reports"]),
  loggingMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("type")
      .isIn(["budget", "expense", "transfer", "administrative", "all"])
      .withMessage("Invalid report type"),
  ],
  reportController.generateReport
);

// Download report as CSV
router.get(
  "/download/:id",
  authMiddleware,auditLogMiddleware,
  permissionMiddleware(["view_reports"]),
  loggingMiddleware,
  reportController.downloadReport
);

module.exports = router;
