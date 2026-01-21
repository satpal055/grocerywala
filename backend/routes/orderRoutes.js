const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// const { protect, authorizeRoles } = require("../middleware/auth");

// 🟢 CREATE ORDER (Logged-in user)
router.post(
    "/",
    protect,
    async (req, res) => {
        try {
            const order = await Order.create({
                userId: req.user.id,
                items: req.body.items,
                total: req.body.total,
            });

            res.status(201).json(order);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Order failed" });
        }
    }
);

// 🟢 GET MY ORDERS (Logged-in user)
router.get(
    "/my",
    protect,
    async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.user.id });
            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch orders" });
        }
    }
);

// ⭐ GET ALL ORDERS (ADMIN PANEL)
router.get(
    "/",
    protect,
    authorizeRoles("superadmin", "order"),
    async (req, res) => {
        try {
            const orders = await Order.find()
                .populate("userId", "name email")
                .sort({ createdAt: -1 });

            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to get all orders" });
        }
    }
);

module.exports = router;
