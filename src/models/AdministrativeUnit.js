const mongoose = require("mongoose");

const administrativeUnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    parentUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdministrativeUnit",
      default: null, // جعلها اختياري عشان الوحدة ممكن تكون رئيسية
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Middleware للتحقق من وجود الوحدة الأبوية قبل الحفظ
administrativeUnitSchema.pre("save", async function (next) {
  if (this.parentUnit) {
    const parentExists = await this.model("AdministrativeUnit").findById(
      this.parentUnit
    );
    if (!parentExists) {
      return next(new Error("Parent unit does not exist"));
    }
  }
  next();
});

module.exports = mongoose.model("AdministrativeUnit", administrativeUnitSchema);
