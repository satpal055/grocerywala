// backend/routes/slider.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Slider = require("../models/Slider");

// Multer setup for storing images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/sliders"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Upload image
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const slider = new Slider({
            imageUrl: `/uploads/sliders/${req.file.filename}`,
            title: req.body.title
        });
        await slider.save();
        res.status(201).json(slider);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all sliders
router.get("/", async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
