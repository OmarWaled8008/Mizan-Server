const Cycle = require("../models/Cycle");
const Budget = require("../models/Budget");

// إنشاء دورة جديدة
exports.createCycle = async (req, res) => {
  try {
    const { name, startDate, endDate, budget, description } = req.body;

    // التحقق من صحة التواريخ
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // التحقق من وجود الميزانية
    const foundBudget = await Budget.findById(budget);
    if (!foundBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // التحقق من عدم وجود دورة متداخلة لنفس الميزانية
    const overlappingCycle = await Cycle.findOne({
      budget,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    });

    if (overlappingCycle) {
      return res
        .status(400)
        .json({ message: "Overlapping cycle exists for this budget" });
    }

    const newCycle = new Cycle({
      name,
      startDate,
      endDate,
      budget,
      description,
    });

    await newCycle.save();
    res
      .status(201)
      .json({ message: "Cycle created successfully", cycle: newCycle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating cycle", error: error.message });
  }
};

// عرض جميع الدورات
exports.getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find().populate("budget");
    res.status(200).json(cycles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cycles", error: error.message });
  }
};

// تحديث دورة
exports.updateCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const { budget, startDate, endDate, ...updates } = req.body;

    // التحقق من صحة التواريخ
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // التحقق من وجود الميزانية إذا كانت موجودة في التحديث
    if (budget) {
      const foundBudget = await Budget.findById(budget);
      if (!foundBudget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      updates.budget = budget;
    }

    const updatedCycle = await Cycle.findByIdAndUpdate(
      cycleId,
      { ...updates, startDate, endDate },
      {
        new: true,
      }
    ).populate("budget");

    if (!updatedCycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }

    res.json({ message: "Cycle updated successfully", cycle: updatedCycle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cycle", error: error.message });
  }
};

// حذف دورة
exports.deleteCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const deletedCycle = await Cycle.findByIdAndDelete(cycleId);

    if (!deletedCycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }

    res.json({ message: "Cycle deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting cycle", error: error.message });
  }
};
