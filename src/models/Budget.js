const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    administrativeUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    },
    fiscalYear: { type: String, required: true },
    initialAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    approvedAmount: { type: Number, default: 0 },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
