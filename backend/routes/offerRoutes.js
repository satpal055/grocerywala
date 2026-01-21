const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const multer = require("multer");
const path = require("path");

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

        const offer = await Offer.create({
            title: req.body.title,
            discount: Number(req.body.discount),
            minCart: Number(req.body.minCart) || 0,
            categories,
            banner: req.file ? `/uploads/offers/${req.file.filename}` : "",
        });

        res.status(201).json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Offer save failed" });
    }
});



/* ---- GET OFFERS (FRONTEND) ---- */
router.get("/", async (req, res) => {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
});

module.exports = router;
