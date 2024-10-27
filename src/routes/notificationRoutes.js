// src/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");

// Routes for notification management

// Get all notifications for a user
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_notifications"]),
  notificationController.getNotificationsByUser
);

// Mark a notification as read
router.put(
  "/:notificationId/read",
  authMiddleware,
  permissionMiddleware(["manage_notifications"]),
  notificationController.markAsRead
);

// Delete a notification
router.delete(
  "/:notificationId",
  authMiddleware,
  permissionMiddleware(["delete_notifications"]),
  notificationController.deleteNotification
);

module.exports = router;
