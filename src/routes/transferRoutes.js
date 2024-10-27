// src/routes/transferRoutes.js
const express = require("express");
const router = express.Router();
const transferController = require("../controllers/TransferController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { body } = require("express-validator");

// Routes for transfer management

// Create a new transfer
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["create_transfers"]),
  [
    body("sourceUnit").notEmpty().withMessage("Source unit is required"),
    body("destinationUnit")
      .notEmpty()
      .withMessage("Destination unit is required"),
    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
    body("date").isISO8601().withMessage("Valid date is required"),
  ],
  transferController.createTransfer
);

// Get all transfers
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["view_transfers"]),
  transferController.getTransfers
);

// Update a transfer by ID
router.put(
  "/:transferId",
  authMiddleware,
  permissionMiddleware(["edit_transfers"]),
  [
    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
  ],
  transferController.updateTransfer
);

// Delete a transfer by ID
router.delete(
  "/:transferId",
  authMiddleware,
  permissionMiddleware(["delete_transfers"]),
  transferController.deleteTransfer
);

module.exports = router;
