const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    administrativeUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true, // Make sure every budget belongs to an administrative unit
    },
    fiscalYear: { type: String, required: true },
    initialAmount: { type: Number, required: true },
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
