const express = require("express");
const router = express.Router();
const { getPermissions } = require("../controllers/permissionController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminAccess = require("../middlewares/checkAdminAccess"); // Middleware للتحقق من أن المستخدم هو Admin

// مسار جلب جميع الصلاحيات
router.get("/", authMiddleware, checkAdminAccess, getPermissions);

module.exports = router;
