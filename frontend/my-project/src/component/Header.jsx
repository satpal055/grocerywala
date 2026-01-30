import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ShoppingCart, Heart, UserCircle, Menu, X } from "lucide-react";

const BASE_URL = "http://localhost:3000";

export default function Header() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false); // 🔥 NEW

    const { totalItems } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);

    const toggleProfileMenu = () => {
        setShowProfileMenu(prev => !prev);
    };

    /* 🔐 LOGIN CHECK */
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setIsLoggedIn(true);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    /* 📦 FETCH PRODUCTS */
    useEffect(() => {
        fetch(`${BASE_URL}/api/products`)
            .then(res => res.json())
            .then(setProducts)
            .catch(console.error);
    }, []);

    /* 🔍 SEARCH */
    useEffect(() => {
        if (search.trim() === "") {
            setSuggestions([]);
            return;
        }

        const filtered = products.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 6));
    }, [search, products]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="w-full bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">

                    {/* LOGO */}
                    <div
                        onClick={() => navigate("/")}
                        className="text-2xl font-extrabold cursor-pointer"
                    >
                        <span className="text-yellow-400">Grocery </span>
                        <span className="text-green-500">Wala</span>
                    </div>

                    {/* 🔍 SEARCH (DESKTOP ONLY) */}
                    <div className="hidden lg:flex flex-1 mx-6 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search "rice"'
                            className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none"
                        />

                        {suggestions.length > 0 && (
                            <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-50">
                                {suggestions.map(product => (
                                    <div
                                        key={product._id}
                                        onClick={() => {
                                            navigate(`/product/${product._id}`);
                                            setSearch("");
                                            setSuggestions([]);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        <img
                                            src={
                                                product.thumbnail?.startsWith("http")
                                                    ? product.thumbnail
                                                    : `${BASE_URL}${product.thumbnail}`
                                            }
                                            className="w-10 h-10 object-contain"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{product.title}</p>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT ICONS (DESKTOP) */}
                    <div className="hidden lg:flex items-center gap-6">

                        <button onClick={() => navigate("/")}>Home</button>
                        <button onClick={() => navigate("/offers")}>Offer</button>
                        <button onClick={() => navigate("/myorders")}>My Orders</button>

                        {/* CART */}
                        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                            <ShoppingCart size={26} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </div>

                        {/* WISHLIST */}
                        <div onClick={() => navigate("/wishlist")} className="relative cursor-pointer">
                            <Heart size={26} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </div>

                        {/* PROFILE / LOGIN */}
                        {isLoggedIn && user ? (
                            <div className="relative">
                                <div
                                    onClick={toggleProfileMenu}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <UserCircle size={32} />
                                    <span className="text-sm">{user.name}</span>
                                </div>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-green-500 text-white px-5 py-2 rounded-full"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* 🍔 HAMBURGER (TABLET + MOBILE) */}
                    <button
                        className="lg:hidden"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                    >
                        {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>

                {/* 📱 MOBILE / TABLET MENU */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 bg-white rounded-xl shadow p-4 space-y-4">

                        {/* SEARCH */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search "rice"'
                            className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none"
                        />

                        {/* NAV LINKS */}
                        <button onClick={() => navigate("/")} className="block w-full text-left">Home</button>
                        <button onClick={() => navigate("/offers")} className="block w-full text-left">Offer</button>
                        <button onClick={() => navigate("/myorders")} className="block w-full text-left">My Orders</button>

                        <button onClick={() => navigate("/cart")} className="block w-full text-left">
                            Cart ({totalItems})
                        </button>

                        <button onClick={() => navigate("/wishlist")} className="block w-full text-left">
                            Wishlist ({wishlist.length})
                        </button>

                        {isLoggedIn && user ? (
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-red-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-green-500 text-white w-full py-2 rounded-full"
                            >
                                Login
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
