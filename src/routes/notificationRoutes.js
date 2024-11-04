// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");

// Get all notifications for the logged-in user
router.get(
  "/",
  authMiddleware,
  notificationController.getUserNotifications
);

// Mark notification as read
router.put(
  "/read/:notificationId",
  authMiddleware,
  notificationController.markAsRead
);

module.exports = router;
