const AdministrativeUnit = require("../models/AdministrativeUnit");

const getSubordinateUnits = async (unitId) => {
  const units = [];

  // دالة تكرارية لاسترجاع الوحدات الفرعية
  const findSubUnits = async (parentId) => {
    const subUnits = await AdministrativeUnit.find({ parentUnit: parentId });
    for (const subUnit of subUnits) {
      units.push(subUnit._id); // إضافة الوحدة الفرعية إلى القائمة
      await findSubUnits(subUnit._id); // تكرار للوحدات الفرعية
    }
  };

  await findSubUnits(unitId); // البدء من الوحدة الأساسية
  return units;
};

module.exports = getSubordinateUnits;
