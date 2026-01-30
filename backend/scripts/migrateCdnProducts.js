require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const Product = require("../models/Product");

// ---------------- CONNECT DB ----------------
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log("✅ MongoDB connected");
        migrate(); // 🔥 migrate yahin se call hoga
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });



// ---------------- UPLOAD DIR ----------------
const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ---------------- DOWNLOAD IMAGE ----------------
async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

// ---------------- MAIN MIGRATION ----------------
async function migrate() {
    const products = await Product.find({
        thumbnail: { $regex: /^http/ } // only CDN images
    });

    console.log(`🔍 Found ${products.length} CDN products`);

    for (const product of products) {
        try {
            const url = product.thumbnail;

            // ✅ YOUR SLUGIFY LOGIC
            const slug = slugify(product.title, { lower: true, strict: true });
            const ext = path.extname(url).split("?")[0] || ".png";
            const filename = `${slug}-${Date.now()}${ext}`;
            const filepath = path.join(UPLOAD_DIR, filename);

            // download image
            await downloadImage(url, filepath);

            // update DB
            product.thumbnail = `/uploads/products/${filename}`;
            product.images = [`/uploads/products/${filename}`];

            await product.save();

            console.log("✅ Migrated:", product.title);
        } catch (err) {
            console.log("❌ Failed:", product.title);
        }
    }

    console.log("🎉 MIGRATION COMPLETED");
    process.exit();
}

migrate();
