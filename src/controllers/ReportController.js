const Report = require("../models/Report");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Transfer = require("../models/Transfer");
const AdministrativeUnit = require("../models/AdministrativeUnit");
const { Parser } = require("json2csv");

exports.generateReport = async (req, res) => {
  try {
    const { title, type, filters } = req.body;
    let data = [];

    switch (type) {
      case "budget":
        data = await Budget.find(filters);
        break;
      case "expense":
        data = await Expense.find(filters).populate("budget").populate("cycle");
        break;
      case "transfer":
        data = await Transfer.find(filters);
        break;
      case "administrative":
        data = await AdministrativeUnit.find(filters);
        break;
      default:
        return res.status(400).json({ error: "Invalid report type" });
    }

    const newReport = new Report({
      title,
      type,
      filters,
      data,
      generatedBy: req.user._id,
    });
    await newReport.save();

    res
      .status(201)
      .json({ message: "Report generated successfully", report: newReport });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};

// عرض كل التقارير
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("generatedBy");
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Error fetching reports" });
  }
};

// تنزيل التقرير كملف CSV
exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(report.data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${report.title}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({ error: "Error downloading report" });
  }
};
