const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["budget", "expense", "transfer", "administrative", "all"], // أنواع التقارير المتاحة
    required: true,
  },
  filters: {
    type: Object,
    default: {}, // معايير البحث اللي المستخدم يحددها
  },
  data: {
    type: Array,
    default: [], // البيانات اللي هتظهر في التقرير
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
