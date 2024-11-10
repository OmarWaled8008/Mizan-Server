const express = require("express");
const router = express.Router();
const {
  adminLogin,
  createAdminByAdmin,
  getAllAdmins,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminAccess = require("../middlewares/checkAdminAccess");

// تسجيل الدخول كمسؤول
router.post("/login", adminLogin);

// إنشاء مسؤول جديد بواسطة مسؤول آخر (يحتاج إلى مصادقة والتحقق من صلاحيات المسؤول)
router.post(
  "/create",
  authMiddleware,
  checkAdminAccess,
  createAdminByAdmin
);

// عرض جميع المسؤولين (يحتاج إلى مصادقة والتحقق من صلاحيات المسؤول)
router.get("/admins", authMiddleware, checkAdminAccess, getAllAdmins);

module.exports = router;
