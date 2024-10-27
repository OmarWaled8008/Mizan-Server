// src/controllers/AuditLogController.js
const AuditLog = require("../models/AuditLog");

// إنشاء سجل عملية جديدة
exports.createLog = async (req, res) => {
  try {
    const { action, user, relatedEntity, entityModel, details } = req.body;
    const newLog = new AuditLog({
      action,
      user,
      relatedEntity,
      entityModel,
      details,
    });
    await newLog.save();
    res
      .status(201)
      .json({ message: "Audit log created successfully", log: newLog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating audit log", error: error.message });
  }
};

// عرض جميع السجلات
exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user")
      .populate("relatedEntity");
    res.status(200).json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching audit logs", error: error.message });
  }
};

// حذف سجل عملية
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const deletedLog = await AuditLog.findByIdAndDelete(logId);

    if (!deletedLog) return res.status(404).json({ message: "Log not found" });

    res.json({ message: "Audit log deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting audit log", error: error.message });
  }
};
