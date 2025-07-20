const Log = require("../models/log");

async function writeLog({ message, action, userId }) {
  try {
    const log = new Log({ description: message, action, userId });
    await log.save();
    console.log("Log saved:", message);
  } catch (err) {
    console.error("Error writing log:", err.message);
  }
}

module.exports = writeLog;
