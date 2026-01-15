const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

/* ---------------- GET ALL PRODUCTS ---------------- */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/* ---------------- ADD PRODUCT ---------------- */
router.post("/", upload.single("thumbnail"), async (req, res) => {
    try {
        const { title, price, stock, category } = req.body;

        if (!title || !price) {
            return res.status(400).json({ message: "Title and price required" });
        }

        const thumbnail = req.file ? `/uploads/${req.file.filename}` : "";

        const newProduct = new Product({
            title,
            price: Number(price),
            stock: Number(stock),
            category,
            thumbnail,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    } catch (err) {
        console.error("POST /products error:", err);
        res.status(500).json({ message: "Failed to add product" });
    }
});

/* ---------------- UPDATE PRODUCT ---------------- */
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.title = req.body.title;
        product.price = Number(req.body.price);
        product.stock = Number(req.body.stock);
        product.category = req.body.category;

        if (req.file) {
            product.thumbnail = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (err) {
        res.status(500).json({ message: "Failed to update product" });
    }
});

module.exports = router;
