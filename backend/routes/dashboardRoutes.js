const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/counts", protect, async (req, res) => {
    try {
        const products = await Product.countDocuments();
        const categories = await Product.distinct("category");
        const orders = await Order.countDocuments();
        const users = await User.countDocuments();

        return res.json({
            products,
            categories: categories.length,
            orders,
            users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Dashboard error" });
    }
});

module.exports = router;
