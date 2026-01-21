const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",      // ✅ default role
            isAdmin: false,
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,       // ✅ ADD
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            role: user.role,          // ✅ ADD
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed" });
    }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,       // ✅ ADD
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role,          // ✅ ADD (MOST IMPORTANT)
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
};
