const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const writeLog = require("../middlewares/writeLog");
require("dotenv").config();

router.post("/verify", async (req, res) => {
  const { email, token, password } = req.body;
  const action = "activate_account";
  const userId = req.user?.id;
  await writeLog({
    message: `User with email ${email} Attempting Account Activation`,
    action,
    userId,
  });
  const admin = await Admin.findOne({ email });
  if (!admin) {
    await writeLog({
      message: `User with email ${email} doesn't exist`,
      action,
      userId,
    });
    return res.status(404).json({ message: "Admin not found" });
  }
  if (admin.isActive) {
    await writeLog({
      message: `Account already activated`,
      action,
      userId,
    });
    return res
      .status(401)
      .json({ message: "Account already activated, Proceed to login" });
  }

  const isMatch = await bcrypt.compare(token, admin.password);
  if (!isMatch) {
    await writeLog({
      message: `Invalid token for user with email: ${email}`,
      action,
      userId,
    });
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const hashed = await bcrypt.hash(password, 10);
  admin.password = hashed;
  admin.isActive = true;
  await admin.save();
  await writeLog({
    message: `Successful activation for user with email: ${email}`,
    action,
    userId,
  });

  res.json({ message: "Password reset successful" });
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await writeLog({
      message: `User with email ${email} Attempting Login`,
      action: "user_login",
      userId: req.user?.id,
    });
    const admin = await Admin.findOne({ email });
    if (!admin) {
      await writeLog({
        message: `User with email ${email} doesn't exist`,
        action: "user_login",
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isActive) {
      await writeLog({
        message: `User with email ${email} account unactivated`,
        action: "user_login",
        userId: req.user?.id,
      });
      return res
        .status(401)
        .json({ message: "Account not activated, Check your email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      await writeLog({
        message: `Password fail for user with email ${email}`,
        action: "user_login",
        userId: req.user?.id,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "2h" }
    );

    await writeLog({
      message: `Login Successful for user with email ${email}`,
      action: "user_login",
      userId: req.user?.id,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    await writeLog({
      message: `Error during login for User with email ${email}`,
      action: "user_login",
      userId: req.user?.id,
    });
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
