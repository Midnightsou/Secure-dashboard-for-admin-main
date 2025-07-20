const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Admin = require("../models/Admin");
const sendEmail = require("../middlewares/email");

// GET /api/users
router.get("/current", verifyToken, async (req, res) => {
  try {
    const user = await Admin.findById(req.user.id, "-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    const password = Math.floor(100000 + Math.random() * 900000).toString();

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({
      email,
      password: hashed,
      isActive: false,
      username: email,
    });
    await admin.save();
    let url = `http://[::]:8080/reset.html?token=${password}&email=${email}`;
    await sendEmail({
      to: email,
      subject: "Invite User",
      html: `Click the link below to proceed ${url}`,
    });
    res.status(201).json({ message: "Admin created successfully", email });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await Admin.find().sort({ isActive: -1 }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await Admin.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
});

module.exports = router;
