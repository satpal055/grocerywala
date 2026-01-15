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
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
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
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            })
            .catch((err) => {
                console.error("Orders fetch error:", err);
                setOrders([]);
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) {
        return <h2 className="p-10 text-center">Loading orders...</h2>;
    }

    if (!orders.length) {
        return <h2 className="p-10 text-center">No orders found 📦</h2>;
    }

    return (
        <div className="p-10 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="mb-6 p-4 bg-white shadow rounded"
                >
                    <p className="font-semibold mb-2">
                        Order Total: ₹{order.total}
                    </p>

                    {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 mb-3">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <p>{item.title}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
