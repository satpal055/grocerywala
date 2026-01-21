require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");

const adminUsersRoute = require("./routes/adminUsers");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sliderRoutes = require("./routes/slider");
const offerRoutes = require("./routes/offerRoutes");

const app = express();
const PORT = 3000;

/* ---- Ensure upload folders ---- */
const folders = [
    "uploads",
    "uploads/offers",
    "uploads/products",
    "uploads/sliders",
];

folders.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ---- Middleware ---- */
app.use(cors());
app.use(express.json());

app.use("/api/offers", offerRoutes);
/* ---- Static ---- */
app.use("/uploads", express.static("uploads"));

/* ---- DB ---- */
connectDB();

/* ---- ROUTES (✅ FIXED) ---- */
app.use("/api/products", productRoutes);          // ✅ FIX
app.use("/api/slider", sliderRoutes);
app.use("/api/admin/users", adminUsersRoute);
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);

/* ---- Server ---- */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
