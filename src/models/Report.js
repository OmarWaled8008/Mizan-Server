// src/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["budget", "expense", "transfer", "administrative", "all"],
      required: true,
    },
    filters: { type: Object }, // لتخزين الفلاتر المستخدمة للتقرير
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    data: { type: Array, required: true }, // لتخزين البيانات المولدة من التقرير
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
