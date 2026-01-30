import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;



export default function LowStockAlerts() {
    const [lowStockItems, setLowStockItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products`);
                const lowStock = res.data.filter((item) => item.stock <= 3);
                setLowStockItems(lowStock);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchLowStock();
    }, []);

    const handleManageClick = (product) => {
        // Navigate to inventory and pass product via state
        navigate("/inventory", { state: { productToManage: product } });
    };

    return (
        <div className="low-stock-alerts p-4 bg-white rounded shadow">
            <h2 className="text-red-600 font-semibold mb-4">⚠️ Low Stock Alerts</h2>
            {lowStockItems.length === 0 ? (
                <p>All products are sufficiently stocked ✅</p>
            ) : (
                <ul>
                    {lowStockItems.map((item) => (
                        <li
                            key={item._id}
                            className="flex items-center justify-between border-b py-2"
                        >
                            <div className="flex items-center">
                                <img
                                    src={
                                        item.thumbnail?.startsWith("/uploads/")
                                            ? `${BASE_URL}${item.thumbnail}`
                                            : item.thumbnail
                                    }
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded mr-4"
                                />

                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-orange-500">Stock: {item.stock}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleManageClick(item)}
                                className="text-blue-600 hover:underline"
                            >
                                Manage →
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
