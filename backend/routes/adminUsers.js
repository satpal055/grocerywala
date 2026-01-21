const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
// const { protect, authorizeRoles } = require("../middleware/auth"); // ✅ CORRECT
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= GET ALL USERS ================= */
/* SuperAdmin ONLY */
router.get(
    "/",
    protect,
    authorizeRoles("superadmin"),
    async (req, res) => {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch users" });
        }
    }
);

/* ================= ADD USER / ADMIN ================= */
/* SuperAdmin ONLY */
router.post(
    "/",
    protect,
    authorizeRoles("superadmin"),
    async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const exists = await User.findOne({ email });
            if (exists) {
                return res
                    .status(400)
                    .json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                status: "active",
                isAdmin: role !== "user",
            });

            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to create user" });
        }
    }
);

/* ================= CHANGE ROLE ================= */
/* SuperAdmin ONLY */
router.put(
    "/:id/role",
    protect,
    authorizeRoles("superadmin"),
    async (req, res) => {
        try {
            const { role } = req.body;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    role,
                    isAdmin: role !== "user",
                },
                { new: true }
            );

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to update role" });
        }
    }
);

/* ================= ACTIVATE / DEACTIVATE ================= */
/* SuperAdmin ONLY */
router.put(
    "/:id/status",
    protect,
    authorizeRoles("superadmin"),
    async (req, res) => {
        try {
            const { status } = req.body; // active | inactive

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to update status" });
        }
    }
);

module.exports = router;
