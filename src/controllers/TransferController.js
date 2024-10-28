const Transfer = require("../models/Transfer");
const Budget = require("../models/Budget");
const AdministrativeUnit = require("../models/AdministrativeUnit");

// Get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("sourceUnit")
      .populate("destinationUnit")
      .populate("approvedBy");
    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Error fetching transfers" });
  }
};

// Create a new transfer
exports.createTransfer = async (req, res) => {
  try {
    const { sourceUnit, destinationUnit, amount, date, description } = req.body;

    // التحقق من أن الوحدتين الإداريتين موجودتين
    const sourceUnitExists = await AdministrativeUnit.findById(sourceUnit);
    const destinationUnitExists = await AdministrativeUnit.findById(
      destinationUnit
    );

    if (!sourceUnitExists || !destinationUnitExists) {
      return res
        .status(404)
        .json({ error: "Source or destination unit not found" });
    }

    // التحقق من أن الميزانية للوحدة المرسلة تكفي للمبلغ المحول
    const sourceBudget = await Budget.findOne({
      administrativeUnit: sourceUnit,
    });
    if (!sourceBudget || sourceBudget.initialAmount < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in the source unit's budget" });
    }

    const newTransfer = new Transfer({
      sourceUnit,
      destinationUnit,
      amount,
      date,
      description,
    });
    await newTransfer.save();

    res.status(201).json({
      message: "Transfer created successfully",
      transfer: newTransfer,
    });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ error: "Error creating transfer" });
  }
};

// Update transfer status (approve/reject)
exports.updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const transfer = await Transfer.findById(id)
      .populate("sourceUnit")
      .populate("destinationUnit");

    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    // تحديث حالة التحويل
    transfer.status = status;
    transfer.approvedBy = req.user._id;
    transfer.approvalDate = status === "approved" ? new Date() : null;

    if (status === "approved") {
      // تحديث الميزانية عند الموافقة على التحويل
      const sourceBudget = await Budget.findOne({
        administrativeUnit: transfer.sourceUnit._id,
      });

      if (!sourceBudget || sourceBudget.initialAmount < transfer.amount) {
        return res
          .status(400)
          .json({ error: "Insufficient funds in the source unit's budget" });
      }

      // خصم المبلغ من ميزانية الوحدة المرسلة فقط
      sourceBudget.initialAmount -= transfer.amount;
      await sourceBudget.save();
    }

    await transfer.save();
    res
      .status(200)
      .json({ message: "Transfer status updated successfully", transfer });
  } catch (error) {
    console.error("Error updating transfer status:", error);
    res.status(500).json({ error: "Error updating transfer status" });
  }
};

// Delete a transfer
exports.deleteTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransfer = await Transfer.findByIdAndDelete(id);

    if (!deletedTransfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    res.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    res.status(500).json({ error: "Error deleting transfer" });
  }
};
