// src/controllers/HistoricalRecordController.js
const HistoricalRecord = require("../models/HistoricalRecord");
const User = require("../models/User");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Cycle = require("../models/Cycle");

exports.saveHistoricalRecords = async (req, res) => {
  try {
    // 1. جلب جميع المستخدمين
    const users = await User.find();
    for (const user of users) {
      await HistoricalRecord.create({
        recordType: "User",
        recordId: user._id,
        data: user,
      });
    }

    // 2. جلب جميع الميزانيات
    const budgets = await Budget.find();
    for (const budget of budgets) {
      await HistoricalRecord.create({
        recordType: "Budget",
        recordId: budget._id,
        data: budget,
      });
    }

    // 3. جلب جميع المصروفات
    const expenses = await Expense.find();
    for (const expense of expenses) {
      await HistoricalRecord.create({
        recordType: "Expense",
        recordId: expense._id,
        data: expense,
      });
    }

    // 4. جلب جميع الدورات
    const cycles = await Cycle.find();
    for (const cycle of cycles) {
      await HistoricalRecord.create({
        recordType: "Cycle",
        recordId: cycle._id,
        data: cycle,
      });
    }

    res.status(201).json({ message: "Historical records saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving historical records" });
  }
};
exports.getAllRecords = async (req, res) => {
  try {
    const records = await HistoricalRecord.find().populate("recordId").exec();

    // تحسين عرض السجلات
    const formattedRecords = records.map((record) => {
      return {
        نوع_السجل: record.recordType,
        اسم_السجل: record.data.name || record.data.title, // استخدم اسم المستخدم أو عنوان المصروف
        تفاصيل: record.data, // يمكنك اختيار عرض معلومات محددة هنا
        تاريخ_الإنشاء: record.createdAt,
      };
    });

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ error: "Error fetching historical records" });
  }
};
