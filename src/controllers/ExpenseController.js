// src/controllers/ExpenseController.js
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Cycle = require("../models/Cycle");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category, cycle, budget, description } =
      req.body;

    // التحقق من أن الـ budget موجود
    const foundBudget = await Budget.findById(budget);
    if (!foundBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // التحقق من أن الـ cycle موجود
    const foundCycle = await Cycle.findById(cycle);
    if (!foundCycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }

    // استخدام الـ user ID من الـ token كـ createdBy
    const createdBy = req.user._id;

    // التحقق من المصروفات الحالية المرتبطة بالميزانية
    const totalExpenses = await Expense.aggregate([
      { $match: { budget: foundBudget._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const currentExpenses =
      totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const remainingBudget = foundBudget.initialAmount - currentExpenses;

    // التحقق إذا كان المصروف الجديد يتجاوز الميزانية المتاحة
    if (amount > remainingBudget) {
      return res.status(400).json({
        message: "Expense amount exceeds the available budget",
        availableBudget: remainingBudget,
      });
    }

    const newExpense = new Expense({
      title,
      amount,
      date,
      category,
      cycle,
      budget,
      description,
      createdBy,
    });
    await newExpense.save();

    // إنشاء إشعار عند إضافة مصروف جديد
    const notification = new Notification({
      user: req.user._id,
      message: `A new expense titled "${title}" has been created with an amount of ${amount}.`,
      type: "Expense",
      referenceId: newExpense._id,
    });
    await notification.save();

    res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating expense", error: error.message });
  }
};

// عرض جميع المصروفات
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("cycle").populate("budget");
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: error.message });
  }
};

// تحديث مصروف
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { cycle, budget, ...updates } = req.body;

    // تحقق من أن الـ budget موجود إذا كانت موجودة في التحديث
    if (budget) {
      const foundBudget = await Budget.findById(budget);
      if (!foundBudget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      updates.budget = budget;
    }

    // تحقق من أن الـ cycle موجود إذا كانت موجودة في التحديث
    if (cycle) {
      const foundCycle = await Cycle.findById(cycle);
      if (!foundCycle) {
        return res.status(404).json({ message: "Cycle not found" });
      }
      updates.cycle = cycle;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updates, {
      new: true,
    })
      .populate("cycle")
      .populate("budget");

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // إنشاء إشعار عند تحديث المصروف
    const notification = new Notification({
      user: req.user._id,
      message: `The expense titled "${updatedExpense.title}" has been updated.`,
      type: "Expense",
      referenceId: updatedExpense._id,
    });
    await notification.save();

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating expense", error: error.message });
  }
};

// حذف مصروف
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // إنشاء إشعار عند حذف المصروف
    const notification = new Notification({
      user: req.user._id,
      message: `The expense titled "${deletedExpense.title}" has been deleted.`,
      type: "Expense",
      referenceId: deletedExpense._id,
    });
    await notification.save();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};
