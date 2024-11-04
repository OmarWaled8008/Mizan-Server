const BudgetRequest = require("../models/BudgetRequest");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification");

// إنشاء طلب ميزانية جديد
exports.createBudgetRequest = async (req, res) => {
  try {
    const { fiscalYear, initialAmount, description, administrativeUnit } =
      req.body;

    const newRequest = new BudgetRequest({
      fiscalYear,
      initialAmount,
      description,
      requestedBy: req.user._id,
      administrativeUnit,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Budget request created successfully",
      budgetRequest: newRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating budget request", error: error.message });
  }
};

// جلب جميع طلبات الميزانية
exports.getAllBudgetRequests = async (req, res) => {
  try {
    const requests = await BudgetRequest.find()
      .populate("requestedBy", "name email")
      .populate("administrativeUnit", "name");

    res.status(200).json({
      message: "All budget requests retrieved successfully",
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving budget requests",
      error: error.message,
    });
  }
};

// جلب طلب ميزانية معين
exports.getBudgetRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BudgetRequest.findById(id)
      .populate("requestedBy", "name email")
      .populate("administrativeUnit", "name");

    if (!request) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res
      .status(200)
      .json({ message: "Budget request retrieved successfully", request });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving budget request",
      error: error.message,
    });
  }
};

// تحديث طلب ميزانية
exports.updateBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { fiscalYear, initialAmount, description, administrativeUnit } =
      req.body;

    const updatedRequest = await BudgetRequest.findByIdAndUpdate(
      id,
      { fiscalYear, initialAmount, description, administrativeUnit },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json({
      message: "Budget request updated successfully",
      budgetRequest: updatedRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating budget request", error: error.message });
  }
};

// حذف طلب ميزانية
exports.deleteBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await BudgetRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json({ message: "Budget request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting budget request", error: error.message });
  }
};

// قبول طلب الميزانية
exports.approveBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BudgetRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    const newBudget = new Budget({
      fiscalYear: request.fiscalYear,
      initialAmount: request.initialAmount,
      description: request.description,
      administrativeUnit: request.administrativeUnit,
    });

    await newBudget.save();
    request.status = "approved";
    await request.remove();

    res.status(200).json({
      message: "Budget request approved and added to budgets",
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving budget request",
      error: error.message,
    });
  }
};

// رفض طلب الميزانية
exports.rejectBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BudgetRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Budget request rejected" });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting budget request",
      error: error.message,
    });
  }
};
