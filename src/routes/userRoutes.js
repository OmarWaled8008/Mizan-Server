const express = require("express");
const router = express.Router();
const {
  userLogin,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminAccess = require("../middlewares/checkAdminAccess");

// تسجيل الدخول كمستخدم عادي
router.post("/login", userLogin);

// إنشاء مستخدم جديد
router.post("/", authMiddleware, createUser);

// تحديث بيانات المستخدم
router.put("/:id", authMiddleware, updateUser);

// حذف المستخدم
router.delete("/:id", authMiddleware, deleteUser);

router.get("/", authMiddleware, checkAdminAccess, getAllUsers);

module.exports = router;
