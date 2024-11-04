const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");

const { body } = require("express-validator");

// Create a new role
router.post(
  "/",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["role_create"]), // تأكد من أن المستخدم لديه صلاحية إنشاء الأدوار
  [
    body("name")
      .notEmpty()
      .withMessage("Role name is required")
      .isLength({ max: 50 })
      .withMessage("Role name must be less than 50 characters"),
  ],
  roleController.createRole
);

// Get all roles
router.get(
  "/",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["role_view"]), // تأكد من أن المستخدم لديه صلاحية عرض الأدوار
  roleController.getAllRoles
);

// Get a single role by ID
router.get(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["role_view"]), // تأكد من أن المستخدم لديه صلاحية عرض دور معين
  roleController.getRoleById
);

// Update a role by ID
router.put(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["role_edit"]), // تأكد من أن المستخدم لديه صلاحية تعديل الأدوار
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Role name cannot be empty")
      .isLength({ max: 50 })
      .withMessage("Role name must be less than 50 characters"),
  ],
  roleController.updateRole
);

// Delete a role by ID
router.delete(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["role_delete"]), // تأكد من أن المستخدم لديه صلاحية حذف الأدوار
  roleController.deleteRole
);

module.exports = router;
