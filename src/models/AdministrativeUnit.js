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
      },
    ],

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

    // Access control
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true }
);

// Middleware for checking existence of parent unit and updating subUnits in parent
administrativeUnitSchema.pre("save", async function (next) {
  if (this.parentUnit) {
    // Check if the specified parent unit exists
    const parentUnit = await this.model("AdministrativeUnit").findById(
      this.parentUnit
    );
    if (!parentUnit) {
      return next(new Error("Parent unit does not exist"));
    }

    // Add this unit to the subUnits array of the parent unit
    parentUnit.subUnits.addToSet(this._id); // `addToSet` avoids duplicates
    await parentUnit.save();
  }
  next();
});

// Middleware for updating the hierarchy on deletion
administrativeUnitSchema.pre("remove", async function (next) {
  if (this.parentUnit) {
    // Remove this unit from the subUnits array of the parent unit
    await this.model("AdministrativeUnit").findByIdAndUpdate(this.parentUnit, {
      $pull: { subUnits: this._id },
    });
  }

  // If this unit has subUnits, remove their reference to this unit
  if (this.subUnits.length > 0) {
    await this.model("AdministrativeUnit").updateMany(
      { _id: { $in: this.subUnits } },
      { parentUnit: null } // Unassign parent unit from sub-units
    );
  }
  next();
});

module.exports = mongoose.model("AdministrativeUnit", administrativeUnitSchema);
