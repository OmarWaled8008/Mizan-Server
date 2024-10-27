// src/controllers/BudgetController.js
const Budget = require("../models/Budget");

// إنشاء ميزانية جديدة
exports.createBudget = async (req, res) => {
  try {
    const { administrativeUnit, fiscalYear, initialAmount, description } =
      req.body;

    const newBudget = new Budget({
      administrativeUnit,
      fiscalYear,
      initialAmount,
      description,
    });

    await newBudget.save();
    res
      .status(201)
      .json({ message: "Budget created successfully", budget: newBudget });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating budget", error: error.message });
  }
};

// عرض جميع الميزانيات
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("administrativeUnit");
    res.status(200).json(budgets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching budgets", error: error.message });
  }
};

// تحديث ميزانية
exports.updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const updates = req.body;

    const updatedBudget = await Budget.findByIdAndUpdate(budgetId, updates, {
      new: true,
    }).populate("administrativeUnit");

    if (!updatedBudget)
      return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Budget updated successfully", budget: updatedBudget });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating budget", error: error.message });
  }
};

// حذف ميزانية
exports.deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const deletedBudget = await Budget.findByIdAndDelete(budgetId);

    if (!deletedBudget)
      return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting budget", error: error.message });
  }
};
