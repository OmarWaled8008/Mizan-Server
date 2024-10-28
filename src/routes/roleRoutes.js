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
  permissionMiddleware(["create_roles"]),
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
  // permissionMiddleware(["view_roles"]),
  roleController.getAllRoles
);

// Get a single role by ID
router.get(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["view_roles"]),
  roleController.getRoleById
);

// Update a role by ID
router.put(
  "/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["edit_roles"]),
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
  permissionMiddleware(["delete_roles"]),
  roleController.deleteRole
);

module.exports = router;
