// src/controllers/AdministrativeUnitController.js
const AdministrativeUnit = require("../models/AdministrativeUnit");
const Notification = require("../models/Notification");

// Retrieve all administrative units
exports.getUnits = async (req, res) => {
  try {
    const units = await AdministrativeUnit.find()
      .populate("parentUnit")
      .populate("subUnits")
      .populate("manager");
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching administrative units",
      error: error.message,
    });
  }
};

// Create a new administrative unit
exports.createUnit = async (req, res) => {
  try {
    const { name, parentUnit, description, manager } = req.body;

    let parent = null;
    if (parentUnit) {
      parent = await AdministrativeUnit.findById(parentUnit);
      if (!parent) {
        return res.status(404).json({ message: "Parent unit not found" });
      }
      if (parent.status === "inactive") {
        return res
          .status(400)
          .json({ message: "Cannot add a unit under an inactive parent unit" });
      }
    }

    const newUnit = new AdministrativeUnit({
      name,
      parentUnit,
      description,
      manager,
    });
    await newUnit.save();

    if (parentUnit) {
      parent.subUnits.addToSet(newUnit._id);
      await parent.save();
    }

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

// Update an administrative unit
exports.updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { parentUnit, ...updates } = req.body;

    const unit = await AdministrativeUnit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

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
        return res.status(400).json({
          message: "Cannot assign an inactive unit as a parent",
        });
      }

      if (!unit.parentUnit || !unit.parentUnit.equals(parentUnit)) {
        if (unit.parentUnit) {
          await AdministrativeUnit.findByIdAndUpdate(unit.parentUnit, {
            $pull: { subUnits: unit._id },
          });
        }
        parent.subUnits.addToSet(unit._id);
        await parent.save();
      }
      updates.parentUnit = parentUnit;
    } else {
      if (unit.parentUnit) {
        await AdministrativeUnit.findByIdAndUpdate(unit.parentUnit, {
          $pull: { subUnits: unit._id },
        });
      }
      updates.parentUnit = null;
    }

    const updatedUnit = await AdministrativeUnit.findByIdAndUpdate(
      unitId,
      updates,
      { new: true }
    ).populate("parentUnit subUnits manager");

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

// Delete an administrative unit
exports.deleteUnit = async (req, res) => {
  try {
    const { unitId } = req.params;

    const unit = await AdministrativeUnit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    if (unit.subUnits.length > 0) {
      return res.status(400).json({
        message: "Cannot delete unit with sub-units; remove them first",
      });
    }

    if (unit.parentUnit) {
      await AdministrativeUnit.findByIdAndUpdate(unit.parentUnit, {
        $pull: { subUnits: unit._id },
      });
    }

    await unit.remove();

    const notification = new Notification({
      user: req.user._id,
      message: `Administrative unit "${unit.name}" has been deleted.`,
      type: "AdministrativeUnit",
      referenceId: unit._id,
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
