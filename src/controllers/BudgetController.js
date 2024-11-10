const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const AdministrativeUnit = require("../models/AdministrativeUnit");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const getTotalSpentAmount = async (budgetId) => {
  const result = await Expense.aggregate([
    { $match: { budget: new mongoose.Types.ObjectId(budgetId) } },
    { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
  ]);
  return result[0] ? result[0].totalSpent : 0;
};

exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("administrativeUnit");

    const budgetsWithRemaining = await Promise.all(
      budgets.map(async (budget) => {
        const totalSpent = await getTotalSpentAmount(budget._id);
        const remainingBudget = budget.initialAmount - totalSpent;
        return {
          ...budget.toObject(),
          totalSpent,
          remainingBudget,
        };
      })
    );

    res.status(200).json(budgetsWithRemaining);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Error fetching budgets" });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { administrativeUnit, fiscalYear, initialAmount, description } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminUnit = await AdministrativeUnit.findById(administrativeUnit);
    if (!adminUnit) {
      return res.status(404).json({ error: "Administrative unit not found" });
    }

    const newBudget = new Budget({
      administrativeUnit,
      fiscalYear,
      initialAmount,
      description,
    });
    await newBudget.save();

    // إنشاء إشعار عند إنشاء ميزانية جديدة
    const notification = new Notification({
      user: req.user._id,
      message: `A new budget for ${fiscalYear} has been created with an initial amount of ${initialAmount}.`,
      type: "Budget",
      referenceId: newBudget._id,
    });
    await notification.save();

    res.status(201).json({
      message: "Budget created successfully",
      budget: newBudget,
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: "Error creating budget" });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { initialAmount, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { initialAmount, description },
      { new: true }
    ).populate("administrativeUnit");

    if (!updatedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // إنشاء إشعار عند تحديث ميزانية
    const notification = new Notification({
      user: req.user._id,
      message: `The budget for ${updatedBudget.fiscalYear} has been updated.`,
      type: "Budget",
      referenceId: updatedBudget._id,
    });
    await notification.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ error: "Error updating budget" });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // إنشاء إشعار عند حذف ميزانية
    const notification = new Notification({
      user: req.user._id,
      message: `The budget for ${deletedBudget.fiscalYear} has been deleted.`,
      type: "Budget",
      referenceId: deletedBudget._id,
    });
    await notification.save();

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ error: "Error deleting budget" });
  }
};
