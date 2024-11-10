require("dotenv").config();
const mongoose = require("mongoose");
const AdministrativeUnit = require("../models/AdministrativeUnit");
const Notification = require("../models/Notification");

exports.getUnits = async (req, res) => {
  try {
    const units = await AdministrativeUnit.find()
      .populate("parentUnit", "name")
      .populate("subUnits", "name")
      .populate("manager", "name");
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
      parentUnit: parent ? parent._id : null,
      description,
      manager,
    });
    await newUnit.save();

    if (parent) {
      parent.subUnits.addToSet(newUnit._id);
      await parent.save();
    }

    const notification = new Notification({
      user:
        req.user?._id ||
        new mongoose.Types.ObjectId("000000000000000000000000"),
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

    // Find the unit to update
    const unit = await AdministrativeUnit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Check if the new parent unit exists and is valid
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

      // Update parent-subunit relationships if changing parent
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

    // Save updates to the unit
    const updatedUnit = await AdministrativeUnit.findByIdAndUpdate(
      unitId,
      updates,
      { new: true }
    ).populate("parentUnit subUnits manager");

    // Create a notification for the update
    const notification = new Notification({
      user: req.user?._id,
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

// Retrieve hierarchical structure of all units
exports.getUnitsHierarchy = async (req, res) => {
  try {
    const rootUnits = await AdministrativeUnit.find({ parentUnit: null });

    const buildHierarchy = async (unit) => {
      const subUnits = await AdministrativeUnit.find({ parentUnit: unit._id });
      const subUnitsWithHierarchy = await Promise.all(
        subUnits.map(async (subUnit) => ({
          ...subUnit._doc,
          subUnits: await buildHierarchy(subUnit),
        }))
      );
      return subUnitsWithHierarchy;
    };

    const hierarchy = await Promise.all(
      rootUnits.map(async (rootUnit) => ({
        ...rootUnit._doc,
        subUnits: await buildHierarchy(rootUnit),
      }))
    );

    res.status(200).json(hierarchy);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving administrative units hierarchy",
      message: error.message,
    });
  }
};

// Delete an administrative unit
exports.deleteUnit = async (req, res) => {
  try {
    const { unitId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(unitId)) {
      return res.status(400).json({ message: "Invalid unit ID format" });
    }

    const unit = await AdministrativeUnit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // Ensure no sub-units are associated with the unit before deletion
    if (unit.subUnits && unit.subUnits.length > 0) {
      return res.status(400).json({
        message: "Cannot delete unit with sub-units; remove them first",
      });
    }

    // Remove the unit from parent's subUnits if it has a parent
    if (unit.parentUnit) {
      await AdministrativeUnit.findByIdAndUpdate(unit.parentUnit, {
        $pull: { subUnits: unit._id },
      });
    }

    // Remove the unit itself
    await unit.deleteOne();

    // Send a notification after deletion
    const userId =
      req.user?._id || new mongoose.Types.ObjectId("000000000000000000000000");
    const notification = new Notification({
      user: userId,
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

exports.getUnit = async (req, res) => {
  try {
    const { unitId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(unitId)) {
      console.error("Invalid unit ID format:", unitId);
      return res.status(400).json({ message: "Invalid unit ID format" });
    }

    console.log("Attempting to retrieve unit with ID:", unitId);

    // Use findById to retrieve the unit directly by ID
    const unit = await AdministrativeUnit.findById(unitId)
      .populate("parentUnit")
      .populate("subUnits")
      .populate("manager");

    if (!unit) {
      console.warn("Unit not found in database:", unitId);
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json(unit);
  } catch (error) {
    console.error("Error retrieving administrative unit:", error);
    res.status(500).json({
      message: "Error retrieving administrative unit",
      error: error.message,
    });
  }
};
