const mongoose = require("mongoose");
const crypto = require("node:crypto");
const Sale = require("../models/sales.model");
const Product = require("../models/products.model");
const Return = require("../models/returns.model");
const Shift = require("../models/shift.model");

const createReturn = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { invoiceNumber, items } = req.body || {};

    // 1. Validate request
    if (
      typeof invoiceNumber !== "string" ||
      !invoiceNumber.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invoice number and return items are required",
      });
    }

    if (!req.user?._id || !req.user?.name) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Validate return items
    const seenItems = new Set();

    for (const item of items) {
      if (
        !item ||
        !mongoose.isValidObjectId(item.saleItem) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        (item.reason !== undefined && typeof item.reason !== "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid return item data",
        });
      }

      if (seenItems.has(String(item.saleItem))) {
        return res.status(400).json({
          success: false,
          message: "Duplicate sale item in return",
        });
      }

      seenItems.add(String(item.saleItem));
    }

    let createdReturn;

    await session.withTransaction(async () => {
      // 3. Find cashier's open shift
      const shift = await Shift.findOne({
        cashier: req.user._id,
        status: "open",
      }).session(session);

      if (!shift) {
        throw new Error("SHIFT_NOT_OPEN");
      }

      // 4. Find original sale
      const sale = await Sale.findOne({
        invoiceNumber: invoiceNumber.trim(),
        status: "completed",
      }).session(session);

      if (!sale) {
        throw new Error("SALE_NOT_FOUND");
      }

      // 5. Get previous completed returns
      const previousReturns = await Return.find({
        sale: sale._id,
        status: "completed",
      }).session(session);

      const returnedQuantities = new Map();
      const returnedAmounts = new Map();

      for (const previousReturn of previousReturns) {
        for (const returnedItem of previousReturn.items) {
          const key = String(returnedItem.saleItem);

          returnedQuantities.set(
            key,
            (returnedQuantities.get(key) || 0) + returnedItem.quantity,
          );

          returnedAmounts.set(
            key,
            Number(
              (
                (returnedAmounts.get(key) || 0) + returnedItem.refundAmount
              ).toFixed(2),
            ),
          );
        }
      }

      const returnItems = [];

      // 6. Process returned products
      for (const requestedItem of items) {
        const saleItem = sale.items.id(requestedItem.saleItem);

        if (!saleItem) {
          throw new Error("SALE_ITEM_NOT_FOUND");
        }

        const alreadyReturned =
          returnedQuantities.get(String(saleItem._id)) || 0;

        const remainingQuantity = saleItem.quantity - alreadyReturned;

        if (requestedItem.quantity > remainingQuantity) {
          throw new Error("RETURN_QUANTITY_EXCEEDED");
        }

        if (saleItem.productType === "phone" && requestedItem.quantity !== 1) {
          throw new Error("INVALID_PHONE_RETURN_QUANTITY");
        }

        const product = await Product.findById(saleItem.product).session(
          session,
        );

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        // Calculate refund using original invoice price and discount
        const originalTotal = saleItem.unitPrice * saleItem.quantity;
        const netTotal = originalTotal - saleItem.discountAmount;

        const saleItemKey = String(saleItem._id);
        const alreadyReturnedAmount = returnedAmounts.get(saleItemKey) || 0;

        const remainingRefundValue = Number(
          Math.max(0, netTotal - alreadyReturnedAmount).toFixed(2),
        );

        const proportionalRefund = Number(
          ((netTotal / saleItem.quantity) * requestedItem.quantity).toFixed(2),
        );

        const refundAmount =
          requestedItem.quantity === remainingQuantity
            ? remainingRefundValue
            : Math.min(remainingRefundValue, proportionalRefund);

        returnedAmounts.set(
          saleItemKey,
          Number((alreadyReturnedAmount + refundAmount).toFixed(2)),
        );

        // Restore product stock
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: product._id },
          {
            $inc: { quantity: requestedItem.quantity },
            $set: { isActive: true },
          },
          {
            new: true,
            session,
            runValidators: true,
          },
        );

        if (!updatedProduct) {
          throw new Error("PRODUCT_UPDATE_FAILED");
        }

        returnItems.push({
          saleItem: saleItem._id,
          product: saleItem.product,
          productName: saleItem.productName,
          productType: saleItem.productType,
          imei: saleItem.imei,
          quantity: requestedItem.quantity,
          unitPrice: saleItem.unitPrice,
          refundAmount,
          reason: requestedItem.reason?.trim() || "",
        });
      }

      // 7. Calculate total return amount
      const totalRefundAmount = Number(
        returnItems
          .reduce((total, item) => total + item.refundAmount, 0)
          .toFixed(2),
      );

      // 8. Apply return amount to customer's remaining debt first
      const amountAppliedToDebt = Number(
        Math.min(totalRefundAmount, sale.remainingAmount).toFixed(2),
      );

      // 9. Calculate amount owed to customer
      const refundDue = Number(
        (totalRefundAmount - amountAppliedToDebt).toFixed(2),
      );

      // 10. Update original sale financial data
      sale.totalReturnedAmount = Number(
        (sale.totalReturnedAmount + totalRefundAmount).toFixed(2),
      );

      await sale.save({ session });

      // 11. Create return record linked to current shift
      const returnNumber = `RET-${Date.now()}-${crypto.randomInt(1000, 9999)}`;

      const [newReturn] = await Return.create(
        [
          {
            returnNumber,
            sale: sale._id,
            invoiceNumber: sale.invoiceNumber,
            returnedBy: req.user._id,
            cashierName: req.user.name,
            shift: shift._id,
            items: returnItems,
            totalRefundAmount,
            amountAppliedToDebt,
            refundDue,
            refundPayments: [],
          },
        ],
        { session },
      );

      createdReturn = newReturn;
    });

    return res.status(201).json({
      success: true,
      message: "Return created successfully",
      data: createdReturn,
    });
  } catch (error) {
    console.error("Create Return Error:", error);

    const errors = {
      SHIFT_NOT_OPEN: [409, "You must have an open shift to create a return"],
      SALE_NOT_FOUND: [404, "Sale not found"],
      SALE_ITEM_NOT_FOUND: [404, "Product not found in original invoice"],
      RETURN_QUANTITY_EXCEEDED: [
        400,
        "Return quantity exceeds the remaining sold quantity",
      ],
      INVALID_PHONE_RETURN_QUANTITY: [
        400,
        "Each phone must be returned individually",
      ],
      PRODUCT_NOT_FOUND: [404, "Product not found in inventory"],
      PRODUCT_UPDATE_FAILED: [400, "Could not update product stock"],
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
      message: "Server error",
    });
  } finally {
    await session.endSession();
  }
};
const processRefund = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { method, amount } = req.body || {};

    // 1. Validate return ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return ID",
      });
    }

    // 2. Validate refund method
    const allowedMethods = ["cash", "wallet", "instapay", "visa"];

    if (!allowedMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund payment method",
      });
    }

    // 3. Validate refund amount
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Refund amount must be a positive number",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let updatedReturn;

    await session.withTransaction(async () => {
      // 4. Find cashier's open shift
      const shift = await Shift.findOne({
        cashier: req.user._id,
        status: "open",
      }).session(session);

      if (!shift) {
        throw new Error("SHIFT_NOT_OPEN");
      }

      // 5. Find completed return
      const returnData = await Return.findOne({
        _id: id,
        status: "completed",
      }).session(session);

      if (!returnData) {
        throw new Error("RETURN_NOT_FOUND");
      }

      // 6. Check remaining refund amount
      if (amount > returnData.refundRemainingAmount) {
        throw new Error("REFUND_AMOUNT_EXCEEDED");
      }

      // 7. Record refund payment with current shift
      returnData.refundPayments.push({
        method,
        amount,
        shift: shift._id,
        refundedAt: new Date(),
      });

      await returnData.save({ session });

      // 8. Update original sale
      const sale = await Sale.findById(returnData.sale).session(session);

      if (!sale) {
        throw new Error("SALE_NOT_FOUND");
      }

      sale.refundedAmount = Number((sale.refundedAmount + amount).toFixed(2));

      await sale.save({ session });

      // 9. Deduct from drawer only for cash refunds
      if (method === "cash") {
        const updatedShiftDoc = await Shift.findOneAndUpdate(
          {
            _id: shift._id,
            cashier: req.user._id,
            status: "open",
          },
          {
            $inc: {
              totalCashRefunds: amount,
            },
          },
          {
            new: true,
            session,
            runValidators: true,
          },
        );

        if (!updatedShiftDoc) {
          throw new Error("SHIFT_NOT_OPEN");
        }
      }

      updatedReturn = returnData;
    });

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: updatedReturn,
    });
  } catch (error) {
    console.error("Process Refund Error:", error);

    const errors = {
      SHIFT_NOT_OPEN: [409, "You must have an open shift to process a refund"],
      RETURN_NOT_FOUND: [404, "Return not found"],
      REFUND_AMOUNT_EXCEEDED: [
        400,
        "Refund amount exceeds the remaining refundable amount",
      ],
      SALE_NOT_FOUND: [404, "Original sale not found"],
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
      message: "Server error",
    });
  } finally {
    await session.endSession();
  }
};
const getReturns = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
    }

    const filter = {};

    if (req.query.invoiceNumber) {
      filter.invoiceNumber = req.query.invoiceNumber.trim();
    }

    const skip = (page - 1) * limit;

    const [returns, totalReturns] = await Promise.all([
      Return.find(filter)
        .populate("returnedBy", "name email")
        .populate("sale", "invoiceNumber customerName customerPhone")
        .sort({ returnDate: -1 })
        .skip(skip)
        .limit(limit),

      Return.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: returns.length,
      totalReturns,
      currentPage: page,
      totalPages: Math.ceil(totalReturns / limit),
      data: returns,
    });
  } catch (error) {
    console.error("Get Returns Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getReturnById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return ID",
      });
    }

    const returnData = await Return.findById(id)
      .populate("returnedBy", "name email")
      .populate("sale", "invoiceNumber customerName customerPhone");

    if (!returnData) {
      return res.status(404).json({
        success: false,
        message: "Return not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: returnData,
    });
  } catch (error) {
    console.error("Get Return By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { createReturn, getReturns, getReturnById, processRefund };
