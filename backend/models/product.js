const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
});

// ✅ SAFE EXPORT (OverwriteModelError FIX)
module.exports =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);
