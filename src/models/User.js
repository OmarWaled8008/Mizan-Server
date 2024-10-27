const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  customPermissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Method for logging in users
userSchema.statics.loginUser = async function (email, password) {
  const user = await this.findOne({ email })
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .populate("customPermissions");
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

// Method for creating a standard user
userSchema.statics.createUser = async function (data) {
  const existingUser = await this.findOne({ email: data.email });
  if (existingUser) throw new Error("Email is already registered");

  data.password = await bcrypt.hash(data.password, 10);
  const user = new this(data);
  return await user.save();
};

userSchema.methods.getCombinedPermissions = async function () {
  const populatedUser = await this.model("User")
    .findById(this._id)
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .populate("customPermissions");

  const rolePermissions = populatedUser.role
    ? populatedUser.role.permissions.map((p) => p.name)
    : [];
  const customPermissions = populatedUser.customPermissions.map((p) => p.name);

  // دمج الصلاحيات في Set لتجنب التكرار
  const combinedPermissions = new Set([
    ...rolePermissions,
    ...customPermissions,
  ]);

  return Array.from(combinedPermissions);
};

// Method to check if user has a specific permission by ObjectId
userSchema.methods.hasPermission = async function (permissionId) {
  const permissions = await this.getCombinedPermissions();
  return permissions.includes(permissionId.toString());
};

module.exports = mongoose.model("User", userSchema);
