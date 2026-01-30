import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function OfferProducts() {
    const { offerId } = useParams();
    const [products, setProducts] = useState([]);

    const { cart, addToCart, increment, decrement } = useContext(CartContext);

    useEffect(() => {
        fetch(`${BASE_URL}/api/offers/${offerId}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            })
            .catch(err => console.error(err));
    }, [offerId]);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
                Offer Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => {
                    const cartItem = cart.find(
                        (item) => item.id === product._id
                    );

                    return (
                        <div
                            key={product._id}
                            className="bg-white shadow rounded p-4 flex flex-col"
                        >
                            <img
                                src={
                                    product.images && product.images.length > 0
                                        ? `${BASE_URL}${product.images[0]}`
                                        : `${BASE_URL}${product.thumbnail}`
                                }
                                className="h-40 mx-auto object-contain"
                                alt={product.title}
                            />


                            <h3 className="text-sm font-medium mt-2">
                                {product.title}
                            </h3>

                            <p className="font-semibold mt-1 mb-3">
                                ₹{product.price}
                            </p>

                            {/* 🔥 ADD TO CART / QTY (HOMEPAGE LOGIC) */}
                            {cartItem ? (
                                <div className="mt-auto w-full flex items-center justify-between bg-green-600 text-white py-2 px-3 rounded">
                                    <button
                                        onClick={() =>
                                            decrement(cartItem.id)
                                        }
                                        className="text-xl font-bold"
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold">
                                        {cartItem.quantity}
                                    </span>

                                    <button
                                        disabled={
                                            cartItem.quantity >= product.stock
                                        }
                                        onClick={() =>
                                            increment(cartItem.id)
                                        }
                                        className={`text-xl font-bold
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
                                        addToCart({
                                            ...product,
                                            id: product._id, // ✅ SAME AS HOMEPAGE
                                        })
                                    }
                                    className={`mt-auto w-full py-2 rounded text-white
                                        ${product.stock === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {product.stock === 0
                                        ? "OUT OF STOCK"
                                        : "ADD TO CART"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
