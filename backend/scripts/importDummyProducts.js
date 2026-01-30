// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const mongoose = require("mongoose");
// const Product = require("../models/Product");

// mongoose.connect("mongodb://127.0.0.1:27017/grocerywala");


// const DOWNLOAD_DIR = path.join(__dirname, "../uploads/products");

// if (!fs.existsSync(DOWNLOAD_DIR)) {
//     fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
// }

// const downloadImage = async (url, filename) => {
//     const filePath = path.join(DOWNLOAD_DIR, filename);
//     const res = await axios.get(url, { responseType: "stream" });

//     return new Promise((resolve, reject) => {
//         const stream = fs.createWriteStream(filePath);
//         res.data.pipe(stream);
//         stream.on("finish", resolve);
//         stream.on("error", reject);
//     });
// };

// const importProducts = async () => {
//     const { data } = await axios.get(
//         "https://dummyjson.com/products?limit=194"
//     );

//     for (const product of data.products) {
//         const slug = product.title.toLowerCase().replace(/\s+/g, "-");

//         // 🔹 Thumbnail
//         const thumbName = `${slug}-thumb.webp`;
//         await downloadImage(product.thumbnail, thumbName);

//         // 🔹 Gallery images
//         const imagePaths = [];
//         let i = 0;
//         for (const img of product.images) {
//             const imgName = `${slug}-${i}.webp`;
//             await downloadImage(img, imgName);
//             imagePaths.push(`/uploads/products/${imgName}`);
//             i++;
//         }

//         await Product.create({
//             ...product,
//             thumbnail: `/uploads/products/${thumbName}`,
//             images: imagePaths,
//         });

//         console.log("Imported:", product.title);
//     }

//     console.log("✅ All products imported");
//     process.exit();
// };

// importProducts();
