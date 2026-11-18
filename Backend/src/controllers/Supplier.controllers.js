const mongoose = require("mongoose");
const Supplier = require("../models/supplier.model");

const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  typeof phone === "string" && /^\+?\d{7,15}$/.test(phone);

const normalizeSupplierInput = (body) => ({
  name: typeof body.name === "string" ? body.name.trim() : body.name,
  email:
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : body.email,
  phone:
    typeof body.phone === "string"
      ? body.phone.trim().replace(/[\s().-]/g, "")
      : body.phone,
  address: typeof body.address === "string" ? body.address.trim() : body.address,
});

const validateSupplierInput = ({ name, email, phone, address }) => {
  if (
    typeof name !== "string" ||
    name.length < 3 ||
    name.length > 50 ||
    !isValidEmail(email) ||
    !isValidPhone(phone) ||
    typeof address !== "string" ||
    !address
  ) {
    return "Provide a name, valid email, phone number, and address";
  }
  return null;
};

const addSupplier = async (req, res) => {
  try {
    const input = normalizeSupplierInput(req.body);
    const validationMessage = validateSupplierInput(input);
    if (validationMessage) {
      return res.status(400).json({ success: false, message: validationMessage });
    }

    const existingSupplier = await Supplier.findOne({
      $or: [{ email: input.email }, { phone: input.phone }],
    });
    if (existingSupplier) {
      return res.status(409).json({
        success: false,
        message: "Supplier with this email or phone already exists",
      });
    }

    const supplier = await Supplier.create(input);
    return res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      supplier,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Supplier with this email or phone already exists",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("Add Supplier Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error("Get Suppliers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    return res.status(200).json({ success: true, supplier });
  } catch (error) {
    console.error("Get Supplier By ID Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    if (!supplier.isActive) {
      return res.status(400).json({
        success: false,
        message: "Supplier is already inactive",
      });
    }

    supplier.isActive = false;
    await supplier.save();
    return res.status(200).json({
      success: true,
      message: "Supplier deactivated; purchase history is preserved",
    });
  } catch (error) {
    console.error("Delete Supplier Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSupplierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    if (supplier.isActive === isActive) {
      return res.status(400).json({
        success: false,
        message: "Supplier is already " + (isActive ? "active" : "inactive"),
      });
    }

    supplier.isActive = isActive;
    await supplier.save();
    return res.status(200).json({
      success: true,
      message: "Supplier status updated successfully",
      supplier,
    });
  } catch (error) {
    console.error("Update Supplier Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const input = normalizeSupplierInput(req.body);
    const suppliedFields = Object.keys(req.body).filter((field) =>
      ["name", "email", "phone", "address"].includes(field),
    );
    if (suppliedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    const update = {};
    for (const field of suppliedFields) {
      if (input[field] === undefined) continue;
      if (supplier[field] !== input[field]) update[field] = input[field];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes detected in the provided fields",
      });
    }

    const candidate = { ...supplier.toObject(), ...update };
    const validationMessage = validateSupplierInput(candidate);
    if (validationMessage) {
      return res.status(400).json({ success: false, message: validationMessage });
    }

    const duplicate = await Supplier.findOne({
      _id: { $ne: id },
      $or: [{ email: candidate.email }, { phone: candidate.phone }],
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    Object.assign(supplier, update);
    await supplier.save();
    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("Update Supplier Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addSupplier,
  getSuppliers,
  getSupplierById,
  deleteSupplier,
  updateSupplierStatus,
  updateSupplier,
};
