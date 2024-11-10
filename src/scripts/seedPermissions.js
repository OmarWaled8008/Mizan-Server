const mongoose = require("mongoose");
const Permission = require("../models/Permission");
const dotenv = require("dotenv");

dotenv.config();

const permissions = [
  {
    name: "صلاحية إضافة مستخدم جديد",
    description: "من تمنح له الصلاحية فقط",
    category: "general",
  },
  {
    name: "صلاحية إضافة ميزانية عامة",
    description: "يمكنه كتابة الرقم الأساسي فقط",
    category: "general",
  },
  {
    name: "صلاحية مصروفات",
    description: "يكتب فيها المصروفات ويرفق التقرير وليس الزامي",
    category: "general",
  },
  {
    name: "صلاحية توزيع ميزانيات للقطاعات مع إضافة المبلغ الاحتياطي",
    description:
      "يتم فيها توزيع الميزانيه على القطاعات أو الإدارات ويتم خصمها من المبلغ الأساسي ويتم بعد ذلك اعتماداها بعدة اعتمادات يتم وضعها من مسئول النظام حسب مدير الوحدة بحيث ان المبلغ الاحتياطي يتم كتابته بجانب المبلغ الموزع ويؤخذ من ميزانية القطاع نفسه المثبته ولا يظهر لمسئول القطاع ابدا هذا المبلغ",
    category: "general",
  },
  {
    name: "صلاحية حذف أو تعديل ميزانية",
    description: "ولها سلسلة اعتمتدات",
    category: "general",
  },
  {
    name: "صلاحية اتاحية المبلغ الاحتياطي",
    description:
      "يتم فيها اتاحية المبلغ الاحتياطي للقطاع ومن ثم يتم توزيع من قبل مسئول القطاع",
    category: "general",
  },
  {
    name: "صلاحيات عرض ميزانيات عامه",
    description: "No description available",
    category: "general",
  },
  {
    name: "صلاحية عرض مصروفات عامة",
    description: "No description available",
    category: "general",
  },
  {
    name: "صلاحية عرض ميزانيات مع التقارير عام",
    description: "تظهر له جميع الميزانيات لمن في الهيكل التنظيمي",
    category: "general",
  },
  {
    name: "عرض مصروفات مع التقارير عام",
    description: "تظهر له جميع المصروفات لمن في الهيكل التنظيمي",
    category: "general",
  },
  {
    name: "صلاحية عرض ميزانيات لعدد من الوحدات",
    description: "يتم عرض الميزانيه حسب الوحدات المحدده له من قبل الادمن",
    category: "general",
  },
  {
    name: "صلاحية عرض مصروفات لعدد من الوحدات",
    description: "يمتم عرض المصروفات حسب الوحدات المحدده له من قبل الادمن",
    category: "general",
  },
  {
    name: "صلاحية عرض ميزانية لعدد من الوحدات",
    description: "يتم عرض الميزانيه لعدد من الوحدات",
    category: "general",
  },
  {
    name: "صلاحية عرض مصروفات لعدد من الوحدات",
    description: "يتم عرض الميزانيه لعدد من الوحدات",
    category: "general",
  },
  {
    name: "صلاحية عرض الميزانية الخاصة بالوحدات الإدارية الخاصه به او التابعه لها",
    description: "No description available",
    category: "general",
  },
  {
    name: "صلاحية عرض المصروفات بالوحدات الإدارية الخاصه به او التابعه له",
    description: "No description available",
    category: "general",
  },
  {
    name: "صلاحية إضافة وحدة إدارية على الهيكل التنظيمي",
    description: "No description available",
    category: "general",
  },
  {
    name: "طلب مناقلة",
    description:
      "يتم إضافة هذه الصلاحية بحيث يتم كتابة الرقم المطلوب نقله وإظهار كذلك الوحدة الإدارية المرغوب النقل اليها وتظهر هذه الاشعارات له ومن هم في سلسلة الاعتمادات سواء على النظام او عن طريق الايميل",
    category: "general",
  },
  {
    name: "طلب الغاء وحدة إدارية",
    description:
      "يتم اظهار الوحدات الإدارية المرغوب نقلها له التابعه له فقط مع ملاحظة لو كان هنالك مبلغ يتم مطالبته بنقل المبلغ",
    category: "general",
  },
  {
    name: "طلب ميزانية",
    description:
      "يتم اتاحة الطلب عند الحاجه بمنحه الصلاحية ويحدد فيه المبلغ المطلوب دعمه به",
    category: "general",
  },
  {
    name: "طلب إضافة وحدة إدارية جديده",
    description:
      "يتم منحه إصلاحية حسب الحاجه ويكتب فيها اسم الوحدة الإدارية لتضمينها في الهيكل التنظيمي",
    category: "general",
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
