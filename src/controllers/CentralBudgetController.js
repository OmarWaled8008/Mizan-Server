const CentralBudget = require("../models/Centralbudget");
const AllocatedBudget = require("../models/AllocatedBudget");

exports.createOrUpdateCentralBudget = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    let centralBudget = await CentralBudget.findOne();

    if (!centralBudget) {
      centralBudget = new CentralBudget({ totalAmount });
    } else {
      centralBudget.totalAmount = totalAmount;
    }

    await centralBudget.save();

    res
      .status(200)
      .json({ message: "Central budget updated successfully", centralBudget });
  } catch (error) {
    console.error("Error updating central budget:", error);
    res.status(500).json({ message: "Error updating central budget" });
  }
};

exports.allocateBudgetToUnit = async (req, res) => {
  try {
    const { unit, allocatedAmount } = req.body;

    // تحديث الميزانية المركزية (خصم المبلغ المخصص)
    const centralBudget = await CentralBudget.findOne();
    if (!centralBudget || centralBudget.remainingAmount < allocatedAmount) {
      return res.status(400).json({ message: "Insufficient central budget" });
    }

    centralBudget.allocatedAmount += allocatedAmount;
    await centralBudget.save(); // تأكد من حفظ التغييرات

    // إنشاء أو تحديث الميزانية المخصصة للوحدة
    let allocatedBudget = await AllocatedBudget.findOne({ unit });
    if (!allocatedBudget) {
      allocatedBudget = new AllocatedBudget({ unit, allocatedAmount });
    } else {
      allocatedBudget.allocatedAmount += allocatedAmount;
    }
    await allocatedBudget.save(); // تأكد من حفظ التغييرات

    res.json({ message: "Budget allocated to unit successfully" });
  } catch (error) {
    console.error("Error in allocating budget to unit:", error);
    res
      .status(500)
      .json({ message: "Error in allocating budget to unit", error });
  }
};


exports.getCentralBudgetDetails = async (req, res) => {
  try {
    const centralBudget = await CentralBudget.findOne();
    if (!centralBudget) {
      return res.status(404).json({ message: "Central budget not found" });
    }

    res.status(200).json({ centralBudget });
  } catch (error) {
    console.error("Error retrieving central budget details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving central budget details" });
  }
};

exports.getAllocatedBudgetDetails = async (req, res) => {
  try {
    const { unitId } = req.params;
    const allocatedBudget = await AllocatedBudget.findOne({ unit: unitId });

    if (!allocatedBudget) {
      return res
        .status(404)
        .json({ message: "Allocated budget not found for unit" });
    }

    res.status(200).json({ allocatedBudget });
  } catch (error) {
    console.error("Error retrieving allocated budget details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving allocated budget details" });
  }
};
