const Expense = require("../models/Expense");
const AllocatedBudget = require("../models/AllocatedBudget");

// إضافة مصروف جديد
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, unitId, budgetId } = req.body;

    // التأكد من أن الميزانية المخصصة موجودة
    const allocatedBudget = await AllocatedBudget.findOne({
      _id: budgetId,
      unit: unitId,
    });

    if (!allocatedBudget) {
      return res
        .status(404)
        .json({ error: "Allocated budget not found for unit" });
    }

    // التأكد من أن المصروف لا يتجاوز الميزانية المتبقية
    if (allocatedBudget.remainingAmount < amount) {
      return res
        .status(400)
        .json({ error: "Expense exceeds allocated budget" });
    }

    // إضافة المصروف وتحديث الميزانية المخصصة
    const expense = new Expense({
      description,
      amount,
      unit: unitId,
      budget: budgetId,
    });
    await expense.save();

    // تحديث المصروفات والمبلغ المتبقي
    allocatedBudget.spentAmount += amount;
    await allocatedBudget.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Error adding expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { unitId, startDate, endDate } = req.query;
    const filter = {};

    if (unitId) filter.unit = unitId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).populate("unit budget");
    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const allocatedBudget = await AllocatedBudget.findById(expense.budget);
    if (!allocatedBudget) {
      return res.status(404).json({ message: "Allocated budget not found" });
    }

    // تحديث المصروفات والمبلغ المتبقي
    allocatedBudget.spentAmount -= expense.amount;
    await allocatedBudget.save();

    // حذف المصروف
    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};
