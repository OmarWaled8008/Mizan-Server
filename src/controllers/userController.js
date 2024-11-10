const User = require("../models/User");
const Admin = require("../models/Admin");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is used consistently
const { validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

// Function to create token
const createToken = (user, isAdmin = false) => {
  return jwt.sign(
    { id: user._id, role: isAdmin ? "admin" : user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Admin Login Controller
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.login(email, password); // Using the static login function on Admin model
    const token = createToken(admin, true);

    res.json({
      token,
      admin: { _id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// User Login Controller
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password); // Using the static login function on User model

    const token = createToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Create User Controller
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, customPermissions = [] } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate role
    const foundRole = await Role.findById(role);
    if (!foundRole) {
      return res.status(400).json({ error: "Role not found" });
    }

    // Validate permissions
    const permissionsDocs = await Permission.find({
      _id: { $in: customPermissions },
    });
    if (
      customPermissions.length &&
      permissionsDocs.length !== customPermissions.length
    ) {
      return res
        .status(400)
        .json({ error: "One or more permissions not found" });
    }

    const user = new User({
      name,
      email,
      role: foundRole._id,
      permissions: customPermissions,
    });
    await user.setPassword(password); // Explicitly set and hash the password
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
};

// Create Admin Controller by Admin
const createAdminByAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin = new Admin({ name, email });
    await admin.setPassword(password); // Explicitly set and hash the password
    await admin.save();

    const token = createToken(admin, true);
    res.status(201).json({
      message: "Admin created successfully",
      token,
      admin: { _id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ error: "Error creating admin" });
  }
};

// Get All Admins Controller
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Error fetching admins" });
  }
};

// Update User Controller
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, customPermissions } = req.body;
    const updateData = { name, email };

    if (role) {
      const foundRole = await Role.findById(role);
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
      updateData.permissions = customPermissions;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-password")
      .populate("role");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Get All Users Controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("role"); // Exclude passwords and populate role field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};


module.exports = {
  getAllUsers,
  adminLogin,
  userLogin,
  createUser,
  createAdminByAdmin,
  getAllAdmins,
  updateUser,
  deleteUser,
};
