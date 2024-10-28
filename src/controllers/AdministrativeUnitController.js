// src/controllers/AdministrativeUnitController.js
const AdministrativeUnit = require("../models/AdministrativeUnit");
const Notification = require("../models/Notification"); // استيراد موديل الإشعارات

// عرض جميع الوحدات الإدارية
exports.getUnits = async (req, res) => {
  try {
    const units = await AdministrativeUnit.find().populate("parentUnit");
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching administrative units",
      error: error.message,
    });
  }
};

exports.createUnit = async (req, res) => {
  try {
    const { name, parentUnit, description } = req.body;

    if (parentUnit) {
      const parent = await AdministrativeUnit.findById(parentUnit);
      if (!parent) {
        return res.status(404).json({ message: "Parent unit not found" });
      }

      // تحقق من أن الوحدة الجديدة ليست نفسها الوحدة الأبوية
      if (parent._id.equals(req.body._id)) {
        return res
          .status(400)
          .json({ message: "Unit cannot be its own parent" });
      }

      // تحقق من حالة الوحدة الأبوية
      if (parent.status === "inactive") {
        return res
          .status(400)
          .json({ message: "Cannot add a unit under an inactive parent unit" });
      }
    }

    const newUnit = new AdministrativeUnit({ name, parentUnit, description });
    await newUnit.save();

    // إنشاء إشعار
    const notification = new Notification({
      user: req.user._id,
      message: `New administrative unit "${name}" has been created.`,
      type: "AdministrativeUnit",
      referenceId: newUnit._id,
    });
    await notification.save();

    res.status(201).json({
      message: "Administrative unit created successfully",
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating administrative unit",
      error: error.message,
    });
  }
};

// تحديث وحدة إدارية
exports.updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { parentUnit, ...updates } = req.body;

    if (parentUnit) {
      const parent = await AdministrativeUnit.findById(parentUnit);
      if (!parent) {
        return res.status(404).json({ message: "Parent unit not found" });
      }

      if (parent._id.equals(unitId)) {
        return res
          .status(400)
          .json({ message: "Unit cannot be its own parent" });
      }

      if (parent.status === "inactive") {
        return res
          .status(400)
          .json({ message: "Cannot assign an inactive unit as a parent" });
      }

      updates.parentUnit = parentUnit;
    }

    const updatedUnit = await AdministrativeUnit.findByIdAndUpdate(
      unitId,
      updates,
      { new: true }
    ).populate("parentUnit");

    if (!updatedUnit)
      return res.status(404).json({ message: "Unit not found" });

    // إنشاء إشعار عند تحديث الوحدة الإدارية
    const notification = new Notification({
      user: req.user._id,
      message: `Administrative unit "${updatedUnit.name}" has been updated.`,
      type: "AdministrativeUnit",
      referenceId: updatedUnit._id,
    });
    await notification.save();

    res.json({
      message: "Administrative unit updated successfully",
      unit: updatedUnit,
    });
  } catch (error) {
    res.status(500).json({
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

    // إنشاء إشعار عند حذف الوحدة الإدارية
    const notification = new Notification({
      user: req.user._id,
      message: `Administrative unit "${deletedUnit.name}" has been deleted.`,
      type: "AdministrativeUnit",
      referenceId: deletedUnit._id,
    });
    await notification.save();

    res.json({ message: "Administrative unit deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting administrative unit",
      error: error.message,
    });
  }
};
