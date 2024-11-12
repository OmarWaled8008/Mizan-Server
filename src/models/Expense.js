const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, // وصف المصروف
    amount: { type: Number, required: true }, // قيمة المصروف
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    }, // الوحدة المعنية بالمصروف
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllocatedBudget",
      required: true,
    }, // الميزانية المخصصة التي تتعلق بالمصروف
    date: { type: Date, default: Date.now }, // تاريخ المصروف
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
