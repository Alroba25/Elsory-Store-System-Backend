const mongoose = require("mongoose");

const cashMovementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const shiftSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cashierName: {
      type: String,
      required: true,
      trim: true,
    },

    openingCash: {
      type: Number,
      required: true,
      min: 0,
    },

    closingCash: {
      type: Number,
      min: 0,
    },

    totalCashSales: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCashRefunds: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDeposits: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalWithdrawals: {
      type: Number,
      default: 0,
      min: 0,
    },

    expectedCash: {
      type: Number,
      min: 0,
    },

    difference: {
      type: Number,
    },

    movements: {
      type: [cashMovementSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    openedAt: {
      type: Date,
      default: Date.now,
    },

    closedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// A cashier can have only one open shift at a time.
shiftSchema.index(
  { cashier: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "open" },
  },
);

module.exports = mongoose.model("Shift", shiftSchema);
