require("dotenv").config();
const mongoose = require("mongoose");
const AdministrativeUnit = require("../models/AdministrativeUnit");

const seedAdministrativeUnits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing units
    await AdministrativeUnit.deleteMany({});

    // Define units according to the hierarchy
    const unitsData = [
      { name: "الرئيس", description: "الرئيس" },
      {
        name: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        description: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        parentUnit: "الرئيس",
      },
      {
        name: "قطاع الخدمات المشتركة",
        description: "قطاع الخدمات المشتركة",
        parentUnit: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
      },
      {
        name: "قطاع رأس المال البشري",
        description: "قطاع رأس المال البشري",
        parentUnit: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
      },
      {
        name: "الإدارة العامة لتجربة الموظف",
        description: "الإدارة العامة لتجربة الموظف",
        parentUnit: "قطاع رأس المال البشري",
      },
      {
        name: "الإدارة العامة لتميز رأس المال البشري",
        description: "الإدارة العامة لتميز رأس المال البشري",
        parentUnit: "قطاع رأس المال البشري",
      },
      {
        name: "الإدارة العامة لتمكين رأس المال البشري",
        description: "الإدارة العامة لتمكين رأس المال البشري",
        parentUnit: "قطاع رأس المال البشري",
      },
      {
        name: "الإدارة العامة للمراجعة الداخلية",
        description: "الإدارة العامة للمراجعة الداخلية",
        parentUnit: "الرئيس",
      },
    ];

    // Helper function to find or create unit by name
    const findOrCreateUnit = async (unitData) => {
      const existingUnit = await AdministrativeUnit.findOne({
        name: unitData.name,
      });
      if (existingUnit) return existingUnit;

      const parent = unitData.parentUnit
        ? await AdministrativeUnit.findOne({ name: unitData.parentUnit })
        : null;

      const newUnit = new AdministrativeUnit({
        name: unitData.name,
        description: unitData.description,
        parentUnit: parent ? parent._id : null,
      });

      await newUnit.save();

      // Update parent with the new unit as a sub-unit
      if (parent) {
        parent.subUnits.addToSet(newUnit._id);
        await parent.save();
      }

      return newUnit;
    };

    // Seed all units
    for (const unitData of unitsData) {
      await findOrCreateUnit(unitData);
    }

    console.log("Administrative units seeded successfully!");
  } catch (error) {
    console.error("Error seeding administrative units:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdministrativeUnits();
