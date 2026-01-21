import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

export default function Cart() {
    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);

    /* ---------------- FETCH OFFERS ---------------- */
    useEffect(() => {
        fetch(`${BASE_URL}/api/offers`)
            .then(res => res.json())
            .then(data => Array.isArray(data) && setOffers(data))
            .catch(() => { });
    }, []);

    /* ---------------- OFFER LOGIC (SAME AS HOME) ---------------- */
    const getOfferForItem = (item) => {
        if (!selectedOffer) return null;
        if (!Array.isArray(selectedOffer.categories)) return null;
        return selectedOffer.categories.includes(item.category)
            ? selectedOffer
            : null;
    };

    const getDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return Math.round(price - (price * discount) / 100);
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
    };

    const decrement = (id) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    /* ---------------- PRICE CALC ---------------- */
    const totalMRP = cart.reduce(
        (sum, item) =>
            sum + (item.finalPrice ?? item.price) * item.quantity,
        0
    );


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
            localStorage.removeItem("cart");
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

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ---------------- CART ITEMS ---------------- */}
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
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-16 h-16 object-contain"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            {item.title}
                                        </p>

                                        {/* PRICE */}
                                        <div className="flex gap-2 items-center">
                                            {item.originalPrice && (
                                                <span className="line-through text-gray-400 text-sm">
                                                    ₹{item.originalPrice}
                                                </span>
                                            )}

                                            <span className="text-green-600 font-bold">
                                                ₹{item.finalPrice ?? item.price}
                                            </span>
                                        </div>


                                        <p className="text-sm text-gray-500">
                                            Item Total: ₹
                                            {(finalPrice * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => decrement(item.id)}
                                        className="border px-2 rounded"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increment(item.id)}
                                        className="border px-2 rounded"
                                    >
                                        +
                                    </button>
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

                {/* ---------------- PRICE DETAILS ---------------- */}
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

                    {/* APPLY OFFER */}
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
