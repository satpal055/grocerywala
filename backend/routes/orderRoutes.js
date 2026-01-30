const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const Product = require("../models/product");



// const { protect, authorizeRoles } = require("../middleware/auth");



// 🟢 CREATE ORDER (Logged-in user)
router.post("/", protect, async (req, res) => {
    try {
        const fixedItems = req.body.items.map(item => {
            let imagePath = "";

            if (item.images && item.images.length > 0) {
                imagePath = item.images[0];
            } else if (item.thumbnail && item.thumbnail.startsWith("/uploads/")) {
                imagePath = item.thumbnail;
            } else {
                imagePath = item.thumbnail;
            }

            return {
                ...item,
                thumbnail: imagePath,
            };
        });

        // ✅ 1. CREATE ORDER
        const order = await Order.create({
            userId: req.user.id,
            items: fixedItems,
            total: req.body.total,
        });

        // 🔥 2. DECREASE PRODUCT STOCK
        for (const item of fixedItems) {
            const product = await Product.findById(item.id);

            if (!product) continue;

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Only ${product.stock} items left for ${product.title}`,
                });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        // ✅ 3. CLEAR CART
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $set: { items: [] } }
        );

        res.status(201).json(order);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Order failed" });
    }
});


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
