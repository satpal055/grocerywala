import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const increment = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrement = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        const newCart = cart.filter((item) => item.id !== id);
        setCart(newCart);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        try {
            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        thumbnail: item.thumbnail,
                    })),
                    total,
                }),
            });

            if (res.ok) {
                alert("Order placed successfully!");

                // 🧹 Clear cart
                setCart([]);
                localStorage.removeItem("cart");

                navigate("/myorders");
            } else {
                alert("Error placing order!");
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Network Error");
        }
    };


    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    if (cart.length === 0) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-green-500 text-white px-5 py-2 rounded-full"
                >
                    Go Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            <div className="grid grid-cols-1 gap-6">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-white shadow rounded-lg"
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-20 h-20 object-contain rounded"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500">₹{item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => decrement(item.id)}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => increment(item.id)}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="ml-4 text-red-500 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end items-center gap-6">
                <div className="text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</div>
                <button
                    onClick={handleCheckout}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
