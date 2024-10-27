// src/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for report management

// Create a new report
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_reports"]),
  [
    body("reportName").notEmpty().withMessage("Report name is required"),
    body("type").notEmpty().withMessage("Report type is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("user").notEmpty().withMessage("User is required"),
  ],
  reportController.createReport
);

// Get all reports
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_reports"]),
  reportController.getReports
);

// Update a report by ID
router.put(
  "/:reportId",
  authMiddleware,
  permissionMiddleware(["edit_reports"]),
  [
    body("reportName")
      .optional()
      .notEmpty()
      .withMessage("Report name cannot be empty"),
  ],
  reportController.updateReport
);

// Delete a report by ID
router.delete(
  "/:reportId",
  authMiddleware,
  permissionMiddleware(["delete_reports"]),
  reportController.deleteReport
);

module.exports = router;
