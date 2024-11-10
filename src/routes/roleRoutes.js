const express = require("express");
const router = express.Router();
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminAccess = require("../middlewares/checkAdminAccess"); // Middleware للتحقق من أن المستخدم هو Admin

// مسار إنشاء دور جديد (للمسؤولين فقط)
router.post("/", authMiddleware, checkAdminAccess, createRole);

// مسار جلب جميع الأدوار (للمسؤولين فقط)
router.get("/", authMiddleware, checkAdminAccess, getRoles);

// مسار تحديث دور (للمسؤولين فقط)
router.put("/:id", authMiddleware, checkAdminAccess, updateRole);

// مسار حذف دور (للمسؤولين فقط)
router.delete("/:id", authMiddleware, checkAdminAccess, deleteRole);

module.exports = router;
