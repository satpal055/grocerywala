import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { totalItems } = useContext(CartContext); // Use context

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="w-full bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center gap-6">

                    {/* LOGO */}
                    <div
                        onClick={() => navigate("/")}
                        className="text-2xl font-extrabold cursor-pointer"
                    >
                        <span className="text-yellow-400">Grocery </span>
                        <span className="text-green-500">Wala</span>
                    </div>


                    {/* SEARCH */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder='Search "rice"'
                            className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="  px-4 py-2  "
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/offers")}
                            className="  px-4 py-2 roun "
                        >
                            Offer
                        </button>
                        <button
                            onClick={() => navigate("/myorders")}
                            className="px-4 py-2 rounded bg-yellow-400 text-white"
                        >
                            My Orders
                        </button>

                    </div>


                    <div
                        onClick={() => navigate("/cart")}
                        className="relative cursor-pointer"
                    >
                        <ShoppingCart size={26} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>


                    {/* LOGIN / LOGOUT */}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-5 py-2 rounded-full"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-green-500 text-white px-5 py-2 rounded-full"
                        >
                            Login
                        </button>
                    )}

                </div>
            </div>
        </header>
    );
}
