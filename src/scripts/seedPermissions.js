const mongoose = require("mongoose");
const Permission = require("../models/Permission");
const dotenv = require("dotenv");

dotenv.config();

// القائمة المعدلة للصلاحيات
const permissions = [
  // صلاحيات المستخدمين
  {
    name: "view_users",
    description: "عرض قائمة بجميع المستخدمين",
    category: "user",
  },
  { name: "create_users", description: "إنشاء مستخدمين جدد", category: "user" },
  {
    name: "edit_users",
    description: "تعديل تفاصيل المستخدمين",
    category: "user",
  },
  { name: "delete_users", description: "حذف المستخدمين", category: "user" },
  {
    name: "assign_roles",
    description: "تعيين الأدوار للمستخدمين",
    category: "user",
  },
  {
    name: "manage_permissions",
    description: "إدارة الصلاحيات للمستخدمين والأدوار",
    category: "user",
  },

  // صلاحيات الأدوار
  { name: "view_roles", description: "عرض جميع الأدوار", category: "role" },
  { name: "create_roles", description: "إنشاء أدوار جديدة", category: "role" },
  { name: "edit_roles", description: "تعديل تفاصيل الأدوار", category: "role" },
  { name: "delete_roles", description: "حذف الأدوار", category: "role" },

  // صلاحيات الصلاحيات (Permissions)
  {
    name: "view_permissions",
    description: "عرض جميع الصلاحيات",
    category: "permission",
  },
  {
    name: "assign_permissions",
    description: "تعيين الصلاحيات للأدوار",
    category: "permission",
  },

  // صلاحيات التقارير
  {
    name: "view_reports",
    description: "الوصول إلى التقارير وعرضها",
    category: "report",
  },
  {
    name: "generate_reports",
    description: "إنشاء تقارير جديدة",
    category: "report",
  },
  { name: "edit_reports", description: "تعديل التقارير", category: "report" },
  { name: "delete_reports", description: "حذف التقارير", category: "report" },
  {
    name: "export_reports",
    description: "تصدير التقارير وتنزيلها بصيغة CSV",
    category: "report",
  },
  {
    name: "view_all_reports",
    description: "مشاهدة جميع التقارير النظامية",
    category: "report",
  },
  {
    name: "view_department_reports",
    description: "مشاهدة التقارير الخاصة بالأقسام",
    category: "report",
  },
  {
    name: "view_financial_reports",
    description: "مشاهدة التقارير المالية مثل المصروفات والميزانيات",
    category: "report",
  },
  {
    name: "view_overview_reports",
    description: "مشاهدة التقارير الشاملة التي تغطي كل النظام",
    category: "report",
  },

  // صلاحيات الميزانيات
  { name: "view_budgets", description: "عرض الميزانيات", category: "budget" },
  {
    name: "create_budgets",
    description: "إنشاء ميزانيات جديدة",
    category: "budget",
  },
  {
    name: "edit_budgets",
    description: "تعديل تفاصيل الميزانيات",
    category: "budget",
  },
  { name: "delete_budgets", description: "حذف الميزانيات", category: "budget" },
  {
    name: "approve_budgets",
    description: "الموافقة على أو رفض الميزانيات",
    category: "budget",
  },

  // صلاحيات المصروفات
  { name: "view_expenses", description: "عرض المصروفات", category: "expense" },
  {
    name: "create_expenses",
    description: "إنشاء مصروفات جديدة",
    category: "expense",
  },
  {
    name: "edit_expenses",
    description: "تعديل تفاصيل المصروفات",
    category: "expense",
  },
  {
    name: "delete_expenses",
    description: "حذف المصروفات",
    category: "expense",
  },

  // صلاحيات التحويلات
  {
    name: "view_transfers",
    description: "عرض التحويلات",
    category: "transfer",
  },
  {
    name: "create_transfers",
    description: "إنشاء تحويلات جديدة",
    category: "transfer",
  },
  {
    name: "approve_transfers",
    description: "الموافقة على أو رفض التحويلات",
    category: "transfer",
  },
  {
    name: "edit_transfers",
    description: "تعديل تفاصيل التحويلات",
    category: "transfer",
  },
  {
    name: "delete_transfers",
    description: "حذف التحويلات",
    category: "transfer",
  },

  // صلاحيات الوحدات الإدارية
  {
    name: "view_administrative_units",
    description: "عرض الوحدات الإدارية",
    category: "administrative_unit",
  },
  {
    name: "create_administrative_units",
    description: "إنشاء وحدات إدارية جديدة",
    category: "administrative_unit",
  },
  {
    name: "edit_administrative_units",
    description: "تعديل تفاصيل الوحدات الإدارية",
    category: "administrative_unit",
  },
  {
    name: "delete_administrative_units",
    description: "حذف الوحدات الإدارية",
    category: "administrative_unit",
  },

  // صلاحيات النظام
  {
    name: "manage_settings",
    description: "الوصول إلى إعدادات النظام وتعديلها",
    category: "system",
  },
  {
    name: "manage_notifications",
    description: "إدارة الإشعارات النظامية",
    category: "system",
  },
  {
    name: "view_logs",
    description: "عرض سجلات النظام للتدقيق",
    category: "system",
  },
  {
    name: "manage_backup",
    description: "إدارة النسخ الاحتياطية للنظام واستعادتها",
    category: "system",
  },
  {
    name: "monitor_system",
    description: "مراقبة حالة وصحة النظام",
    category: "system",
  },
  { name: "admin", description: "يملك كافة الصلاحيات", category: "system" },
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
