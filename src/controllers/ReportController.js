// src/controllers/ReportController.js
const Report = require("../models/Report");

// إنشاء تقرير جديد
exports.createReport = async (req, res) => {
  try {
    const { reportName, type, date, user, fileUrl } = req.body;
    const newReport = new Report({ reportName, type, date, user, fileUrl });
    await newReport.save();
    res
      .status(201)
      .json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
};

// عرض جميع التقارير
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user");
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

// تحديث تقرير
exports.updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updates = req.body;

    const updatedReport = await Report.findByIdAndUpdate(reportId, updates, {
      new: true,
    }).populate("user");

    if (!updatedReport)
      return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report updated successfully", report: updatedReport });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating report", error: error.message });
  }
};

// حذف تقرير
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport)
      return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting report", error: error.message });
  }
};
