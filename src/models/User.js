const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // User role field
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  unit: { type: mongoose.Schema.Types.ObjectId, ref: "AdministrativeUnit" }, // User's primary unit
  createdAt: { type: Date, default: Date.now },
});

// Method to manually set and hash the password
userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10); // Explicitly hash password
};

// Static login function
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

// Method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has specific permission
userSchema.methods.hasPermission = function (permissionId) {
  return this.permissions.some(
    (permission) => permission.toString() === permissionId.toString()
  );
};

module.exports = mongoose.model("User", userSchema);
