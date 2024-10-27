const mongoose = require("mongoose");

const administrativeUnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
    },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdministrativeUnit", administrativeUnitSchema);
