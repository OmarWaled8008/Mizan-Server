// src/models/HistoricalRecord.js
const mongoose = require("mongoose");

const historicalRecordSchema = new mongoose.Schema(
  {
    recordType: { type: String, required: true }, // نوع السجل (مثل: User, Budget, Expense, Cycle)
    recordId: { type: mongoose.Schema.Types.ObjectId, required: true }, // الـ ID للسجل
    data: { type: Object, required: true }, // بيانات السجل (يمكن أن تكون أي شيء)
    createdAt: { type: Date, default: Date.now }, // تاريخ إنشاء السجل
  },
  { timestamps: true }
);

module.exports = mongoose.model("HistoricalRecord", historicalRecordSchema);
