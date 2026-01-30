import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Inventory", path: "/inventory" },
    { name: "Categories", path: "/categories" },
    { name: "Sliders", path: "/sliders" },
    { name: "Orders", path: "/orders" },
    { name: "Users", path: "/users" },
    { name: "Offers", path: "/offers" },

];

// ✅ DASHBOARD sab roles ke liye
const ROLE_PERMISSIONS = {
    superadmin: ["Dashboard", "Products", "Inventory", "Categories", "Sliders", "Orders", "Users", "Offers"],
    product: ["Dashboard", "Products", "Categories", "Sliders"],
    order: ["Dashboard", "Orders"],
    inventory: ["Dashboard", "Inventory"],
    user: ["Dashboard"],
};

export default function Header({ isLoggedIn, onLogout }) {
    const role = localStorage.getItem("role");
    const allowedLinks = ROLE_PERMISSIONS[role] || ["Dashboard"];

    return (
        <header className="w-full bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="text-xl font-bold">Admin Panel</div>

                <nav className="flex gap-4 items-center">
                    {navLinks
                        .filter(link => allowedLinks.includes(link.name))
                        .map(link => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded ${isActive
                                        ? "text-orange-500"
                                        : "text-white hover:bg-gray-800"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                    {isLoggedIn && (
                        <button
                            onClick={onLogout}
                            className="ml-4 flex items-center gap-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
