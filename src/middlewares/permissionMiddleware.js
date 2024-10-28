// src/middlewares/permissionMiddleware.js
const permissionMiddleware = (requiredPermissions, checkAll = false) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        console.error("User not found in request.");
        return res.status(401).json({ message: "Unauthorized access." });
      }

      console.log("Checking permissions for user:", req.user._id);

      // جلب الصلاحيات الخاصة بالمستخدم
      const userPermissions = await req.user.getCombinedPermissions();

      console.log("User permissions:", userPermissions);
      console.log("Required permissions:", requiredPermissions);

      // التحقق إذا كان المستخدم لديه صلاحية "admin" لتجاوز التحقق من الصلاحيات الأخرى
      if (userPermissions.includes("admin")) {
        console.log("User has admin permission, bypassing checks.");
        return next(); // تخطي التحقق من الصلاحيات الأخرى والسماح بالمرور
      }

      // التحقق من الصلاحيات المطلوبة بناءً على إذا كان المطلوب كل الصلاحيات أو بعض منها
      const hasPermission = checkAll
        ? requiredPermissions.every((perm) => userPermissions.includes(perm))
        : requiredPermissions.some((perm) => userPermissions.includes(perm));

      if (!hasPermission) {
        console.error(
          `Access denied for user ID: ${req.user._id}. Required permissions: ${requiredPermissions}`
        );
        return res.status(403).json({
          message: `Access denied. Required permissions: ${requiredPermissions.join(
            ", "
          )}`,
        });
      }

      // لو كل شيء تمام، نكمل للـ next middleware
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Error checking permissions" });
    }
  };
};

module.exports = permissionMiddleware;
