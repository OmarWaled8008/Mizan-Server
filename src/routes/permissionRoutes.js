// src/routes/permissionRoutes.js
const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");

// Routes for permission management

// Get all permissions
router.get(
  "/",
  authMiddleware,
  auditLogMiddleware,
  // permissionMiddleware(["view_permissions"]),
  permissionController.getAllPermissions
);

module.exports = router;
