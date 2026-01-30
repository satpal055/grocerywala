const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

/* ---------------- GET USER CART ---------------- */
router.get("/", protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }

        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: "Failed to load cart" });
    }
});

/* ---------------- ADD / UPDATE CART ---------------- */
router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "ProductId required" });
        }

        // 🔥 fetch product to check stock
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            const currentQty = cart.items[itemIndex].quantity;
            const newQty = currentQty + quantity;

            // 🔐 STOCK GUARD
            if (newQty > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} items left in stock`,
                });
            }

            if (newQty <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = newQty;
            }
        } else if (quantity > 0) {

            // 🔐 NEW ITEM STOCK CHECK
            if (quantity > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} items left in stock`,
                });
            }

            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json(cart.items);

    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Add to cart failed" });
    }
});

/* ---------------- SYNC FULL CART ---------------- */
router.post("/sync", protect, async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid cart items" });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }

        const safeItems = [];

        for (const item of items) {
            const product = await Product.findById(item.id);
            if (!product) continue;

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} items left for ${product.title}`,
                });
            }

            safeItems.push({
                productId: item.id,
                quantity: item.quantity,
            });
        }

        cart.items = safeItems;
        await cart.save();

        res.json(cart.items);

    } catch (err) {
        console.error("Cart sync error:", err);
        res.status(500).json({ message: "Cart sync failed" });
    }
});


/* ---------------- REMOVE ITEM ---------------- */
router.post("/remove", protect, async (req, res) => {
    try {
        const { productId } = req.body;

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.json([]);

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: "Remove failed" });
    }
});

module.exports = router;
