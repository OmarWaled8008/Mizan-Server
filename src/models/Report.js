const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportName: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
