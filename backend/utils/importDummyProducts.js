// const fetch = require("node-fetch");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const Product = require("../models/Product");

// const IMAGE_DIR = path.join(__dirname, "../uploads/products");

// const downloadImage = async (url, filename) => {
//     const filePath = path.join(IMAGE_DIR, filename);

//     const response = await axios({
//         url,
//         method: "GET",
//         responseType: "stream",
//     });

//     await new Promise((resolve, reject) => {
//         const stream = response.data.pipe(fs.createWriteStream(filePath));
//         stream.on("finish", resolve);
//         stream.on("error", reject);
//     });

//     return `/uploads/products/${filename}`;
// };

// const importDummyProducts = async () => {
//     try {
//         console.log("⏳ Importing products from DummyJSON...");

//         const res = await fetch("https://dummyjson.com/products?limit=194");
//         const data = await res.json();

//         // 🔥 Clean old products
//         await Product.deleteMany({});

//         for (const p of data.products) {
//             const safeName = p.title
//                 .toLowerCase()
//                 .replace(/[^a-z0-9]/g, "-");

//             // 🔽 DOWNLOAD THUMBNAIL
//             let thumbnailPath = "";
//             if (p.thumbnail) {
//                 const filename = `${safeName}-${Date.now()}.webp`;
//                 thumbnailPath = await downloadImage(p.thumbnail, filename);
//             }

//             // 🔽 DOWNLOAD IMAGES ARRAY
//             const imagePaths = [];
//             if (Array.isArray(p.images)) {
//                 for (let i = 0; i < p.images.length; i++) {
//                     const imgName = `${safeName}-${Date.now()}-${i}.webp`;
//                     const localPath = await downloadImage(p.images[i], imgName);
//                     imagePaths.push(localPath);
//                 }
//             }

//             await Product.create({
//                 id: p.id,
//                 title: p.title,
//                 description: p.description,
//                 price: p.price,
//                 discountPercentage: p.discountPercentage || 0,
//                 rating: Number(p.rating) || 0,
//                 stock: p.stock || 0,
//                 brand: p.brand,
//                 category: p.category,
//                 thumbnail: thumbnailPath, // ✅ LOCAL
//                 images: imagePaths,       // ✅ LOCAL
//             });
//         }

//         console.log("✅ Products + images saved locally");
//     } catch (err) {
//         console.error("❌ Import failed:", err);
//     }
// };

// module.exports = importDummyProducts;
