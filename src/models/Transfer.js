const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    sourceUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    },
    destinationUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Middleware للتحقق من الميزانية عند إنشاء التحويل
transferSchema.pre("save", async function (next) {
  if (this.isNew && this.status === "pending") {
    const Budget = mongoose.model("Budget");
    const budget = await Budget.findOne({
      administrativeUnit: this.sourceUnit,
    });

    if (!budget) {
      return next(new Error("Budget for source unit not found"));
    }

    if (budget.initialAmount < this.amount) {
      return next(new Error("Insufficient funds in the source unit's budget"));
    }
  }
  next();
});

module.exports = mongoose.model("Transfer", transferSchema);
