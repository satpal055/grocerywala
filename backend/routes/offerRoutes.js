const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

/* ---- MULTER ---- */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/offers");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

/* ---- ADD OFFER (ADMIN) ---- */
router.post("/", upload.single("banner"), async (req, res) => {
    try {
        let categories = [];

        if (req.body.categories) {
            try {
                categories = JSON.parse(req.body.categories);
            } catch {
                categories = [];
            }
        }
        const expiryDate = req.body.expiryDate
            ? new Date(req.body.expiryDate)
            : null;

        const offer = await Offer.create({
            title: req.body.title,
            discount: Number(req.body.discount),
            minCart: Number(req.body.minCart) || 0,
            categories,
            banner: req.file ? `/uploads/offers/${req.file.filename}` : "",
            expiryDate,

        });

        res.status(201).json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Offer save failed" });
    }
});



/* ---- GET OFFERS (FRONTEND) ---- */
router.get("/", async (req, res) => {
    try {
        const today = new Date();

        const offers = await Offer.find({
            $or: [
                { expiryDate: null },
                { expiryDate: { $gte: today } },
            ],
        }).sort({ createdAt: -1 });

        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch offers" });
    }
});

router.get("/:offerId/products", async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.offerId);

        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
            return res.status(400).json({ message: "Offer expired" });
        }


        const products = await Product.find({
            category: { $in: offer.categories }, // 🔥 MAIN LOGIC
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch offer products" });
    }
});
module.exports = router;
