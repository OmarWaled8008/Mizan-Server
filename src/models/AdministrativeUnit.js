const mongoose = require("mongoose");

const administrativeUnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },

    // Hierarchical structure
    parentUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      default: null,
    },
    subUnits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdministrativeUnit",
        default: [],
      },
    ], // إضافة حقل subUnits

    // Management and Status
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    // Financial tracking
    budgets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
      },
    ],
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
  },
  { timestamps: true }
);

// Middleware for verifying parent unit existence
administrativeUnitSchema.pre("save", async function (next) {
  if (this.parentUnit) {
    const parentUnit = await this.model("AdministrativeUnit").findById(
      this.parentUnit
    );
    if (!parentUnit) {
      return next(new Error("Parent unit does not exist"));
    }
    // إضافة الوحدة الفرعية في parentUnit
    parentUnit.subUnits.addToSet(this._id);
    await parentUnit.save();
  }
  next();
});

// Middleware for updating hierarchy on deletion
administrativeUnitSchema.pre("remove", async function (next) {
  // Remove reference to this unit from its parent unit if exists
  if (this.parentUnit) {
    await this.model("AdministrativeUnit").findByIdAndUpdate(this.parentUnit, {
      $pull: { subUnits: this._id },
    });
  }

  // Remove this unit as parent for its sub-units
  await this.model("AdministrativeUnit").updateMany(
    { parentUnit: this._id },
    { parentUnit: null }
  );

  next();
});

module.exports = mongoose.model("AdministrativeUnit", administrativeUnitSchema);
