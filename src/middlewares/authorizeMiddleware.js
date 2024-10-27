// src/middlewares/authorizeMiddleware.js
const authorizeMiddleware = (requiredPermissions, requireAll = false) => {
  return async (req, res, next) => {
    try {
      const userPermissions = await req.user.getCombinedPermissions();
      const hasPermissions = requireAll
        ? requiredPermissions.every((perm) => userPermissions.includes(perm))
        : requiredPermissions.some((perm) => userPermissions.includes(perm));

      if (!hasPermissions) {
        console.error(
          `Unauthorized access attempt: ${req.method} ${req.url} - User ID: ${req.user.id}`
        );
        return res
          .status(403)
          .json({ message: "You do not have the necessary permissions." });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Error checking authorization" });
    }
  };
};

module.exports = authorizeMiddleware;
