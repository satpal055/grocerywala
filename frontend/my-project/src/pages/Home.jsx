import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { addToCart } = useContext(CartContext); // use context

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const categories = [...new Set(products.map((p) => p.category))];
    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category === selectedCategory)
        : products;

    return (
        <div className="p-10">
            <h2 className="text-center mb-6 text-2xl font-bold">All Products</h2>

            {/* CATEGORY DROPDOWN */}
            <div className="flex justify-center mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border px-4 py-2 rounded w-60"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="rounded-lg p-4 shadow bg-white relative"
                    >
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.floor(product.discountPercentage ?? 0)}% OFF
                        </div>

                        <img
                            src={
                                product.thumbnail
                                    ? product.thumbnail.startsWith("http")
                                        ? product.thumbnail
                                        : `http://localhost:3000${product.thumbnail}`
                                    : "https://via.placeholder.com/150"
                            }
                            alt={product.title || "Product"}
                            className="w-full h-32 object-contain mb-2"
                        />


                        <h2 className="text-sm font-medium mb-1">{product.title || "No Title"}</h2>

                        <div className="flex items-center mb-2">
                            <span className="font-semibold mr-2">₹{product.price ?? 0}</span>
                        </div>

                        <div className="text-xs text-yellow-500 mb-2">
                            ⭐ {(product?.rating ?? 0).toFixed(1)}
                        </div>

                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                        >
                            ADD
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
}
