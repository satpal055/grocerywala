const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// const { protect, authorizeRoles } = require("../middleware/auth");

// ---------------- MULTER SETUP ----------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ---------------- GET ALL PRODUCTS (PUBLIC) ----------------
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ---------------- GET SINGLE PRODUCT (PUBLIC) ----------------
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Invalid product ID" });
    }
});

// ---------------- ADD PRODUCT (ADMIN) ----------------
router.post(
    "/",
    protect,
    authorizeRoles("superadmin", "product"),
    upload.single("thumbnail"),
    async (req, res) => {
        try {
            const {
                title,
                price,
                stock,
                category,
                discountPercentage,
                rating,
            } = req.body;

            if (!title || !price) {
                return res
                    .status(400)
                    .json({ message: "Title and price required" });
            }

            const thumbnail = req.file
                ? `/uploads/products/${req.file.filename}`
                : "";

            const newProduct = new Product({
                title,
                price: Number(price),
                stock: Number(stock) || 0,
                category,
                discountPercentage:
                    Number(discountPercentage) || 0,
                rating: Number(rating) || 0,
                thumbnail,
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (err) {
            console.error("POST /products error:", err);
            res.status(500).json({ message: "Failed to add product" });
        }
    }
);

// ---------------- UPDATE PRODUCT (ADMIN) ----------------
router.put(
    "/:id",
    protect,
    authorizeRoles("superadmin", "product"),
    upload.single("thumbnail"),
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: "Product not found" });
            }

            if (req.body.title !== undefined)
                product.title = req.body.title;
            if (req.body.price !== undefined)
                product.price = Number(req.body.price);
            if (req.body.stock !== undefined)
                product.stock = Number(req.body.stock);
            if (req.body.category !== undefined)
                product.category = req.body.category;

            if (req.body.discountPercentage !== undefined) {
                product.discountPercentage =
                    Number(req.body.discountPercentage) || 0;
            }

            if (req.body.rating !== undefined) {
                product.rating = Number(req.body.rating) || 0;
            }

            if (req.file) {
                product.thumbnail = `/uploads/products/${req.file.filename}`;
            }


            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } catch (err) {
            console.error("PUT /products error:", err);
            res.status(500).json({ message: "Failed to update product" });
        }
    }
);
// ---------------- UPDATE STOCK (INVENTORY / SUPERADMIN) ----------------
router.put(
    "/:id/stock",
    protect,
    authorizeRoles("superadmin", "inventory"),
    async (req, res) => {
        try {
            const { action, quantity } = req.body;

            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const qty = Number(quantity);
            if (!qty || qty <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            if (action === "increase") {
                product.stock += qty;
            } else if (action === "decrease") {
                product.stock -= qty;
                if (product.stock < 0) product.stock = 0;
            } else if (action === "set") {
                product.stock = qty;
            } else {
                return res.status(400).json({ message: "Invalid action" });
            }

            await product.save();

            res.json({
                message: "Stock updated successfully",
                stock: product.stock,
            });
        } catch (err) {
            console.error("STOCK UPDATE ERROR:", err);
            res.status(500).json({ message: "Failed to update stock" });
        }
    }
);

module.exports = router;
