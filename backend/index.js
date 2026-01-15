require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");
const adminUsersRoute = require("./routes/adminUsers");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes"); // ✅ FIX

const app = express();
const PORT = 3000;

/* ---------- uploads folder ensure ---------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use("/api/admin/users", adminUsersRoute);
/* ---------- Static uploads ---------- */
app.use("/uploads", express.static(uploadDir));

/* ---------- DB ---------- */
connectDB();

/* ---------- Routes ---------- */
app.use("/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes)

/* ---------- Server ---------- */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
