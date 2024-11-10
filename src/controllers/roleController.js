const Role = require("../models/Role");

// إنشاء دور جديد
exports.createRole = async (req, res) => {
  try {
    const { name, isRepeatable } = req.body;
    const role = new Role({ name, isRepeatable });
    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({ error: "Error creating role" });
  }
};

// جلب جميع الأدوار
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Error fetching roles" });
  }
};

// تحديث دور
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isRepeatable } = req.body;
    const role = await Role.findByIdAndUpdate(
      id,
      { name, isRepeatable },
      { new: true }
    );
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Error updating role" });
  }
};

// حذف دور
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({ error: "Error deleting role" });
  }
};
