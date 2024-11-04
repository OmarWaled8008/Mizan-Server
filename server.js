const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron"); // إضافة node-cron
const checkAndCreateNewCycle = require("./src/controllers/checkAndCreateNewCycle"); // استيراد الدالة الخاصة بالتأكد وإنشاء الدورات
dotenv.config();

const app = require("./app");
const PORT = process.env.PORT || 8000;

// إعداد الاتصال بقاعدة البيانات وتشغيل السيرفر
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// جدولة التشغيل اليومي عند منتصف الليل
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled cycle check at midnight");
  checkAndCreateNewCycle();
});
