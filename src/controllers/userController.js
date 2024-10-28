const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.loginUser(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Create User Controller
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, customPermissions } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const foundRole = await Role.findOne({ name: role });
    if (!foundRole) {
      return res.status(400).json({ error: "Role not found" });
    }

    const permissionsDocs = await Permission.find({
      _id: { $in: customPermissions },
    });

    if (permissionsDocs.length !== customPermissions.length) {
      return res
        .status(400)
        .json({ error: "One or more permissions not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: foundRole._id,
      customPermissions,
    });
    await user.save();

    // إنشاء إشعار عند إضافة مستخدم جديد
    const notification = new Notification({
      user: req.user ? req.user._id : user._id,
      message: `New user "${name}" has been created.`,
      type: "User", // تأكد أن هذه القيمة تتوافق مع القيم في الـ schema
      referenceId: user._id,
    });
    await notification.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
};

// Update User Controller
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, customPermissions } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) {
      const foundRole = await Role.findOne({ name: role });
      if (!foundRole) {
        return res.status(400).json({ error: "Role not found" });
      }
      updateData.role = foundRole._id;
    }

    if (customPermissions) {
      const permissionsDocs = await Permission.find({
        _id: { $in: customPermissions },
      });
      if (permissionsDocs.length !== customPermissions.length) {
        return res
          .status(400)
          .json({ error: "One or more permissions not found" });
      }

      updateData.customPermissions = customPermissions;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-password")
      .populate("role");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    // إنشاء إشعار عند تحديث المستخدم
    const notification = new Notification({
      user: req.user._id,
      message: `User "${updatedUser.name}" has been updated.`,
      type: "User",
      referenceId: updatedUser._id,
    });
    await notification.save();

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete User Controller
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    // إنشاء إشعار عند حذف المستخدم
    const notification = new Notification({
      user: req.user._id,
      message: `User "${deletedUser.name}" has been deleted.`,
      type: "User",
      referenceId: deletedUser._id,
    });
    await notification.save();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("role");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").populate("role");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Export all functions
module.exports = {
  login,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
};
