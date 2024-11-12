const express = require("express");
const router = express.Router();
const centralBudgetController = require("../controllers/CentralBudgetController");
const allocatedBudgetController = require("../controllers/AllocatedBudgetController");
const authMiddleware = require("../middlewares/authMiddleware"); // تأكد من إضافة `authMiddleware`
const checkPermission = require("../middlewares/permissionMiddleware");

router.post(
  "/central",
  authMiddleware,
  checkPermission("صلاحية إضافة ميزانية عامة"),
  centralBudgetController.createOrUpdateCentralBudget
);

router.post(
  "/allocate",
  authMiddleware,
  checkPermission("صلاحية توزيع ميزانيات للقطاعات مع إضافة المبلغ الاحتياطي"),
  centralBudgetController.allocateBudgetToUnit
);

router.post(
  "/update-allocated",
  authMiddleware,
  checkPermission("صلاحية مصروفات"),
  allocatedBudgetController.updateAllocatedBudget
);

module.exports = router;
