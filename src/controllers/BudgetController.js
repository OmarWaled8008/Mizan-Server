// src/controllers/budgetController.js
const Budget = require("../models/Budget");
const AdministrativeUnit = require("../models/AdministrativeUnit");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات
const { validationResult } = require("express-validator");

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("administrativeUnit");
    res.status(200).json(budgets);
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
    const { initialAmount, spentAmount, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { initialAmount, spentAmount, description },
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
