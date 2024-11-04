const mongoose = require("mongoose");
const Permission = require("../models/Permission");
const dotenv = require("dotenv");

dotenv.config();

const permissions = [
  // صلاحيات عامة للمستخدمين
  { name: "user_view", description: "عرض قائمة المستخدمين", category: "user" },
  { name: "user_create", description: "إنشاء مستخدم جديد", category: "user" },
  {
    name: "user_edit",
    description: "تعديل تفاصيل المستخدمين",
    category: "user",
  },
  { name: "user_delete", description: "حذف المستخدمين", category: "user" },

  // صلاحيات عامة للأدوار
  { name: "role_view", description: "عرض قائمة الأدوار", category: "role" },
  { name: "role_create", description: "إنشاء دور جديد", category: "role" },
  { name: "role_edit", description: "تعديل تفاصيل الأدوار", category: "role" },
  { name: "role_delete", description: "حذف الأدوار", category: "role" },

  // صلاحيات إدارة الصلاحيات
  {
    name: "permission_view",
    description: "عرض جميع الصلاحيات",
    category: "permission",
  },
  {
    name: "permission_assign",
    description: "تعيين الصلاحيات للأدوار",
    category: "permission",
  },

  // صلاحيات الميزانيات
  { name: "budget_view", description: "عرض الميزانيات", category: "budget" },
  {
    name: "budget_create",
    description: "إنشاء ميزانية جديدة",
    category: "budget",
  },
  {
    name: "budget_edit",
    description: "تعديل تفاصيل الميزانية",
    category: "budget",
  },
  { name: "budget_delete", description: "حذف الميزانية", category: "budget" },
  {
    name: "budget_approve",
    description: "الموافقة على الميزانية",
    category: "budget",
  },

  // صلاحيات المصروفات
  { name: "expense_view", description: "عرض المصروفات", category: "expense" },
  {
    name: "expense_create",
    description: "إضافة مصروفات جديدة",
    category: "expense",
  },
  {
    name: "expense_edit",
    description: "تعديل تفاصيل المصروفات",
    category: "expense",
  },
  { name: "expense_delete", description: "حذف المصروفات", category: "expense" },

  // صلاحيات التقارير
  { name: "report_view", description: "عرض التقارير", category: "report" },
  {
    name: "report_create",
    description: "إنشاء تقرير جديد",
    category: "report",
  },
  { name: "report_edit", description: "تعديل التقارير", category: "report" },
  { name: "report_delete", description: "حذف التقارير", category: "report" },
  {
    name: "report_export",
    description: "تصدير التقارير بصيغة CSV",
    category: "report",
  },

  // صلاحيات الوحدات الإدارية
  {
    name: "administrative_unit_view",
    description: "عرض الوحدات الإدارية",
    category: "administrative_unit",
  },
  {
    name: "administrative_unit_create",
    description: "إنشاء وحدة إدارية جديدة",
    category: "administrative_unit",
  },
  {
    name: "administrative_unit_edit",
    description: "تعديل تفاصيل الوحدات الإدارية",
    category: "administrative_unit",
  },
  {
    name: "administrative_unit_delete",
    description: "حذف الوحدات الإدارية",
    category: "administrative_unit",
  },

  // صلاحيات النظام العامة
  {
    name: "system_settings",
    description: "الوصول إلى إعدادات النظام وتعديلها",
    category: "system",
  },
  {
    name: "system_logs",
    description: "عرض سجلات النظام للتدقيق",
    category: "system",
  },
  {
    name: "system_backup",
    description: "إدارة النسخ الاحتياطية واستعادتها",
    category: "system",
  },
  {
    name: "system_monitor",
    description: "مراقبة النظام وصحته",
    category: "system",
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Database connected, seeding permissions...");

    for (const perm of permissions) {
      const existingPermission = await Permission.findOne({ name: perm.name });
      if (!existingPermission) {
        await Permission.create(perm);
        console.log(`Permission ${perm.name} added successfully.`);
      } else {
        console.log(`Permission ${perm.name} already exists. Skipping...`);
      }
    }

    console.log("Permissions seeding completed successfully!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error seeding permissions:", error);
    mongoose.connection.close();
  });
