// src/controllers/ExpenseController.js
const Expense = require("../models/Expense");

// إنشاء مصروف جديد
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category, cycle, budget, description } =
      req.body;
    const newExpense = new Expense({
      title,
      amount,
      date,
      category,
      cycle,
      budget,
      description,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", expense: newExpense });
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
    const updates = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updates, {
      new: true,
    })
      .populate("cycle")
      .populate("budget");

    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });

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

    if (!deletedExpense)
      return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};
