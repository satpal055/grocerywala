const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET all users (Admin)
router.get("/", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

module.exports = router;
