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

    // Define units according to the hierarchy in the image
    const unitsData = [
      {
        name: "الرئيس",
        description: "الرئيس",
        budgets: [],
        expenses: [],
      },
      {
        name: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        description: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        parentUnit: "الرئيس",
        budgets: [],
        expenses: [],
      },
      {
        name: "قطاع الخدمات المشتركة",
        description: "قطاع الخدمات المشتركة",
        parentUnit: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        budgets: [],
        expenses: [],
      },
      {
        name: "قطاع رأس المال البشري",
        description: "قطاع رأس المال البشري",
        parentUnit: "المشرف العام على قطاع رأس المال البشري والخدمات المشتركة",
        budgets: [],
        expenses: [],
      },
      {
        name: "الإدارة العامة لتجربة الموظف",
        description: "الإدارة العامة لتجربة الموظف",
        parentUnit: "قطاع رأس المال البشري",
        budgets: [],
        expenses: [],
      },
      {
        name: "الإدارة العامة لتميز رأس المال البشري",
        description: "الإدارة العامة لتميز رأس المال البشري",
        parentUnit: "قطاع رأس المال البشري",
        budgets: [],
        expenses: [],
      },
      {
        name: "الإدارة العامة لتمكين رأس المال البشري",
        description: "الإدارة العامة لتمكين رأس المال البشري",
        parentUnit: "قطاع رأس المال البشري",
        budgets: [],
        expenses: [],
      },
      {
        name: "الإدارة العامة للمراجعة الداخلية",
        description: "الإدارة العامة للمراجعة الداخلية",
        parentUnit: "الرئيس",
        budgets: [],
        expenses: [],
      },
    ];

    // Helper function to find a unit by name and return its ID
    const findUnitIdByName = async (name) => {
      const unit = await AdministrativeUnit.findOne({ name });
      return unit ? unit._id : null;
    };

    // Create units with references to their parent units
    for (const unitData of unitsData) {
      const { parentUnit, ...data } = unitData;
      if (parentUnit) {
        const parentId = await findUnitIdByName(parentUnit);
        if (parentId) {
          data.parentUnit = parentId;
        }
      }

      const unit = new AdministrativeUnit(data);
      await unit.save();

      // Update parent unit's subUnits array
      if (data.parentUnit) {
        await AdministrativeUnit.findByIdAndUpdate(data.parentUnit, {
          $addToSet: { subUnits: unit._id },
        });
      }
    }

    console.log("Administrative units seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding administrative units:", error);
    mongoose.connection.close();
  }
};

seedAdministrativeUnits();
