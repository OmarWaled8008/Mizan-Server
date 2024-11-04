const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// عرض كل التقارير
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["report_view"]), // تأكد من أن المستخدم لديه صلاحية عرض التقارير
  reportController.getAllReports
);

// إنشاء تقرير جديد
router.post(
  "/generate",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["report_create"]), // تأكد من أن المستخدم لديه صلاحية إنشاء التقارير
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("type")
      .isIn(["budget", "expense", "transfer", "administrative", "all"])
      .withMessage("Invalid report type"),
  ],
  reportController.generateReport
);

// تنزيل التقرير كملف CSV
router.get(
  "/download/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["report_export"]), // تأكد من أن المستخدم لديه صلاحية تصدير التقارير
  reportController.downloadReport
);

module.exports = router;
