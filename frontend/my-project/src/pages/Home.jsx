import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../component/LoginPopup";


export default function Home() {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sliders, setSliders] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offers, setOffers] = useState([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const BASE_URL = "http://localhost:3000";


    const { cart, addToCart, increment, decrement } = useContext(CartContext);

    const { addToWishlist, isInWishlist } = useContext(WishlistContext);

    const navigate = useNavigate();
    const PRODUCTS_PER_LOAD = 20;

    const addToCartDB = async (productId, quantity = 1) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch("http://localhost:3000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                }),
            });
        } catch (err) {
            console.error("DB cart update failed", err);
        }
    };


    /* ================= SLIDER ================= */
    useEffect(() => {
        fetch("http://localhost:3000/api/slider")
            .then(res => res.json())
            .then(setSliders)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!sliders.length) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % sliders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [sliders]);

    /* ================= OFFERS ================= */
    useEffect(() => {
        fetch("http://localhost:3000/api/offers")
            .then(res => res.json())
            .then(data => Array.isArray(data) && setOffers(data))
            .catch(console.error);
    }, []);

    /* ================= PRODUCTS ================= */
    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setDisplayedProducts(data.slice(0, PRODUCTS_PER_LOAD));
            })
            .catch(console.error);
    }, []);


    const categories = [...new Set(products.map(p => p.category))];

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    useEffect(() => {
        setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_LOAD));
    }, [selectedCategory, products]);

    const loadMore = () => {
        const start = displayedProducts.length;
        const more = filteredProducts.slice(start, start + PRODUCTS_PER_LOAD);
        setDisplayedProducts(prev => [...prev, ...more]);
    };

    /* ================= OFFER LOGIC ================= */
    const getOfferForProduct = (product) =>
        offers.find(
            offer =>
                Array.isArray(offer.categories) &&
                offer.categories.includes(product.category)
        );

    const getDiscountedPrice = (price, discount) =>
        discount ? Math.round(price - (price * discount) / 100) : price;

    /* ================= UI ================= */
    return (
        <div className="p-10">

            {/* ================= SLIDER ================= */}
            <div className="w-full overflow-hidden relative h-60 mb-12">
                <div
                    className="flex transition-transform duration-700"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {sliders.map(slide => (
                        <img
                            key={slide._id}
                            src={`http://localhost:3000${slide.imageUrl}`}
                            alt={slide.title}
                            className="w-full h-60 object-cover flex-shrink-0"
                        />
                    ))}
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {sliders.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx === currentIndex
                                ? "bg-white"
                                : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ================= OFFERS ================= */}
            {offers.length > 0 && (
                <div className="mb-14">
                    <h2 className="text-center mb-6 text-2xl font-bold">
                        Best Offers For You
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {offers.map(offer => (
                            <div
                                key={offer._id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition"
                            >
                                {offer.banner && (
                                    <img
                                        src={`http://localhost:3000${offer.banner}`}
                                        alt={offer.title}
                                        className="h-40 w-full object-cover rounded-t-xl"
                                    />
                                )}

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">
                                        {offer.title}
                                    </h3>

                                    <p className="text-green-600 font-semibold">
                                        {offer.discount}% OFF
                                    </p>

                                    <p className="text-sm text-gray-500 mb-3">
                                        Min Cart ₹{offer.minCart}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/offers/${offer._id}`)}
                                        className="bg-blue-600 text-white p-3 rounded"
                                    >
                                        Apply Offer
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= PRODUCTS ================= */}
            <h2 className="text-center mb-6 text-2xl font-bold">
                All Products
            </h2>

            <div className="flex justify-center mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border px-4 py-2 rounded w-60"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedProducts.map(product => {
                    const offer = getOfferForProduct(product);
                    const finalPrice = offer
                        ? getDiscountedPrice(product.price, offer.discount)
                        : product.price;
                    const cartItem = cart.find(item => item.id === product._id);

                    return (
                        <div
                            key={product._id}
                            className="rounded-lg p-4 shadow bg-white relative cursor-pointer hover:shadow-lg"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            {/* ❤️ WISHLIST */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const token = localStorage.getItem("token");
                                    if (!token) {
                                        navigate("/login");
                                        return;
                                    }
                                    addToWishlist({
                                        id: product._id,          // 🔥 MUST
                                        title: product.title,
                                        price: product.price,
                                        thumbnail: product.thumbnail,
                                        category: product.category,
                                        rating: product.rating,
                                    });


                                }}
                                className="absolute top-2 right-2 text-xl"
                            >
                                {isInWishlist(product._id) ? "❤️" : "🤍"}
                            </button>

                            {offer && (
                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    {offer.discount}% OFF
                                </div>
                            )}

                            <img
                                src={
                                    product.images && product.images.length > 0
                                        ? `${BASE_URL}${product.images[0]}`
                                        : `${BASE_URL}${product.thumbnail}`
                                }
                                alt={product.title}
                                className="w-full h-32 object-contain mb-2"
                            />


                            {/* 🔥 STOCK INFO (YAHI ADD KARNA HAI) */}
                            {product.stock > 0 && product.stock <= 5 && (
                                <p className="text-xs text-red-600 font-semibold mb-1">
                                    Only {product.stock} items left
                                </p>
                            )}

                            {product.stock === 0 && (
                                <p className="text-xs text-gray-500 font-semibold mb-1">
                                    Out of stock
                                </p>
                            )}


                            <h3 className="text-sm font-medium mb-1">
                                {product.title}
                            </h3>

                            <div className="flex items-center gap-2 mb-2">
                                {offer && (
                                    <span className="text-gray-400 line-through text-sm">
                                        ₹{product.price}
                                    </span>
                                )}
                                <span className="font-bold text-green-600">
                                    ₹{finalPrice}
                                </span>
                            </div>

                            <div className="text-xs text-yellow-500 mb-2">
                                ⭐ {Number(product.rating || 0).toFixed(1)}

                            </div>
                            {cartItem ? (
                                <div
                                    className="w-full flex items-center justify-between bg-green-600 text-white py-1 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* ➖ DECREMENT */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            decrement(product._id);
                                        }}
                                    >
                                        −
                                    </button>

                                    <span>{cartItem.quantity}</span>

                                    {/* ➕ INCREMENT */}
                                    <button
                                        disabled={cartItem.quantity >= product.stock}
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            const token = localStorage.getItem("token");
                                            if (!token) {
                                                navigate("/login");   // 🔥 DIRECT LOGIN
                                                return;
                                            }

                                            if (cartItem.quantity >= product.stock) return;
                                            increment(product._id);
                                        }}
                                        className={
                                            cartItem.quantity >= product.stock
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    disabled={product.stock === 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        const token = localStorage.getItem("token");
                                        if (!token) {
                                            navigate("/login");   // 🔥 DIRECT LOGIN
                                            return;
                                        }

                                        addToCart({
                                            ...product,
                                            id: product._id,
                                            originalPrice: product.price,
                                            finalPrice,
                                        });
                                    }}
                                    className={`w-full py-1 rounded text-white
            ${product.stock === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {product.stock === 0 ? "OUT OF STOCK" : "ADD"}
                                </button>
                            )}




                        </div>
                    );
                })}
            </div>

            {displayedProducts.length < filteredProducts.length && (
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={loadMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded"
                    >
                        Load More
                    </button>
                </div>
            )}
            {/* 🔐 LOGIN POPUP */}
            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}

        </div>
    );
}
