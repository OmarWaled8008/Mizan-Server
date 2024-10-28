// src/models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // نوع الحدث (مثل: إنشاء، تعديل، حذف)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // المستخدم اللي قام بالحدث
    target: { type: String }, // العنصر اللي تم التأثير عليه (مثل: User, Budget, Expense)
    targetId: { type: mongoose.Schema.Types.ObjectId }, // الـ ID للعنصر
    details: { type: String }, // تفاصيل الحدث
    timestamp: { type: Date, default: Date.now }, // الوقت اللي حصل فيه الحدث
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
