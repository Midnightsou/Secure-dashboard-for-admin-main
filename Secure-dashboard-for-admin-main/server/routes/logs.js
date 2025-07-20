const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Log = require("../models/log");

router.get("/", verifyToken, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching logs", error: err.message });
  }
});

router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await Log.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

module.exports = router;
