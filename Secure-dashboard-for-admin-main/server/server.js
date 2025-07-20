const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Route imports
const adminAuthRoutes = require("./routes/auth"); // Admin OTP + register
const userRoutes = require("./routes/users"); // Manage users
const logRoutes = require("./routes/logs"); // Manage users

dotenv.config();
const app = express();

// ⚠️ Put CORS config BEFORE routes
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", process.env.FRONTEND_URL], // Match Live Server or your frontend URL
    credentials: true,
  })
);

app.use(express.json());

// ✅ Serve static frontend files (like dashboard.html)
app.use(express.static(path.join(__dirname, "../client")));

// 🔌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB Connection error:", err));

// 🛣️ API Routes
app.use("/api/admin", adminAuthRoutes); // /send-otp, /verify-otp, /register
app.use("/api/users", userRoutes); // protected user routes
app.use("/api/logs", logRoutes); // protected user routes

// 🟢 Start server and open browser
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
