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
  permissionMiddleware(["view_notifications"]),
  notificationController.getUserNotifications
);

// Mark notification as read
router.put(
  "/read/:notificationId",
  authMiddleware,
  permissionMiddleware(["view_notifications"]),
  notificationController.markAsRead
);

module.exports = router;
