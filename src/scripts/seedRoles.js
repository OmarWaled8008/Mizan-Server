// src/seed/seedRoles.js
const mongoose = require("mongoose");
const Role = require("../models/Role");
const dotenv = require("dotenv");

dotenv.config();

const roles = [
  { name: "مدير" },
  { name: "موظف" },
  { name: "رئيس" },
  { name: "مشرف عام" },
  { name: "نائب" },
  { name: "مدير عام" },
  { name: "مدير إدارة" },
  { name: "مدير قسم" },
  { name: "شريك اعمال" },
  { name: "منافع" },
  { name: "المشرف العام على رأس المال البشري والخدمات المشتركة" },
  { name: "نائب الرئيس لقطاع رأس المال البشري" },
  { name: "مدير عام الموازنة والتخطيط المالي" },
  { name: "المشرف العام على الشؤون المالية والقانونية والتنظيمية" },
  { name: "نائب الرئيس للشؤون المالية" },
  { name: "مدير عام تمكين اعمال رأس المال البشري" },
  { name: "مدير عام المراجعة الداخلية" },
  { name: "مسؤول النظام" }, // Admin role
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Database connected, seeding roles...");

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Role ${roleData.name} added successfully.`);
      } else {
        console.log(`Role ${roleData.name} already exists. Skipping...`);
      }
    }

    console.log("Roles seeding completed successfully!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error seeding roles:", error);
    mongoose.connection.close();
  });
