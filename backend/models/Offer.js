const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        discount: { type: Number, required: true },
        minCart: { type: Number, default: 0 },
        categories: { type: [String], default: [] },
        banner: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
