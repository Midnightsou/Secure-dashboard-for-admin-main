const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
