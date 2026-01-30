import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart, increment, decrement } = useContext(CartContext);
    const [activeImage, setActiveImage] = useState("");

    const BASE_URL = "http://localhost:3000";
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (product) {
            setActiveImage(product.thumbnail);
        }
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    const cartItem = cart.find(item => item.id === product._id);

    const originalPrice =
        product.discountPercentage
            ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
            : null;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 underline"
            >
                ← Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 shadow rounded">

                {/* IMAGE SECTION */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3">
                        {[product.thumbnail, ...(product.images || [])].map((img, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL}${img}`}
                                onClick={() => setActiveImage(img)}
                                className={`w-20 h-20 object-contain border rounded cursor-pointer
                                  ${activeImage === img
                                        ? "border-indigo-600 ring-2 ring-indigo-400"
                                        : "border-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 border rounded p-4">
                        <img
                            src={`${BASE_URL}${activeImage}`}
                            alt={product.title}
                            className="w-full h-[420px] object-contain"
                        />
                    </div>
                </div>

                {/* DETAILS SECTION */}
                <div>
                    <h1 className="text-2xl font-bold mb-1">{product.title}</h1>

                    {/* Brand */}
                    <p className="text-sm text-gray-500 mb-2">
                        Brand: <span className="font-medium">{product.brand}</span>
                    </p>

                    {/* Rating */}
                    <div className="text-yellow-500 mb-2">
                        ⭐ {(product.rating ?? 0).toFixed(2)}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-semibold text-indigo-600">
                            ₹{product.price}
                        </span>

                        {originalPrice && (
                            <>
                                <span className="line-through text-gray-400">
                                    ₹{originalPrice}
                                </span>
                                <span className="text-green-600 font-medium">
                                    {product.discountPercentage}% off
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock badge */}
                    {product.stock > 0 ? (
                        <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded mb-4">
                            In Stock
                        </span>
                    ) : (
                        <span className="inline-block bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded mb-4">
                            Out of Stock
                        </span>
                    )}

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        {product.description || "No description available"}
                    </p>

                    {/* ADD TO CART / QUANTITY */}
                    {cartItem ? (
                        <div
                            className="w-full flex items-center justify-between bg-green-600 text-white py-3 px-6 rounded"
                        >
                            <button
                                onClick={() => decrement(cartItem.id)}
                                className="text-2xl font-bold"
                            >
                                −
                            </button>

                            <span className="font-semibold">
                                {cartItem.quantity}
                            </span>

                            <button
                                disabled={cartItem.quantity >= product.stock}
                                onClick={() => increment(cartItem.id)}
                                className={`text-2xl font-bold
                                  ${cartItem.quantity >= product.stock
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={product.stock === 0}
                            onClick={() =>
                                addToCart({ ...product, id: product._id })
                            }
                            className={`w-full py-3 rounded text-white text-lg
                              ${product.stock === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            Add to Cart
                        </button>
                    )}

                    {/* Reviews */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-1">Customer Reviews</h3>
                        <p className="text-sm text-gray-500">
                            No reviews yet ⭐
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
