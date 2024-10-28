const express = require("express");
const router = express.Router();
const transferController = require("../controllers/TransferController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const loggingMiddleware = require("../middlewares/loggingMiddleware");
const auditLogMiddleware = require("../middlewares/auditLogMiddleware");
const { body } = require("express-validator");

// Get all transfers
router.get(
  "/all",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["view_transfers"]),
  loggingMiddleware,
  transferController.getAllTransfers
);

// Create a new transfer
router.post(
  "/create",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["create_transfers"]),
  loggingMiddleware,
  [
    body("sourceUnit").notEmpty().withMessage("Source unit is required"),
    body("destinationUnit")
      .notEmpty()
      .withMessage("Destination unit is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("date").isISO8601().withMessage("Date must be in a valid format"),
  ],
  transferController.createTransfer
);

// Update transfer status (approve/reject)
router.put(
  "/update/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["approve_transfers"]),
  loggingMiddleware,
  [
    body("status")
      .isIn(["approved", "rejected"])
      .withMessage("Status must be either 'approved' or 'rejected'"),
  ],
  transferController.updateTransferStatus
);

// Delete a transfer
router.delete(
  "/delete/:id",
  authMiddleware,
  auditLogMiddleware,
  permissionMiddleware(["delete_transfers"]),
  loggingMiddleware,
  transferController.deleteTransfer
);

module.exports = router;
