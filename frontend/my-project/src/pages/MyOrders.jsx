import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:3000/api/orders/my", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(async (res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) setOrders(data);
                else setOrders([]);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [navigate]);

    /* ---------------- STATES ---------------- */
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-lg text-gray-500">
                ⏳ Fetching your orders...
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">
                    You haven’t placed any orders so far
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="p-10 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">
                🧾 Order History
            </h2>

            <div className="space-y-8">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="rounded-2xl bg-white shadow-lg border overflow-hidden"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white">
                            <div>
                                <p className="text-sm opacity-80">
                                    Order ID
                                </p>
                                <p className="font-semibold">
                                    #{order._id.slice(-6)}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm opacity-80">
                                    Total Amount
                                </p>
                                <p className="text-xl font-bold">
                                    ₹{order.total}
                                </p>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="p-6 space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-5 bg-gray-50 rounded-xl p-4"
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-20 h-20 object-contain bg-white rounded-lg shadow"
                                    />

                                    <div className="flex-1">
                                        <p className="font-semibold text-lg">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">
                                            Price
                                        </p>
                                        <p className="font-bold text-green-600 text-lg">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
