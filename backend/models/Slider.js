// backend/models/Slider.js
const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Slider", sliderSchema);
