const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimiter = require("./src/middlewares/rateLimiter");
const authMiddleware = require("./src/middlewares/authMiddleware");
const notFoundMiddleware = require("./src/middlewares/notFoundMiddleware");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const permissionRoutes = require("./src/routes/permissionRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const administrativeUnitRoutes = require("./src/routes/administrativeUnitRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const cycleRoutes = require("./src/routes/cycleRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const transferRoutes = require("./src/routes/transferRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const budgetRequestRoutes = require("./src/routes/budgetRequestRoutes");
const historicalRecordRoutes = require("./src/routes/historicalRecordRoutes");

// Create Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

// Apply rate limiter middleware
app.use(rateLimiter);

// Set up routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/administrative-units", administrativeUnitRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/budgets/requests", budgetRequestRoutes);
app.use("/api/v1/cycles", cycleRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/transfers", transferRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/historical-records", historicalRecordRoutes);

// Fallback route for handling non-existent endpoints
app.use(notFoundMiddleware);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
