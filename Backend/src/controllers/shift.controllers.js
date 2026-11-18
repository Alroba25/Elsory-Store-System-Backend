const mongoose = require("mongoose");
const Shift = require("../models/shift.model");

const openShift = async (req, res) => {
  try {
    const cashierId = req.user._id;
    const { openingCash } = req.body;

    // Validate opening cash
    if (
      openingCash === undefined ||
      typeof openingCash !== "number" ||
      !Number.isFinite(openingCash) ||
      openingCash < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Opening cash must be a valid non-negative number",
      });
    }

    // Check for an existing open shift
    const existingShift = await Shift.findOne({
      cashier: cashierId,
      status: "open",
    });

    if (existingShift) {
      return res.status(409).json({
        success: false,
        message: "You already have an open shift",
        shift: existingShift,
      });
    }

    const shift = await Shift.create({
      cashier: cashierId,
      cashierName: req.user.name,
      openingCash,
    });

    return res.status(201).json({
      success: true,
      message: "Shift opened successfully",
      shift,
    });
  } catch (error) {
    // Handle duplicate open-shift index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have an open shift",
      });
    }

    console.error("Open Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to open shift",
    });
  }
};

const getCurrentShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({
      cashier: req.user._id,
      status: "open",
    });

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "You don't have an open shift",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current shift retrieved successfully",
      shift,
    });
  } catch (error) {
    console.error("Get Current Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve current shift",
    });
  }
};

const createCashMovement = async (req, res) => {
  try {
    const { type, amount, reason } = req.body || {};

    if (!["deposit", "withdrawal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Movement type must be deposit or withdrawal",
      });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Movement reason is required",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const roundedAmount = Number(amount.toFixed(2));

    const update = {
      $push: {
        movements: {
          type,
          amount: roundedAmount,
          reason: reason.trim(),
          createdBy: req.user._id,
          createdAt: new Date(),
        },
      },
    };

    if (type === "deposit") {
      update.$inc = { totalDeposits: roundedAmount };
    } else {
      update.$inc = { totalWithdrawals: roundedAmount };
    }

    const filter = {
      cashier: req.user._id,
      status: "open",
    };

    // Prevent withdrawing more than the current drawer balance.
    if (type === "withdrawal") {
      filter.$expr = {
        $gte: [
          {
            $subtract: [
              {
                $add: ["$openingCash", "$totalCashSales", "$totalDeposits"],
              },
              {
                $add: ["$totalCashRefunds", "$totalWithdrawals"],
              },
            ],
          },
          roundedAmount,
        ],
      };
    }

    const shift = await Shift.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    if (!shift) {
      const openShift = await Shift.findOne({
        cashier: req.user._id,
        status: "open",
      });

      if (!openShift) {
        return res.status(409).json({
          success: false,
          message: "You don't have an open shift",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Insufficient cash in the drawer",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Cash movement recorded successfully",
      shift,
    });
  } catch (error) {
    console.error("Cash Movement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record cash movement",
    });
  }
};

const getShiftSummary = async (req, res) => {
  try {
    const shift = await Shift.findOne({
      cashier: req.user._id,
      status: "open",
    });

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "You don't have an open shift",
      });
    }

    const expectedCash =
      shift.openingCash +
      shift.totalCashSales -
      shift.totalCashRefunds +
      shift.totalDeposits -
      shift.totalWithdrawals;

    const totalVisaSales = shift.totalVisaSales || 0;
    const totalVisaRefunds = shift.totalVisaRefunds || 0;
    const totalInstapaySales = shift.totalInstapaySales || 0;
    const totalInstapayRefunds = shift.totalInstapayRefunds || 0;
    const totalWalletSales = shift.totalWalletSales || 0;
    const totalWalletRefunds = shift.totalWalletRefunds || 0;

    return res.status(200).json({
      success: true,
      message: "Shift summary retrieved successfully",
      summary: {
        cashier: shift.cashierName,
        openedAt: shift.openedAt,
        status: shift.status,

        openingCash: shift.openingCash,
        totalCashSales: shift.totalCashSales,
        totalCashRefunds: shift.totalCashRefunds,
        totalDeposits: shift.totalDeposits,
        totalWithdrawals: shift.totalWithdrawals,

        totalVisaSales,
        totalVisaRefunds,
        expectedVisa: Number((totalVisaSales - totalVisaRefunds).toFixed(2)),

        totalInstapaySales,
        totalInstapayRefunds,
        expectedInstapay: Number(
          (totalInstapaySales - totalInstapayRefunds).toFixed(2),
        ),

        totalWalletSales,
        totalWalletRefunds,
        expectedWallet: Number(
          (totalWalletSales - totalWalletRefunds).toFixed(2),
        ),

        expectedCash,
        movements: shift.movements,
      },
    });
  } catch (error) {
    console.error("Get Shift Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve shift summary",
    });
  }
};

const closeShift = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      closingCash,
      closingVisa,
      closingInstapay,
      closingWallet,
    } = req.body || {};

    // 1. Validate actual counted cash
    if (
      typeof closingCash !== "number" ||
      !Number.isFinite(closingCash) ||
      closingCash < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Closing cash must be a valid non-negative number",
      });
    }

    const optionalFields = [
      { key: "closingVisa", val: closingVisa, label: "Closing Visa" },
      {
        key: "closingInstapay",
        val: closingInstapay,
        label: "Closing InstaPay",
      },
      { key: "closingWallet", val: closingWallet, label: "Closing Wallet" },
    ];
    for (const field of optionalFields) {
      if (
        field.val !== undefined &&
        (typeof field.val !== "number" ||
          !Number.isFinite(field.val) ||
          field.val < 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `${field.label} must be a valid non-negative number`,
        });
      }
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let closedShift;

    await session.withTransaction(async () => {
      // 2. Find cashier's open shift
      const shift = await Shift.findOne({
        cashier: req.user._id,
        status: "open",
      }).session(session);

      if (!shift) {
        throw new Error("SHIFT_NOT_OPEN");
      }

      // 3. Calculate expected cash & non-cash totals
      const expectedCash = Number(
        (
          shift.openingCash +
          shift.totalCashSales -
          shift.totalCashRefunds +
          shift.totalDeposits -
          shift.totalWithdrawals
        ).toFixed(2),
      );

      const expectedVisa = Number(
        ((shift.totalVisaSales || 0) - (shift.totalVisaRefunds || 0)).toFixed(
          2,
        ),
      );
      const expectedInstapay = Number(
        (
          (shift.totalInstapaySales || 0) -
          (shift.totalInstapayRefunds || 0)
        ).toFixed(2),
      );
      const expectedWallet = Number(
        (
          (shift.totalWalletSales || 0) -
          (shift.totalWalletRefunds || 0)
        ).toFixed(2),
      );

      // 4. Calculate shortage or overage
      const actualCash = Number(closingCash.toFixed(2));
      const difference = Number((actualCash - expectedCash).toFixed(2));

      const setPayload = {
        closingCash: actualCash,
        expectedCash,
        difference,
        expectedVisa,
        expectedInstapay,
        expectedWallet,
        status: "closed",
        closedAt: new Date(),
      };

      if (closingVisa !== undefined) {
        const actualVisa = Number(closingVisa.toFixed(2));
        setPayload.closingVisa = actualVisa;
        setPayload.visaDifference = Number((actualVisa - expectedVisa).toFixed(2));
      }
      if (closingInstapay !== undefined) {
        const actualInstapay = Number(closingInstapay.toFixed(2));
        setPayload.closingInstapay = actualInstapay;
        setPayload.instapayDifference = Number(
          (actualInstapay - expectedInstapay).toFixed(2),
        );
      }
      if (closingWallet !== undefined) {
        const actualWallet = Number(closingWallet.toFixed(2));
        setPayload.closingWallet = actualWallet;
        setPayload.walletDifference = Number(
          (actualWallet - expectedWallet).toFixed(2),
        );
      }

      // 5. Close shift atomically
      closedShift = await Shift.findOneAndUpdate(
        {
          _id: shift._id,
          cashier: req.user._id,
          status: "open",
        },
        {
          $set: setPayload,
        },
        {
          new: true,
          session,
          runValidators: true,
        },
      );

      if (!closedShift) {
        throw new Error("SHIFT_ALREADY_CLOSED");
      }
    });

    return res.status(200).json({
      success: true,
      message: "Shift closed successfully",
      shift: closedShift,
      reconciliation: {
        expectedCash: closedShift.expectedCash,
        actualCash: closedShift.closingCash,
        difference: closedShift.difference,
        expectedVisa: closedShift.expectedVisa,
        actualVisa: closedShift.closingVisa,
        visaDifference: closedShift.visaDifference,
        expectedInstapay: closedShift.expectedInstapay,
        actualInstapay: closedShift.closingInstapay,
        instapayDifference: closedShift.instapayDifference,
        expectedWallet: closedShift.expectedWallet,
        actualWallet: closedShift.closingWallet,
        walletDifference: closedShift.walletDifference,
        status:
          closedShift.difference === 0
            ? "balanced"
            : closedShift.difference < 0
              ? "shortage"
              : "overage",
      },
    });
  } catch (error) {
    console.error("Close Shift Error:", error);

    const errors = {
      SHIFT_NOT_OPEN: [409, "You don't have an open shift"],
      SHIFT_ALREADY_CLOSED: [409, "This shift has already been closed"],
    };

    if (errors[error.message]) {
      const [status, message] = errors[error.message];

      return res.status(status).json({
        success: false,
        message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to close shift",
    });
  } finally {
    await session.endSession();
  }
};

const getShiftHistory = async (req, res) => {
  try {
    const filter = {};

    // Cashier can only see their own shifts
    if (req.user.role !== "owner") {
      filter.cashier = req.user._id;
    }

    const shifts = await Shift.find(filter)
      .populate("cashier", "name email")
      .sort({ openedAt: -1 });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      shifts,
    });
  } catch (error) {
    console.error("Get Shift History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve shift history",
    });
  }
};

const getActiveShifts = async ( _, res) => {
  try {
    const shifts = await Shift.find({ status: "open" })
      .populate("cashier", "name email")
      .sort({ openedAt: -1 });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      shifts,
    });
  } catch (error) {
    console.error("Get Active Shifts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve active shifts",
    });
  }
};

const getShiftById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID",
      });
    }

    const shift = await Shift.findById(id)
      .populate("cashier", "name email")
      .populate("movements.createdBy", "name email");

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    return res.status(200).json({
      success: true,
      shift,
    });
  } catch (error) {
    console.error("Get Shift By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve shift",
    });
  }
};

const getShiftReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};

    if (startDate || endDate) {
      match.openedAt = {};

      if (startDate) {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date",
          });
        }

        match.openedAt.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date",
          });
        }

        end.setHours(23, 59, 59, 999);
        match.openedAt.$lte = end;
      }

      if (
        match.openedAt.$gte &&
        match.openedAt.$lte &&
        match.openedAt.$gte > match.openedAt.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: "Start date must be before end date",
        });
      }
    }

    const reports = await Shift.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$cashier",
          cashierName: { $first: "$cashierName" },

          totalShifts: { $sum: 1 },

          closedShifts: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0],
            },
          },

          openShifts: {
            $sum: {
              $cond: [{ $eq: ["$status", "open"] }, 1, 0],
            },
          },

          totalCashSales: { $sum: "$totalCashSales" },
          totalCashRefunds: { $sum: "$totalCashRefunds" },
          totalDeposits: { $sum: "$totalDeposits" },
          totalWithdrawals: { $sum: "$totalWithdrawals" },

          totalShortage: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "closed"] },
                    { $lt: ["$difference", 0] },
                  ],
                },
                { $abs: "$difference" },
                0,
              ],
            },
          },

          totalOverage: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "closed"] },
                    { $gt: ["$difference", 0] },
                  ],
                },
                "$difference",
                0,
              ],
            },
          },
        },
      },
      { $sort: { totalCashSales: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get Shift Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve shift reports",
    });
  }
};

module.exports = {
  openShift,
  getCurrentShift,
  createCashMovement,
  getShiftSummary,
  closeShift,
  getShiftHistory,
  getActiveShifts,
  getShiftById,
  getShiftReports,
};
