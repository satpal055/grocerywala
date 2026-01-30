const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: { type: String, required: true },

        // 🔐 FORGOT PASSWORD (⬅️ YAHI ADD KARNA HAI)
        resetToken: {
            type: String,
        },

        resetTokenExpiry: {
            type: Date,
        },

        // 🔐 ROLE SYSTEM
        role: {
            type: String,
            enum: [
                "superadmin",
                "product",
                "order",
                "user",
                "inventory",
            ],
            default: "user",
        },

        // 🟢 ACTIVE / INACTIVE
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        // (optional legacy flag)
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
