const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: { type: String, required: true },

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

        // 🟢 ACTIVE / INACTIVE (for Deactivate button)
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        // (optional legacy flag – can keep)
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
