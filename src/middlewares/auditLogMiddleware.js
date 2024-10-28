// src/middlewares/auditLogMiddleware.js
const AuditLog = require("../models/AuditLog");

const createAuditLog = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null; // التأكد إن المستخدم موجود

    const auditData = {
      action: req.method,
      user: userId,
      target: req.baseUrl,
      targetId: req.params.id || null,
      details: `User ${userId} performed ${req.method} on ${req.baseUrl}`,
    };

    await AuditLog.create(auditData);
    next();
  } catch (error) {
    console.error("Error logging audit event:", error);
    next(); // نكمل رغم وجود الخطأ لضمان عدم تعطيل النظام
  }
};

module.exports = createAuditLog;
