const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is used consistently

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Function to manually set and hash the password
adminSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10); // Hashing password explicitly
};

// Static login function with bcryptjs comparison
adminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (!admin) {
    console.log("Admin not found");
    throw new Error("Invalid email or password");
  }

  console.log("Stored hash in DB for comparison:", admin.password);
  console.log("Password entered by user:", password);

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("Password comparison result:", isMatch);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return admin;
};

// Ensure super admin privilege
adminSchema.methods.isSuperAdmin = function () {
  return true;
};

module.exports = mongoose.model("Admin", adminSchema);
