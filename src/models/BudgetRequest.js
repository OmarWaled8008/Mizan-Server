// src/models/BudgetRequest.js
const mongoose = require("mongoose");

const budgetRequestSchema = new mongoose.Schema(
  {
    fiscalYear: { type: String, required: true },
    initialAmount: { type: Number, required: true },
    approvedAmount: { type: Number, default: 0 },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    administrativeUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetRequest", budgetRequestSchema);
