  // models/Role.js
  const mongoose = require("mongoose");

  const roleSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
      permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
      isRepeatable: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Role", roleSchema);
