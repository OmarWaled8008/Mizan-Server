const mongoose = require("mongoose");

const allocatedBudgetSchema = new mongoose.Schema(
  {
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    },
    allocatedAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 }, // إجمالي المصروفات
    remainingAmount: {
      type: Number,
      default: function () {
        return this.allocatedAmount - this.spentAmount;
      },
    }, // المبلغ المتبقي
  },
  { timestamps: true }
);

allocatedBudgetSchema.pre("save", function (next) {
  this.remainingAmount = this.allocatedAmount - this.spentAmount;
  next();
});

module.exports = mongoose.model("AllocatedBudget", allocatedBudgetSchema);
