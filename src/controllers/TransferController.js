// src/controllers/TransferController.js
const Transfer = require("../models/Transfer ");

// إنشاء تحويل جديد
exports.createTransfer = async (req, res) => {
  try {
    const { sourceUnit, destinationUnit, amount, date, description } = req.body;
    const newTransfer = new Transfer({
      sourceUnit,
      destinationUnit,
      amount,
      date,
      description,
    });
    await newTransfer.save();
    res
      .status(201)
      .json({
        message: "Transfer created successfully",
        transfer: newTransfer,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transfer", error: error.message });
  }
};

// عرض جميع التحويلات
exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("sourceUnit")
      .populate("destinationUnit");
    res.status(200).json(transfers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transfers", error: error.message });
  }
};

// تحديث تحويل
exports.updateTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const updates = req.body;

    const updatedTransfer = await Transfer.findByIdAndUpdate(
      transferId,
      updates,
      { new: true }
    )
      .populate("sourceUnit")
      .populate("destinationUnit");

    if (!updatedTransfer)
      return res.status(404).json({ message: "Transfer not found" });

    res.json({
      message: "Transfer updated successfully",
      transfer: updatedTransfer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transfer", error: error.message });
  }
};

// حذف تحويل
exports.deleteTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const deletedTransfer = await Transfer.findByIdAndDelete(transferId);

    if (!deletedTransfer)
      return res.status(404).json({ message: "Transfer not found" });

    res.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting transfer", error: error.message });
  }
};
