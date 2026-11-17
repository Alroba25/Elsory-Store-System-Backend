const Sale = require("../models/sales.model");
const Return = require("../models/returns.model");
const Purchase = require("../models/purchase.model");
const { getReportDateRange } = require("../utils/reportDates");

const invalidDateRange = (res) =>
  res.status(400).json({
    success: false,
    message: "Dates must be valid YYYY-MM-DD values and from must not be after to",
  });

const getRangeOrRespond = (from, to, res) => {
  if (!from || !to) {
    res.status(400).json({
      success: false,
      message: "Start date and end date are required",
    });
    return null;
  }

  const range = getReportDateRange(from, to);
  if (!range) {
    invalidDateRange(res);
    return null;
  }
  return range;
};

const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const range = getRangeOrRespond(from, to, res);
    if (!range) return;

    const saleFilter = {
      status: "completed",
      saleDate: { $gte: range.start, $lt: range.endExclusive },
    };
    const returnFilter = {
      status: "completed",
      returnDate: { $gte: range.start, $lt: range.endExclusive },
    };

    const [sales, returns, refunds] = await Promise.all([
      Sale.aggregate([
        { $match: saleFilter },
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            grossSales: { $sum: { $ifNull: ["$totalAmount", 0] } },
            totalDiscounts: { $sum: { $ifNull: ["$discountAmount", 0] } },
            netSales: { $sum: { $ifNull: ["$finalAmount", 0] } },
            collectedAmount: { $sum: { $ifNull: ["$paidAmount", 0] } },
            outstandingAmount: {
              $sum: {
                $max: [
                  0,
                  {
                    $subtract: [
                      { $ifNull: ["$finalAmount", 0] },
                      { $ifNull: ["$paidAmount", 0] },
                    ],
                  },
                ],
              },
            },
            currentOutstandingAmount: {
              $sum: { $ifNull: ["$remainingAmount", 0] },
            },
            giftInvoices: {
              $sum: { $cond: ["$isGift", 1, 0] },
            },
            fullyPaidInvoices: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      { $ifNull: ["$paidAmount", 0] },
                      { $ifNull: ["$finalAmount", 0] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            partiallyPaidInvoices: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: [{ $ifNull: ["$paidAmount", 0] }, 0] },
                      {
                        $lt: [
                          { $ifNull: ["$paidAmount", 0] },
                          { $ifNull: ["$finalAmount", 0] },
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            unpaidInvoices: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: [{ $ifNull: ["$paidAmount", 0] }, 0] },
                      { $gt: [{ $ifNull: ["$finalAmount", 0] }, 0] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      Return.aggregate([
        { $match: returnFilter },
        {
          $group: {
            _id: null,
            totalReturns: { $sum: 1 },
            totalReturnedAmount: {
              $sum: { $ifNull: ["$totalRefundAmount", 0] },
            },
            pendingRefundAmount: {
              $sum: { $ifNull: ["$refundRemainingAmount", 0] },
            },
            totalReturnedItems: {
              $sum: {
                $reduce: {
                  input: { $ifNull: ["$items", []] },
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.quantity"] },
                },
              },
            },
          },
        },
      ]),
      Return.aggregate([
        { $match: { status: "completed" } },
        { $unwind: "$refundPayments" },
        {
          $match: {
            "refundPayments.refundedAt": {
              $gte: range.start,
              $lt: range.endExclusive,
            },
          },
        },
        {
          $group: {
            _id: null,
            actualRefundedAmount: { $sum: "$refundPayments.amount" },
          },
        },
      ]),
    ]);

    const salesData = sales[0] || {
      totalInvoices: 0,
      grossSales: 0,
      totalDiscounts: 0,
      netSales: 0,
      collectedAmount: 0,
      outstandingAmount: 0,
      currentOutstandingAmount: 0,
      giftInvoices: 0,
      fullyPaidInvoices: 0,
      partiallyPaidInvoices: 0,
      unpaidInvoices: 0,
    };
    const returnsData = returns[0] || {
      totalReturns: 0,
      totalReturnedAmount: 0,
      pendingRefundAmount: 0,
      totalReturnedItems: 0,
    };
    const refundsData = refunds[0] || { actualRefundedAmount: 0 };

    return res.status(200).json({
      success: true,
      period: {
        from,
        to,
        timeZone: range.timeZone,
        basis:
          "Sales use saleDate, returned merchandise uses returnDate, and cash refunds use refundedAt",
      },
      report: {
        sales: {
          totalInvoices: salesData.totalInvoices,
          grossSales: salesData.grossSales,
          totalDiscounts: salesData.totalDiscounts,
          netSales: salesData.netSales,
          collectedAmount: salesData.collectedAmount,
          outstandingAmount: salesData.outstandingAmount,
          currentOutstandingAmount: salesData.currentOutstandingAmount,
        },
        paymentStatistics: {
          fullyPaidInvoices: salesData.fullyPaidInvoices,
          partiallyPaidInvoices: salesData.partiallyPaidInvoices,
          unpaidInvoices: salesData.unpaidInvoices,
          giftInvoices: salesData.giftInvoices,
        },
        returns: {
          totalReturns: returnsData.totalReturns,
          totalReturnedItems: returnsData.totalReturnedItems,
          totalReturnedAmount: returnsData.totalReturnedAmount,
          actualRefundedAmount: refundsData.actualRefundedAmount,
          pendingRefundAmount: returnsData.pendingRefundAmount,
        },
        netSalesAfterReturns:
          salesData.netSales - returnsData.totalReturnedAmount,
        netCashFlow:
          salesData.collectedAmount - refundsData.actualRefundedAmount,
      },
    });
  } catch (error) {
    console.error("Sales Report Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPurchasesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const range = getRangeOrRespond(from, to, res);
    if (!range) return;

    const purchases = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: range.start, $lt: range.endExclusive },
        },
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          draft: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
          totalPurchases: {
            $sum: {
              $cond: [
                { $ne: ["$status", "cancelled"] },
                { $ifNull: ["$totalAmount", 0] },
                0,
              ],
            },
          },
          totalPaid: {
            $sum: {
              $cond: [
                { $ne: ["$status", "cancelled"] },
                { $ifNull: ["$paidAmount", 0] },
                0,
              ],
            },
          },
          totalRemaining: {
            $sum: {
              $cond: [
                { $ne: ["$status", "cancelled"] },
                { $ifNull: ["$remainingAmount", 0] },
                0,
              ],
            },
          },
          fullyPaid: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "cancelled"] },
                    { $eq: ["$paymentStatus", "paid"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          partiallyPaid: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "cancelled"] },
                    { $eq: ["$paymentStatus", "partially_paid"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          unpaid: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "cancelled"] },
                    { $eq: ["$paymentStatus", "unpaid"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const data = purchases[0] || {
      totalInvoices: 0,
      totalPurchases: 0,
      totalPaid: 0,
      totalRemaining: 0,
      fullyPaid: 0,
      partiallyPaid: 0,
      unpaid: 0,
      completed: 0,
      draft: 0,
      cancelled: 0,
    };

    return res.status(200).json({
      success: true,
      period: { from, to, timeZone: range.timeZone },
      report: data,
    });
  } catch (error) {
    console.error("Purchases Report Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getReturnsReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const range = getRangeOrRespond(from, to, res);
    if (!range) return;

    const dateFilter = {
      status: "completed",
      returnDate: { $gte: range.start, $lt: range.endExclusive },
    };
    const [returns, totalReturns] = await Promise.all([
      Return.aggregate([
        { $match: dateFilter },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            totalReturnItems: { $sum: "$items.quantity" },
            totalReturnedMerchandiseAmount: {
              $sum: "$items.refundAmount",
            },
            phonesReturned: {
              $sum: {
                $cond: [
                  { $eq: ["$items.productType", "phone"] },
                  "$items.quantity",
                  0,
                ],
              },
            },
            accessoriesReturned: {
              $sum: {
                $cond: [
                  { $eq: ["$items.productType", "accessory"] },
                  "$items.quantity",
                  0,
                ],
              },
            },
          },
        },
      ]),
      Return.countDocuments(dateFilter),
    ]);

    const [money, refundPayments] = await Promise.all([
      Return.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            pendingRefundAmount: {
              $sum: { $ifNull: ["$refundRemainingAmount", 0] },
            },
            refundDue: { $sum: { $ifNull: ["$refundDue", 0] } },
          },
        },
      ]),
      Return.aggregate([
        { $match: { status: "completed" } },
        { $unwind: "$refundPayments" },
        {
          $match: {
            "refundPayments.refundedAt": {
              $gte: range.start,
              $lt: range.endExclusive,
            },
          },
        },
        {
          $group: {
            _id: null,
            actualRefundedAmount: { $sum: "$refundPayments.amount" },
          },
        },
      ]),
    ]);

    const itemData = returns[0] || {
      totalReturnItems: 0,
      totalReturnedMerchandiseAmount: 0,
      phonesReturned: 0,
      accessoriesReturned: 0,
    };
    const moneyData = money || {
      pendingRefundAmount: 0,
      refundDue: 0,
    };
    const refundPaymentData = refundPayments[0] || {
      actualRefundedAmount: 0,
    };

    return res.status(200).json({
      success: true,
      period: {
        from,
        to,
        timeZone: range.timeZone,
        basis:
          "Returned merchandise uses returnDate; cash refunds use refundedAt",
      },
      report: {
        totalReturns,
        ...itemData,
        totalRefundAmount: itemData.totalReturnedMerchandiseAmount,
        ...moneyData,
        actualRefundedAmount: refundPaymentData.actualRefundedAmount,
      },
    });
  } catch (error) {
    console.error("Returns Report Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getSalesReport,
  getPurchasesReport,
  getReturnsReport,
};
