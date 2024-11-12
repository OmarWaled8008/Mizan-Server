const AllocatedBudget = require("../models/AllocatedBudget");

// تحديث الميزانية المخصصة بوحدة معينة
exports.updateAllocatedBudget = async (req, res) => {
  try {
    const { unitId, spentAmount } = req.body;

    const allocatedBudget = await AllocatedBudget.findOne({ unit: unitId });
    if (!allocatedBudget) {
      return res.status(404).json({ error: "Allocated budget not found for unit" });
    }

    // تحديث المصروفات والمبلغ المتبقي
    allocatedBudget.spentAmount += spentAmount;
    if (allocatedBudget.spentAmount > allocatedBudget.allocatedAmount) {
      return res.status(400).json({ error: "Exceeds allocated amount" });
    }

    await allocatedBudget.save();

    res.status(200).json({
      message: "Allocated budget updated successfully",
      allocatedBudget,
    });
  } catch (error) {
    console.error("Error updating allocated budget:", error);
    res.status(500).json({ error: "Error updating allocated budget" });
  }
};
