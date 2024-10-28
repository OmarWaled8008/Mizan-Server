// // src/controllers/ReportController.js
// const Report = require("../models/Report");
// const Budget = require("../models/Budget");
// const Expense = require("../models/Expense");
// const Transfer = require("../models/Transfer");
// const AdministrativeUnit = require("../models/AdministrativeUnit");
// const { Parser } = require("json2csv");

// // Get all reports
// exports.getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find().populate("generatedBy");
//     res.status(200).json(reports);
//   } catch (error) {
//     console.error("Error fetching reports:", error);
//     res.status(500).json({ error: "Error fetching reports" });
//   }
// };

// // Generate a new report
// exports.generateReport = async (req, res) => {
//   try {
//     const { title, type, filters } = req.body;

//     let data = [];
//     switch (type) {
//       case "budget":
//         data = await Budget.find();
//         break;
//       case "expense":
//         data = await Expense.find().populate("budget").populate("cycle");
//         break;
//       case "transfer":
//         data = await Transfer.find();
//         break;
//       case "administrative":
//         data = await AdministrativeUnit.find();
//         break;
//       case "all":
//         data = {
//           budgets: await Budget.find(),
//           expenses: await Expense.find().populate("budget").populate("cycle"),
//           transfers: await Transfer.find(),
//           administrativeUnits: await AdministrativeUnit.find(),
//         };
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid report type" });
//     }

//     const newReport = new Report({
//       title,
//       type,
//       filters,
//       generatedBy: req.user._id,
//       data,
//     });
//     await newReport.save();

//     res.status(201).json({
//       message: "Report generated successfully",
//       report: newReport,
//     });
//   } catch (error) {
//     console.error("Error generating report:", error);
//     res.status(500).json({ error: "Error generating report" });
//   }
// };

// // Download report as CSV
// exports.downloadReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const report = await Report.findById(id);

//     if (!report) {
//       return res.status(404).json({ error: "Report not found" });
//     }

//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(report.data);

//     res.header("Content-Type", "text/csv");
//     res.attachment(`${report.title}.csv`);
//     res.send(csv);
//   } catch (error) {
//     console.error("Error downloading report:", error);
//     res.status(500).json({ error: "Error downloading report" });
//   }
// };
