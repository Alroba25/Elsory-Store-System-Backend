require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const name = process.env.OWNER_NAME;
    const email = process.env.OWNER_EMAIL?.toLowerCase().trim();
    const password = process.env.OWNER_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "OWNER_NAME, OWNER_EMAIL, and OWNER_PASSWORD are required",
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      throw new Error("Owner password must be 8 to 72 bytes");
    }

    const existingOwner = await User.findOne({ role: "owner" });

    if (existingOwner) {
      throw new Error("An owner already exists. No changes were made.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This email already belongs to another user.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner",
      isActive: true,
    });

    console.log("Owner created successfully.");
  } catch (error) {
    console.error("Create Owner Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createOwner();
