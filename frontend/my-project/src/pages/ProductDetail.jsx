import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://dummyjson.com/products/${id}`);
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

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 underline"
            >
                ← Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 shadow rounded">
                {/* IMAGE */}
                <img
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="w-full h-80 object-contain"
                    loading="lazy"
                />

                {/* DETAILS */}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

                    <div className="text-yellow-500 mb-2">
                        ⭐ {(product.rating ?? 0).toFixed(1)}
                    </div>

                    <div className="text-2xl font-semibold mb-3">
                        ₹{product.price ?? 0}
                    </div>

                    <p className="text-gray-600 mb-4">
                        {product.description || "No description available"}
                    </p>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
}
