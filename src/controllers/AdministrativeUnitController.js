// src/controllers/AdministrativeUnitController.js
const AdministrativeUnit = require("../models/AdministrativeUnit");

// إنشاء وحدة إدارية جديدة
exports.createUnit = async (req, res) => {
  try {
    const { name, parentUnit, description } = req.body;
    const newUnit = new AdministrativeUnit({ name, parentUnit, description });
    await newUnit.save();
    res
      .status(201)
      .json({
        message: "Administrative unit created successfully",
        unit: newUnit,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating administrative unit",
        error: error.message,
      });
  }
};

// عرض جميع الوحدات الإدارية
exports.getUnits = async (req, res) => {
  try {
    const units = await AdministrativeUnit.find().populate("parentUnit");
    res.status(200).json(units);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching administrative units",
        error: error.message,
      });
  }
};

// تحديث وحدة إدارية
exports.updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const updates = req.body;

    const updatedUnit = await AdministrativeUnit.findByIdAndUpdate(
      unitId,
      updates,
      { new: true }
    ).populate("parentUnit");

    if (!updatedUnit)
      return res.status(404).json({ message: "Unit not found" });

    res.json({
      message: "Administrative unit updated successfully",
      unit: updatedUnit,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating administrative unit",
        error: error.message,
      });
  }
};

// حذف وحدة إدارية
exports.deleteUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const deletedUnit = await AdministrativeUnit.findByIdAndDelete(unitId);

    if (!deletedUnit)
      return res.status(404).json({ message: "Unit not found" });

    res.json({ message: "Administrative unit deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting administrative unit",
        error: error.message,
      });
  }
};
