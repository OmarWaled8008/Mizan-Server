// src/middlewares/auditLogMiddleware.js
const AuditLog = require("../models/AuditLog");

const createAuditLog = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const targetId = req.params.id || null;
    const action = req.method;
    const target = req.baseUrl;

    // صياغة التفاصيل بطريقة واضحة ومفهومة
    const details = `المستخدم ${req.user.name} (ID: ${userId}) قام بـ ${action} على ${target}`;

    const auditData = {
      action,
      user: userId,
      target,
      targetId,
      details,
    };

    console.log("Audit log data:", auditData); // Log the audit data

    await AuditLog.create(auditData);
    console.log("Audit log created successfully"); // Log success
    next();
  } catch (error) {
    console.error("Error logging audit event:", error);
    next();
  }
};

module.exports = createAuditLog;
