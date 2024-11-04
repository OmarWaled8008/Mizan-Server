const Cycle = require("../models/Cycle");
const Notification = require("../models/Notification");

const checkAndCreateNewCycle = async () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const activeCycle = await Cycle.findOne({
    startDate: { $lte: today },
    endDate: { $gte: today },
  });

  if (!activeCycle) {
    const newCycle = new Cycle({
      title: `دورة ${currentMonth}-${currentYear}`,
      startDate: new Date(currentYear, currentMonth - 1, 1),
      endDate: new Date(currentYear, currentMonth, 0),
      description: `الدورة الافتراضية لشهر ${currentMonth} سنة ${currentYear}`,
    });
    await newCycle.save();

    const notification = new Notification({
      message: `تم بدء دورة جديدة لشهر ${currentMonth} سنة ${currentYear}.`,
      type: "Cycle",
      referenceId: newCycle._id,
    });
    await notification.save();
  }
};

module.exports = checkAndCreateNewCycle;
