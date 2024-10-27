const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // Middleware for permission validation
const { body } = require("express-validator");

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validationMiddleware,
  userController.login
);

// Create a new user
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_users"]), // التأكد من أن المستخدم عنده صلاحية إنشاء مستخدمين
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  validationMiddleware,
  userController.createUser
);

// Get all users
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_users"]), // التأكد من أن المستخدم عنده صلاحية عرض المستخدمين
  userController.getUsers
);

// Get a single user by ID
router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware(["view_users"]), // التأكد من أن المستخدم عنده صلاحية عرض مستخدم معين
  userController.getUserById
);

// Update a user by ID
router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware(["edit_users"]), // التأكد من أن المستخدم عنده صلاحية تعديل المستخدمين
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
  ],
  validationMiddleware,
  userController.updateUser
);

// Delete a user by ID
router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware(["delete_users"]), // التأكد من أن المستخدم عنده صلاحية حذف المستخدمين
  userController.deleteUser
);

module.exports = router;
