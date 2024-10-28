// src/controllers/budgetRequestController.js
const BudgetRequest = require("../models/BudgetRequest");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات
const { validationResult } = require("express-validator");

// Get all budget requests
exports.getAllBudgetRequests = async (req, res) => {
  try {
    const requests = await BudgetRequest.find()
      .populate("budget")
      .populate("requestedBy");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching budget requests:", error);
    res.status(500).json({ error: "Error fetching budget requests" });
  }
};

// Create a new budget request
exports.createBudgetRequest = async (req, res) => {
  try {
    const { budget, amount, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingBudget = await Budget.findById(budget);
    if (!existingBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    const newRequest = new BudgetRequest({
      budget,
      amount,
      description,
      requestedBy: req.user._id,
    });
    await newRequest.save();

    // إنشاء إشعار عند إنشاء طلب ميزانية جديد
    const notification = new Notification({
      user: req.user._id,
      message: `A new budget request has been created by ${req.user.name} for ${amount} units.`,
      type: "Budget Request",
      referenceId: newRequest._id,
    });
    await notification.save();

    res.status(201).json({
      message: "Budget request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating budget request:", error);
    res.status(500).json({ error: "Error creating budget request" });
  }
};

// Approve or reject a budget request
exports.updateBudgetRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const budgetRequest = await BudgetRequest.findById(id).populate("budget");
    if (!budgetRequest) {
      return res.status(404).json({ error: "Budget request not found" });
    }

    budgetRequest.status = status;
    budgetRequest.approvedBy = req.user._id;
    budgetRequest.approvalDate = status === "approved" ? new Date() : null;

    if (status === "approved") {
      // تحديث الميزانية إذا كانت موجودة بالفعل
      const existingBudget = await Budget.findById(budgetRequest.budget._id);
      if (existingBudget) {
        existingBudget.initialAmount += budgetRequest.amount;
        existingBudget.description += ` (Updated by budget request: ${budgetRequest._id})`;
        await existingBudget.save();
      } else {
        // إنشاء ميزانية جديدة بناءً على الطلب
        const newBudget = new Budget({
          administrativeUnit: budgetRequest.budget.administrativeUnit,
          fiscalYear: budgetRequest.budget.fiscalYear,
          initialAmount: budgetRequest.amount,
          description: budgetRequest.description,
        });
        await newBudget.save();
      }

      // إنشاء إشعار عند الموافقة على طلب الميزانية
      const notification = new Notification({
        user: budgetRequest.requestedBy,
        message: `Your budget request for ${budgetRequest.amount} units has been approved.`,
        type: "Budget Request",
        referenceId: budgetRequest._id,
      });
      await notification.save();
    } else if (status === "rejected") {
      // إنشاء إشعار عند رفض طلب الميزانية
      const notification = new Notification({
        user: budgetRequest.requestedBy,
        message: `Your budget request for ${budgetRequest.amount} units has been rejected.`,
        type: "Budget Request",
        referenceId: budgetRequest._id,
      });
      await notification.save();
    }

    await budgetRequest.save();
    res.status(200).json({
      message: "Budget request updated successfully",
      request: budgetRequest,
    });
  } catch (error) {
    console.error("Error updating budget request:", error);
    res.status(500).json({ error: "Error updating budget request" });
  }
};
