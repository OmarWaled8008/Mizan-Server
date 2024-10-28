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
    res.status(201).json({
      status: "success",
      message: "Audit log has been created successfully.",
      data: {
        logId: newLog._id,
        action: newLog.action,
        user: newLog.user,
        relatedEntity: newLog.relatedEntity,
        entityModel: newLog.entityModel,
        details: newLog.details,
        createdAt: newLog.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "There was an issue creating the audit log.",
      error: error.message,
    });
  }
};

// عرض جميع السجلات
exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email") // إظهار اسم وبريد المستخدم فقط
      .populate("relatedEntity", "name"); // تعديل عرض الكيان المرتبط إذا كان لديه اسم
    res.status(200).json({
      status: "success",
      message: "Audit logs fetched successfully.",
      data: logs.map((log) => ({
        logId: log._id,
        action: log.action,
        user: log.user,
        relatedEntity: log.relatedEntity,
        entityModel: log.entityModel,
        details: log.details,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "There was an issue fetching the audit logs.",
      error: error.message,
    });
  }
};

// حذف سجل عملية
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const deletedLog = await AuditLog.findByIdAndDelete(logId);

    if (!deletedLog) {
      return res.status(404).json({
        status: "error",
        message: "Audit log not found.",
      });
    }

    res.json({
      status: "success",
      message: "Audit log has been deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "There was an issue deleting the audit log.",
      error: error.message,
    });
  }
};
