import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;



export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const msg =
                        res.status === 403
                            ? "Access Denied"
                            : "Failed to load orders";
                    throw new Error(msg);
                }
                return res.json();
            })
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Orders error:", err.message);
                setError(err.message);
            });
    }, []);

    if (error) {
        return (
            <div className="p-6 text-red-600 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                🧾 Orders Management
            </h2>

            {orders.length === 0 && (
                <p className="text-gray-500">
                    No orders found...
                </p>
            )}

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Order ID
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {order._id}
                                </p>
                            </div>

                            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                ₹{order.total}
                            </span>
                        </div>

                        {/* BODY */}
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <p>
                                    <span className="font-medium">
                                        User:
                                    </span>{" "}
                                    {order.userId?.email || "No email"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Date:
                                    </span>{" "}
                                    {order.createdAt
                                        ? order.createdAt.slice(
                                            0,
                                            10
                                        )
                                        : "No date"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Items:
                                    </span>{" "}
                                    {order.items?.length || 0}
                                </p>
                            </div>

                            {/* ITEMS */}
                            <div className="mt-5">
                                <p className="font-semibold mb-2">
                                    Items
                                </p>

                                <div className="divide-y">
                                    {order.items?.map((item, i) => (
                                        <div
                                            key={i}
                                            className="py-3 flex justify-between text-sm"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
