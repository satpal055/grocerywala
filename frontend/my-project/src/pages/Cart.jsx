import React, { useEffect, useState, useContext, useRef } from "react";

import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

export default function Cart() {

    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const mergeCarts = (localCart, dbCart) => {
        const map = new Map();

        localCart.forEach(item => {
            map.set(item.id, { ...item });
        });

        dbCart.forEach(item => {
            if (map.has(item.id)) {
                map.get(item.id).quantity += item.quantity;
            } else {
                map.set(item.id, item);
            }
        });

        return Array.from(map.values());
    };


    /* ---------------- FETCH CART FROM DB ---------------- */
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;

    //     fetch(`${BASE_URL}/api/cart`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(async (dbItems) => {
    //             // db cart → full product data merge
    //             const fullItems = await Promise.all(
    //                 dbItems.map(async (ci) => {
    //                     const res = await fetch(
    //                         `${BASE_URL}/api/products/${ci.productId}`
    //                     );
    //                     const product = await res.json();
    //                     return {
    //                         ...product,
    //                         id: product._id,
    //                         quantity: ci.quantity,
    //                         originalPrice: product.price,
    //                         finalPrice: product.price,
    //                     };
    //                 })
    //             );
    //             if (fullItems.length > 0) {
    //                 setCart(prev => mergeCarts(prev, fullItems));
    //             }


    //         })
    //         .catch(() => setCart([]));
    // }, [setCart]);

    /* ---------------- FETCH OFFERS ---------------- */
    useEffect(() => {
        fetch(`${BASE_URL}/api/offers`)
            .then(res => res.json())
            .then(data => Array.isArray(data) && setOffers(data))
            .catch(() => { });
    }, []);

    /* ---------------- IMAGE HELPER ---------------- */
    const getCartImage = (item) => {
        if (item.images && item.images.length > 0) {
            return `${BASE_URL}${item.images[0]}`;
        }
        if (item.thumbnail) {
            return item.thumbnail.startsWith("/uploads")
                ? `${BASE_URL}${item.thumbnail}`
                : item.thumbnail;
        }
        return "https://via.placeholder.com/80";
    };

    /* ---------------- DB HELPERS ---------------- */
    const updateDBCart = async (productId, quantity) => {
        await fetch(`${BASE_URL}/api/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ productId, quantity }),
        });
    };

    const removeFromDBCart = async (productId) => {
        await fetch(`${BASE_URL}/api/cart/remove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ productId }),
        });
    };

    /* ---------------- CART ACTIONS ---------------- */
    const increment = (id) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
        // updateDBCart(id, 1);
    };

    const decrement = (id) => {
        setCart(prev =>
            prev
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
        // updateDBCart(id, -1);
    };

    const removeItem = async (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
        // await removeFromDBCart(id);
    };

    /* ---------------- OFFER LOGIC ---------------- */
    const getOfferForItem = (item) => {
        if (!selectedOffer) return null;
        if (!Array.isArray(selectedOffer.categories)) return null;
        return selectedOffer.categories.includes(item.category)
            ? selectedOffer
            : null;
    };

    const getDiscountedPrice = (price, discount) =>
        discount ? Math.round(price - (price * discount) / 100) : price;

    /* ---------------- PRICE CALC ---------------- */
    const totalMRP = cart.reduce((sum, item) => {
        const offer = getOfferForItem(item);
        const final = offer
            ? getDiscountedPrice(item.price, offer.discount)
            : item.price;
        return sum + final * item.quantity;
    }, 0);

    const deliveryFee = cart.length ? 40 : 0;
    const totalPayable = totalMRP + deliveryFee;

    /* ---------------- CHECKOUT ---------------- */
    const handleCheckout = async () => {
        if (!cart.length) return;

        const res = await fetch(`${BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                items: cart,
                total: totalPayable,
                appliedOffer: selectedOffer || null,
            }),
        });

        if (res.ok) {
            alert("Order placed successfully!");
            setCart([]);
            navigate("/myorders");
        } else {
            alert("Order failed");
        }
    };

    /* ---------------- EMPTY CART ---------------- */
    if (!cart.length) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">Your Cart is Empty 🛒</h2>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full"
                >
                    Go Shopping
                </button>
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CART ITEMS */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => {
                        const offer = getOfferForItem(item);
                        const finalPrice = offer
                            ? getDiscountedPrice(item.price, offer.discount)
                            : item.price;

                        return (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                            >
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={getCartImage(item)}
                                        alt={item.title}
                                        className="w-16 h-16 object-contain"
                                    />

                                    <div>
                                        <p className="font-semibold">{item.title}</p>

                                        <div className="flex gap-2 items-center">
                                            {offer && (
                                                <span className="line-through text-gray-400 text-sm">
                                                    ₹{item.price}
                                                </span>
                                            )}
                                            <span className="text-green-600 font-bold">
                                                ₹{finalPrice}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            Item Total: ₹
                                            {(finalPrice * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => decrement(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increment(item.id)}>+</button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-3 text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* PRICE DETAILS */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h3 className="font-bold mb-4">Price Details</h3>

                    <div className="flex justify-between mb-2">
                        <span>Total Amount</span>
                        <span>₹{totalMRP.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between font-bold mb-4">
                        <span>Total Payable</span>
                        <span>₹{totalPayable.toFixed(2)}</span>
                    </div>

                    {/* OFFERS */}
                    <select
                        className="w-full border p-2 rounded mb-4"
                        value={selectedOffer?._id || ""}
                        onChange={(e) => {
                            const offer = offers.find(
                                o => o._id === e.target.value
                            );
                            setSelectedOffer(offer || null);
                        }}
                    >
                        <option value="">Apply Offer</option>
                        {offers.map(offer => (
                            <option key={offer._id} value={offer._id}>
                                {offer.title} ({offer.discount}% OFF)
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
