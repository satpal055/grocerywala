const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

/* GET WISHLIST */
router.get("/", protect, async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
        .populate("items.productId");

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user.id,
            items: [],
        });
    }

    res.json(wishlist.items);
});

/* TOGGLE WISHLIST */
router.post("/toggle", protect, async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Product id required" });

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user.id,
            items: [],
        });
    }

    const index = wishlist.items.findIndex(
        (i) => i.productId.toString() === id
    );

    if (index > -1) {
        wishlist.items.splice(index, 1);
    } else {
        wishlist.items.push({ productId: id });
    }

    await wishlist.save();

    const updated = await Wishlist.findOne({ user: req.user.id })
        .populate("items.productId");

    res.json(updated.items);
});

module.exports = router;
