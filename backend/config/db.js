const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // console.log("MONGO_URI =", process.env.MONGO_URI); // ✅ test
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
