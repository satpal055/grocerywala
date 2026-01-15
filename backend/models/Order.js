const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            title: String,
            price: Number,
            quantity: Number,
            thumbnail: String,
        }
    ],
    total: Number,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
