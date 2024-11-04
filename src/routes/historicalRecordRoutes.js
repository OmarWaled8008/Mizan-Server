const express = require("express");
const router = express.Router();
const historicalRecordController = require("../controllers/HistoricalRecordController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");

// View all historical records
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["historical_view"]), // Ensure the user has permission to view historical records
  historicalRecordController.getAllRecords
);

// Save historical records (if this action is necessary)
router.post(
  "/save",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["historical_save"]), // Ensure the user has permission to save historical records
  historicalRecordController.saveHistoricalRecords
);

module.exports = router;
