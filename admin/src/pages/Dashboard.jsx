import React, { useEffect, useState } from "react";
import LowStockAlerts from "./LowStockAlerts";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Dashboard() {
    const [stats, setStats] = useState({});
    const role = localStorage.getItem("role");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/admin/dashboard/counts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-gray-500 mb-6">
                Track your store performance in real time
            </p>

            {/* 🔹 WELCOME (NORMAL USER) */}
            {stats.message && (
                <div className="bg-white p-6 rounded-xl shadow mb-6">
                    <h2 className="text-xl font-semibold">
                        {stats.message}
                    </h2>
                </div>
            )}

            {/* 🔹 DASHBOARD CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">

                {stats.products !== undefined && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-2xl font-bold">{stats.products}</p>
                    </div>
                )}

                {role === "superadmin" && stats.categories !== undefined && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Categories</p>
                        <p className="text-2xl font-bold">{stats.categories}</p>
                    </div>
                )}

                {stats.orders !== undefined && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Orders</p>
                        <p className="text-2xl font-bold">{stats.orders}</p>
                    </div>
                )}

                {role === "superadmin" && stats.users !== undefined && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Users</p>
                        <p className="text-2xl font-bold">{stats.users}</p>
                    </div>
                )}

            </div>

            {/* 🔹 LOW STOCK — ONLY SUPERADMIN & INVENTORY */}
            {(role === "superadmin" || role === "inventory") && (
                <LowStockAlerts />
            )}
        </div>
    );
}
