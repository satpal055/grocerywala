const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order"); // ✅ add this

const router = express.Router();

/* Dashboard Counts API */
router.get("/counts", async (req, res) => {
    try {
        // Total products
        const totalProducts = await Product.countDocuments();

        // Total categories (distinct from Product)
        const categories = await Product.distinct("category");

        // Total orders
        const orders = await Order.countDocuments();

        // Total items quantity from all orders
        const allOrders = await Order.find();
        let totalQuantity = 0;
        allOrders.forEach(order => {
            order.items.forEach(item => {
                totalQuantity += item.quantity;
            });
        });

        // Send response
        res.json({
            products: totalProducts,
            categories: categories.length,
            orders,
            totalQuantity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
