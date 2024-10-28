// src/controllers/RoleController.js
const Role = require("../models/Role");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات
const { validationResult } = require("express-validator");

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res
      .status(500)
      .json({ error: "Error fetching roles. Please try again later." });
  }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) return res.status(404).json({ error: "Role not found" });

    res.status(200).json(role);
  } catch (error) {
    console.error(`Error fetching role with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ error: "Error fetching role. Please try again later." });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists" });
    }

    const newRole = new Role({ name });
    await newRole.save();

    // إنشاء إشعار عند إضافة دور جديد
    const notification = new Notification({
      user: req.user._id,
      message: `New role "${name}" has been created.`,
      type: "Role",
      referenceId: newRole._id,
    });
    await notification.save();

    res
      .status(201)
      .json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    res
      .status(500)
      .json({ error: "Error creating role. Please try again later." });
  }
};

// Update a role by ID
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedRole) return res.status(404).json({ error: "Role not found" });

    // إنشاء إشعار عند تحديث الدور
    const notification = new Notification({
      user: req.user._id,
      message: `Role "${updatedRole.name}" has been updated.`,
      type: "Role",
      referenceId: updatedRole._id,
    });
    await notification.save();

    res
      .status(200)
      .json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error(`Error updating role with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ error: "Error updating role. Please try again later." });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) return res.status(404).json({ error: "Role not found" });

    // إنشاء إشعار عند حذف الدور
    const notification = new Notification({
      user: req.user._id,
      message: `Role "${deletedRole.name}" has been deleted.`,
      type: "Role",
      referenceId: deletedRole._id,
    });
    await notification.save();

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(`Error deleting role with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ error: "Error deleting role. Please try again later." });
  }
};
