const mongoose = require("mongoose");

const centralBudgetSchema = new mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      required: true,
      default: 0, // القيمة الافتراضية للميزانية
    },
    allocatedAmount: {
      type: Number,
      default: 0, // قيمة التخصيصات اللي حصلت
    },
    remainingAmount: {
      type: Number,
      default: 0, // المبلغ المتبقي بعد التخصيصات
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // تاريخ آخر تحديث للميزانية
    },
  },
  { timestamps: true }
);

// Middleware لتحديث المبلغ المتبقي
centralBudgetSchema.pre("save", function (next) {
  this.remainingAmount = this.totalAmount - this.allocatedAmount;
  next();
});

module.exports = mongoose.model("CentralBudget", centralBudgetSchema);
