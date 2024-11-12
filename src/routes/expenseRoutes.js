const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/ExpenseController");
const checkPermission = require("../middlewares/permissionMiddleware");
const authMiddleware = require("../middlewares/authMiddleware"); // تأكد من إضافة `authMiddleware`

// Route لإضافة مصروف جديد
router.post(
  "/add",
  authMiddleware,
  checkPermission("صلاحية مصروفات"),
  expenseController.addExpense
);

// Route لعرض المصروفات بناءً على وحدة أو تاريخ معين
router.get(
  "/",
  authMiddleware,
  checkPermission("صلاحية عرض مصروفات عامة"),
  expenseController.getExpenses
);

// Route لحذف مصروف معين
router.delete(
  "/:expenseId",
  authMiddleware,
  checkPermission("صلاحية حذف أو تعديل ميزانية"),
  expenseController.deleteExpense
);

module.exports = router;
